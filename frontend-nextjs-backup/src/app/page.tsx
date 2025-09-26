import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Article */}
              <div className="bg-red-600 text-white rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <span className="bg-white text-red-600 px-3 py-1 rounded text-sm font-bold mr-3">
                    AO VIVO
                  </span>
                  <span className="text-sm opacity-90">João Silva • Há 15 minutos</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  Flamengo vence Corinthians e dispara na liderança do Brasileirão
                </h1>
                <p className="text-lg mb-4 opacity-90">
                  Com gols de Pedro e Arrascaeta, time carioca abre 5 pontos de vantagem e encaminha título. 
                  Análise completa do jogo e as melhores apostas para a próxima rodada.
                </p>
                <div className="flex items-center text-sm">
                  <span className="mr-4">5 min de leitura</span>
                </div>
              </div>

              {/* Latest News Grid */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Últimas Notícias</h2>
                  <a href="/noticias" className="text-red-600 hover:text-red-700 font-medium">
                    Ver Todas →
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Real Madrid sofre sua pior derrota em casa nos últimos 10 anos",
                      excerpt: "Time merengue é goleado pelo Barcelona por 4x0 no Santiago Bernabéu e vê rival disparar na liderança do campeonato espanhol.",
                      author: "Pedro Costa",
                      time: "Há 2 horas",
                      category: "Champions League"
                    },
                    {
                      title: "Palmeiras anuncia novo técnico português",
                      excerpt: "Direção alviverde confirma contratação de treinador europeu para a temporada 2025.",
                      author: "Ana Santos",
                      time: "Há 3 horas",
                      category: "Brasileirão"
                    },
                    {
                      title: "Liverpool vence clássico e assume liderança",
                      excerpt: "Reds superam Manchester City em Anfield e voltam ao topo da Premier League.",
                      author: "Carlos Lima",
                      time: "Há 4 horas",
                      category: "Premier League"
                    },
                    {
                      title: "Brasil convoca para eliminatórias",
                      excerpt: "Técnico da seleção divulga lista com 23 jogadores para próximos compromissos.",
                      author: "Roberto Silva",
                      time: "Há 5 horas",
                      category: "Seleção"
                    }
                  ].map((article, index) => (
                    <article key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 hover:text-red-600 transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                      <div className="text-xs text-gray-500">
                        {article.author} • {article.time}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Betting Houses Section */}
              <div className="bg-black text-white rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Melhores Casas de Apostas</h2>
                <p className="text-center text-gray-300 mb-6">Compare e escolha a melhor opção para suas apostas</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "bet365",
                      rank: "1º",
                      stars: 5,
                      code: "APP300",
                      features: ["Streaming ao vivo", "Cash out disponível", "Odds competitivas", "App para Android e iOS"]
                    },
                    {
                      name: "Superbet",
                      rank: "2º", 
                      stars: 5,
                      code: "APP300",
                      features: ["SuperOdds diárias", "Apostas grátis", "Missões semanais", "Suporte 24/7"]
                    },
                    {
                      name: "Betsson",
                      rank: "3º",
                      stars: 4,
                      code: "APP300", 
                      features: ["Múltiplas turbinadas", "Depósito via Pix", "Estatísticas completas", "Promoções exclusivas"]
                    }
                  ].map((house, index) => (
                    <div key={index} className="bg-white text-black rounded-lg p-4">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                            {house.rank}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < house.stars ? "text-yellow-400" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{house.name}</h3>
                        <div className="bg-red-600 text-white px-3 py-1 rounded text-sm mt-2">
                          Use o código: {house.code}
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 mb-4">
                        {house.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                        APOSTAR AGORA
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Games Today Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Jogos de Hoje</h2>
                  <a href="/jogos" className="text-red-600 hover:text-red-700 font-medium">
                    Ver Todos →
                  </a>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">PARTIDA</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">CASA</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">EMPATE</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">VISITANTE</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">MERCADOS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { time: "20:00", match: "Flamengo x Corinthians", odds: ["1.85", "3.40", "4.20"], markets: "+245" },
                          { time: "21:30", match: "Barcelona x Real Madrid", odds: ["2.45", "3.25", "2.85"], markets: "+312" },
                          { time: "16:00", match: "Liverpool x Manchester City", odds: ["1.92", "3.50", "3.80"], markets: "+287" }
                        ].map((game, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mr-3">
                                  AO VIVO
                                </span>
                                <div>
                                  <div className="font-medium">{game.match}</div>
                                  <div className="text-sm text-gray-500">{game.time}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-bold">{game.odds[0]}</td>
                            <td className="px-4 py-3 text-center font-bold">{game.odds[1]}</td>
                            <td className="px-4 py-3 text-center font-bold">{game.odds[2]}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-red-600 font-bold">{game.markets}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Live Betting */}
              <div className="bg-black text-white rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-4">Apostas ao Vivo</h3>
                <div className="space-y-3">
                  {[
                    { match: "Barcelona x Real Madrid", odds: "2.45" },
                    { match: "Liverpool x Man City", odds: "1.92" },
                    { match: "PSG x Lyon", odds: "1.55" },
                    { match: "Milan x Inter", odds: "3.10" }
                  ].map((bet, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{bet.match}</span>
                      <span className="font-bold">{bet.odds}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Read */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-4">Mais Lidas</h3>
                <div className="space-y-4">
                  {[
                    { title: "Neymar pode voltar ao Santos em 2025", reads: "12.5k" },
                    { title: "Messi anuncia aposentadoria da seleção", reads: "9.2k" },
                    { title: "Top 10 apostas para o fim de semana", reads: "7.8k" }
                  ].map((article, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium hover:text-red-600 cursor-pointer">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{article.reads} leituras</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Vídeos</h3>
                  <a href="/videos" className="text-red-600 text-sm hover:text-red-700">Ver Todos →</a>
                </div>
                <div className="space-y-3">
                  <div className="relative bg-red-600 rounded aspect-video flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl">▶</span>
                      </div>
                      <p className="text-sm font-medium">Análise completa: Flamengo 3x1 Corinthians</p>
                      <p className="text-xs opacity-80">45.2K visualizações • Há 2 horas • 12:45</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">▶</span>
                      <span>Gols da rodada: Os 10 melhores da semana</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">▶</span>
                      <span>Entrevista exclusiva com técnico do Flamengo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}