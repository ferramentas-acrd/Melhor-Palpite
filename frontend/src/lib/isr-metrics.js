// src/lib/isr-metrics.js
// Sistema de métricas e monitoramento para ISR

export class ISRMetrics {
  constructor(env) {
    this.env = env;
    this.prefix = '_metrics/';
  }

  // Registra uma métrica
  async record(type, data = {}) {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}`;
    
    const key = `${this.prefix}${type}/${hourKey}`;
    
    try {
      // Obtém métricas existentes para a hora
      let metrics = await this.getHourlyMetrics(type, hourKey);
      if (!metrics) {
        metrics = {
          hour: hourKey,
          type,
          count: 0,
          data: [],
          summary: {}
        };
      }
      
      // Adiciona nova métrica
      metrics.count++;
      metrics.data.push({
        timestamp,
        ...data
      });
      
      // Atualiza resumo
      this.updateSummary(metrics.summary, data);
      
      // Limita o tamanho dos dados detalhados (mantém últimos 100)
      if (metrics.data.length > 100) {
        metrics.data = metrics.data.slice(-100);
      }
      
      // Salva métricas
      await this.env.R2_CACHE.put(key, JSON.stringify(metrics));
    } catch (error) {
      console.error(`[Metrics] Error recording ${type}:`, error);
    }
  }

  // Atualiza resumo de métricas
  updateSummary(summary, data) {
    // Contadores gerais
    summary.total = (summary.total || 0) + 1;
    
    // Por status de cache
    if (data.cacheStatus) {
      summary.cacheStatus = summary.cacheStatus || {};
      summary.cacheStatus[data.cacheStatus] = (summary.cacheStatus[data.cacheStatus] || 0) + 1;
    }
    
    // Por rota
    if (data.path) {
      summary.topPaths = summary.topPaths || {};
      summary.topPaths[data.path] = (summary.topPaths[data.path] || 0) + 1;
    }
    
    // Tempos de resposta
    if (data.responseTime) {
      summary.responseTime = summary.responseTime || { total: 0, count: 0, min: Infinity, max: 0 };
      summary.responseTime.total += data.responseTime;
      summary.responseTime.count++;
      summary.responseTime.min = Math.min(summary.responseTime.min, data.responseTime);
      summary.responseTime.max = Math.max(summary.responseTime.max, data.responseTime);
      summary.responseTime.avg = summary.responseTime.total / summary.responseTime.count;
    }
    
    // Taxa de erro
    if (data.error) {
      summary.errors = (summary.errors || 0) + 1;
    }
  }

  // Obtém métricas de uma hora específica
  async getHourlyMetrics(type, hour) {
    try {
      const key = `${this.prefix}${type}/${hour}`;
      const data = await this.env.R2_CACHE.get(key);
      if (!data) return null;
      return JSON.parse(await data.text());
    } catch {
      return null;
    }
  }

  // Obtém resumo de métricas
  async getSummary(hours = 24) {
    const now = Date.now();
    const summary = {
      period: {
        start: new Date(now - hours * 60 * 60 * 1000).toISOString(),
        end: new Date(now).toISOString(),
        hours
      },
      requests: {
        total: 0,
        byStatus: {},
        byHour: []
      },
      cache: {
        hits: 0,
        misses: 0,
        stale: 0,
        hitRate: 0
      },
      performance: {
        avgResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0
      },
      topPaths: [],
      errors: {
        total: 0,
        rate: 0
      },
      invalidations: {
        total: 0,
        byType: {}
      }
    };
    
    // Coleta métricas por hora
    const allResponseTimes = [];
    
    for (let i = 0; i < hours; i++) {
      const date = new Date(now - i * 60 * 60 * 1000);
      const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}`;
      
      // Métricas de requisições
      const requests = await this.getHourlyMetrics('request', hourKey);
      if (requests) {
        summary.requests.total += requests.count;
        
        // Acumula status de cache
        if (requests.summary.cacheStatus) {
          Object.entries(requests.summary.cacheStatus).forEach(([status, count]) => {
            summary.requests.byStatus[status] = (summary.requests.byStatus[status] || 0) + count;
            
            if (status === 'HIT' || status === 'FRESH') summary.cache.hits += count;
            else if (status === 'MISS') summary.cache.misses += count;
            else if (status === 'STALE') summary.cache.stale += count;
          });
        }
        
        // Coleta tempos de resposta
        if (requests.data) {
          requests.data.forEach(req => {
            if (req.responseTime) allResponseTimes.push(req.responseTime);
          });
        }
        
        // Erros
        if (requests.summary.errors) {
          summary.errors.total += requests.summary.errors;
        }
        
        // Adiciona à série temporal
        summary.requests.byHour.unshift({
          hour: hourKey,
          count: requests.count,
          cacheHitRate: this.calculateHitRate(requests.summary.cacheStatus)
        });
      }
      
      // Métricas de invalidação
      const invalidations = await this.getHourlyMetrics('invalidation', hourKey);
      if (invalidations) {
        summary.invalidations.total += invalidations.count;
        
        if (invalidations.summary.byType) {
          Object.entries(invalidations.summary.byType).forEach(([type, count]) => {
            summary.invalidations.byType[type] = (summary.invalidations.byType[type] || 0) + count;
          });
        }
      }
    }
    
    // Calcula estatísticas finais
    const totalCacheRequests = summary.cache.hits + summary.cache.misses + summary.cache.stale;
    summary.cache.hitRate = totalCacheRequests > 0 ? 
      ((summary.cache.hits + summary.cache.stale) / totalCacheRequests * 100).toFixed(2) : 0;
    
    summary.errors.rate = summary.requests.total > 0 ?
      (summary.errors.total / summary.requests.total * 100).toFixed(2) : 0;
    
    // Calcula percentis de tempo de resposta
    if (allResponseTimes.length > 0) {
      allResponseTimes.sort((a, b) => a - b);
      summary.performance.avgResponseTime = 
        Math.round(allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length);
      summary.performance.p95ResponseTime = 
        Math.round(allResponseTimes[Math.floor(allResponseTimes.length * 0.95)]);
      summary.performance.p99ResponseTime = 
        Math.round(allResponseTimes[Math.floor(allResponseTimes.length * 0.99)]);
    }
    
    // Top paths (agregado de todas as horas)
    const pathCounts = {};
    for (let i = 0; i < hours; i++) {
      const date = new Date(now - i * 60 * 60 * 1000);
      const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}`;
      
      const requests = await this.getHourlyMetrics('request', hourKey);
      if (requests?.summary.topPaths) {
        Object.entries(requests.summary.topPaths).forEach(([path, count]) => {
          pathCounts[path] = (pathCounts[path] || 0) + count;
        });
      }
    }
    
    summary.topPaths = Object.entries(pathCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count, percentage: (count / summary.requests.total * 100).toFixed(2) }));
    
    return summary;
  }

  // Calcula taxa de hit do cache
  calculateHitRate(cacheStatus) {
    if (!cacheStatus) return 0;
    const total = Object.values(cacheStatus).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    const hits = (cacheStatus.HIT || 0) + (cacheStatus.FRESH || 0) + (cacheStatus.STALE || 0);
    return (hits / total * 100).toFixed(2);
  }

  // Limpa métricas antigas
  async cleanup(daysToKeep = 7) {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const list = await this.env.R2_CACHE.list({ prefix: this.prefix });
    
    let deleted = 0;
    for (const obj of list.objects) {
      const uploaded = new Date(obj.uploaded).getTime();
      if (uploaded < cutoff) {
        await this.env.R2_CACHE.delete(obj.key);
        deleted++;
      }
    }
    
    console.log(`[Metrics] Cleaned up ${deleted} old metric entries`);
    return deleted;
  }
}

// Middleware para registrar métricas
export function metricsMiddleware(metrics) {
  return async (request, response, context) => {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    try {
      // Registra a requisição
      await metrics.record('request', {
        path: url.pathname,
        method: request.method,
        cacheStatus: response.headers.get('X-Cache') || 'UNKNOWN',
        responseTime: Date.now() - startTime,
        statusCode: response.status,
        error: response.status >= 400
      });
    } catch (error) {
      console.error('[Metrics] Error recording request:', error);
    }
    
    return response;
  };
}