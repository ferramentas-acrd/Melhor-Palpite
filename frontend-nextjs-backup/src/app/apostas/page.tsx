import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ApostasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Apostas Esportivas</h1>
                <p className="text-gray-600 text-lg">
                  Descubra as melhores casas de apostas, dicas exclusivas e prognósticos 
                  para maximizar seus ganhos no mundo dos esportes.
                </p>
              </div>

              {/* Featured Article */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-8 mb-8">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold mr-3">
                    EXCLUSIVO
                  </span>
                  <span className="text-sm opacity-90">João Silva • Há 1 hora</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  Guia Completo: Como Escolher a Melhor Casa de Apostas em 2025
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Análise detalhada dos principais critérios para avaliar plataformas de apostas: 
                  odds, bônus, métodos de pagamento e muito mais.
                </p>
                <button className="bg-white text-red-600 px-6 py-3 rounded font-bold hover:bg-gray-100 transition-colors">
                  Ler Artigo Completo
                </button>
              </div>

              {/* Top Betting Houses */}
              <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center">🏆 Top 5 Melhores Casas de Apostas</h2>
                <div className="space-y-6">
                  {[
                    {
                      rank: 1,
                      name: "bet365",
                      logo: "🎯",
                      rating: 4.9,
                      bonus: "100% até R$500",
                      features: ["Transmissão ao vivo", "Cash Out", "Odds competitivas"],
                      pros: ["Interface intuitiva", "Suporte 24/7", "Ampla variedade de esportes"],
                      color: "bg-green-600"
                    },
                    {
                      rank: 2,
                      name: "Superbet",
                      logo: "⚡",
                      rating: 4.8,
                      bonus: "100% até R$750",
                      features: ["SuperOdds", "Apostas grátis", "Missões semanais"],
                      pros: ["Bônus generoso", "App mobile excelente", "Odds competitivas"],
                      color: "bg-blue-600"
                    },
                    {
                      rank: 3,
                      name: "Betsson",
                      logo: "🔥",
                      rating: 4.7,
                      bonus: "100% até R$600",
                      features: ["Múltiplas turbinadas", "Pix instantâneo", "Estatísticas"],
                      pros: ["Depósitos rápidos", "Promoções exclusivas", "Licença confiável"],
                      color: "bg-purple-600"
                    }
                  ].map((house) => (
                    <div key={house.rank} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`${house.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl`}>
                            {house.rank}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-2xl">{house.logo}</span>
                              <h3 className="text-xl font-bold">{house.name}</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className="text-yellow-400">★</span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{house.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold">
                            {house.bonus}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold mb-2">Principais Recursos:</h4>
                          <ul className="text-sm space-y-1">
                            {house.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <span className="text-green-600 mr-2">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Vantagens:</h4>
                          <ul className="text-sm space-y-1">
                            {house.pros.map((pro, i) => (
                              <li key={i} className="flex items-center">
                                <span className="text-blue-600 mr-2">+</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition-colors">
                          Apostar Agora
                        </button>
                        <button className="px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors">
                          Review Completo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Articles */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Últimos Artigos sobre Apostas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Estratégias Avançadas para Apostas de Futebol",
                      excerpt: "Descubra técnicas profissionais para aumentar suas chances de lucro nas apostas esportivas.",
                      category: "Estratégias",
                      readTime: "8 min",
                      author: "Carlos Pereira"
                    },
                    {
                      title: "Análise: Melhores Odds para o Brasileirão 2025",
                      excerpt: "Comparativo completo das odds oferecidas pelas principais casas para o campeonato nacional.",
                      category: "Análises",
                      readTime: "6 min",
                      author: "Maria Santos"
                    },
                    {
                      title: "Como Gerenciar sua Banca de Apostas",
                      excerpt: "Guia essencial para controlar seu bankroll e apostar com responsabilidade.",
                      category: "Dicas",
                      readTime: "5 min",
                      author: "João Silva"
                    },
                    {
                      title: "Apostas ao Vivo: Guia Completo",
                      excerpt: "Tudo sobre live betting: quando apostar, estratégias e as melhores oportunidades.",
                      category: "Guias",
                      readTime: "10 min",
                      author: "Pedro Lima"
                    }
                  ].map((article, index) => (
                    <article key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium mr-2">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.readTime} de leitura</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 hover:text-red-600 transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{article.author}</span>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Ler mais →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Calculator */}
              <div className="bg-red-600 text-white rounded-lg p-6 mb-6">
                <h3 className="font-bold mb-4">Calculadora de Apostas</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Valor da Aposta (R$)</label>
                    <input 
                      type="number" 
                      placeholder="100"
                      className="w-full p-2 rounded text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Odd</label>
                    <input 
                      type="number" 
                      placeholder="2.50"
                      step="0.01"
                      className="w-full p-2 rounded text-black"
                    />
                  </div>
                  <div className="bg-black bg-opacity-20 rounded p-3">
                    <div className="text-sm">Retorno potencial:</div>
                    <div className="text-xl font-bold">R$ 250,00</div>
                    <div className="text-sm opacity-80">Lucro: R$ 150,00</div>
                  </div>
                </div>
              </div>

              {/* Popular Categories */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-4">Categorias Populares</h3>
                <div className="space-y-2">
                  {[
                    { name: "Melhores Casas", count: "15 artigos" },
                    { name: "Estratégias", count: "28 artigos" },
                    { name: "Bônus", count: "12 artigos" },
                    { name: "Dicas", count: "45 artigos" },
                    { name: "Análises", count: "32 artigos" }
                  ].map((category, index) => (
                    <a key={index} href="#" className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Responsible Gaming */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-600 text-xl mr-2">⚠️</span>
                  <h3 className="font-bold text-yellow-800">Jogo Responsável</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  Aposte com consciência. Defina limites e jogue apenas o que pode perder.
                </p>
                <a href="/jogo-responsavel" className="text-yellow-800 text-sm font-medium hover:underline">
                  Saiba mais →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}