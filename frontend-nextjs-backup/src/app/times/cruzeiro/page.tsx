import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CruzeiroPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">⭐</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Cruzeiro Esporte Clube</h1>
                <p className="text-xl opacity-90">A Raposa • Fundado em 1921</p>
                <div className="flex items-center space-x-4 mt-4">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded">Série A</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded">Belo Horizonte - MG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Latest News */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Últimas Notícias do Cruzeiro</h2>
                
                {/* Featured News */}
                <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold mr-3">
                      DESTAQUE
                    </span>
                    <span className="text-sm opacity-90">Há 2 horas</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Cruzeiro anuncia reforços para disputa do Brasileirão 2025
                  </h3>
                  <p className="text-lg opacity-90 mb-4">
                    Direção celeste confirma chegada de três jogadores para fortalecer elenco 
                    na briga pelo título nacional. Investimento supera R$ 50 milhões.
                  </p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                    Ler mais
                  </button>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Cruzeiro vence clássico mineiro por 2x1",
                      excerpt: "Raposa supera Atlético-MG no Mineirão com gols de Matheus Henrique e Rafael Silva.",
                      time: "Há 6 horas",
                      category: "Jogos"
                    },
                    {
                      title: "Renovação de contrato com a camisa 10",
                      excerpt: "Meio-campista assina extensão até dezembro de 2027 com o clube celeste.",
                      time: "Há 1 dia",
                      category: "Mercado"
                    },
                    {
                      title: "Base do Cruzeiro se destaca em torneio",
                      excerpt: "Time sub-20 avança às semifinais da Copa do Brasil da categoria.",
                      time: "Há 2 dias",
                      category: "Base"
                    },
                    {
                      title: "Torcida esgota ingressos para próximo jogo",
                      excerpt: "Partida contra o Flamengo terá casa cheia no Mineirão neste domingo.",
                      time: "Há 3 dias",
                      category: "Torcida"
                    }
                  ].map((article, index) => (
                    <article key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                      <div className="text-xs text-gray-500">{article.time}</div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Squad Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Elenco Principal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Fábio", position: "Goleiro", number: "1", status: "Titular" },
                    { name: "William", position: "Zagueiro", number: "3", status: "Titular" },
                    { name: "Luciano Castán", position: "Zagueiro", number: "4", status: "Titular" },
                    { name: "Marlon", position: "Lateral", number: "6", status: "Titular" },
                    { name: "Matheus Henrique", position: "Meio-campo", number: "8", status: "Titular" },
                    { name: "Rafael Silva", position: "Atacante", number: "11", status: "Titular" }
                  ].map((player, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{player.name}</span>
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {player.number}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{player.position}</div>
                      <div className="text-xs text-green-600 font-medium">{player.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Estatísticas da Temporada</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                    <div className="text-sm text-gray-600">Vitórias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
                    <div className="text-sm text-gray-600">Empates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">5</div>
                    <div className="text-sm text-gray-600">Derrotas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">42</div>
                    <div className="text-sm text-gray-600">Gols Marcados</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3">Artilheiros</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Rafael Silva</span>
                          <span className="font-bold">12 gols</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Matheus Henrique</span>
                          <span className="font-bold">8 gols</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lucas Silva</span>
                          <span className="font-bold">6 gols</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3">Assistências</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Matheus Henrique</span>
                          <span className="font-bold">9 assists</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Marlon</span>
                          <span className="font-bold">7 assists</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rafael Silva</span>
                          <span className="font-bold">5 assists</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Next Match */}
              <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
                <h3 className="font-bold mb-4">Próximo Jogo</h3>
                <div className="text-center">
                  <div className="text-sm opacity-80 mb-2">Domingo, 24/09</div>
                  <div className="text-sm opacity-80 mb-2">16h - Mineirão</div>
                  <div className="text-lg font-bold mb-3">Cruzeiro vs Flamengo</div>
                  <div className="bg-white bg-opacity-20 rounded p-3 mb-3">
                    <div className="text-sm">Brasileirão - Rodada 28</div>
                  </div>
                  <button className="w-full bg-white text-blue-600 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
                    Comprar Ingressos
                  </button>
                </div>
              </div>

              {/* Recent Results */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-4">Resultados Recentes</h3>
                <div className="space-y-3">
                  {[
                    { opponent: "Atlético-MG", result: "2-1", status: "V", home: true },
                    { opponent: "São Paulo", result: "0-1", status: "D", home: false },
                    { opponent: "Palmeiras", result: "1-1", status: "E", home: true },
                    { opponent: "Corinthians", result: "3-0", status: "V", home: false }
                  ].map((match, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                          ${match.status === 'V' ? 'bg-green-600' : match.status === 'E' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                          {match.status}
                        </div>
                        <span className="text-sm">
                          {match.home ? 'vs' : '@'} {match.opponent}
                        </span>
                      </div>
                      <span className="text-sm font-bold">{match.result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* League Table Position */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold mb-4">Posição na Tabela</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">6º</div>
                  <div className="text-sm text-gray-600 mb-4">Brasileirão Série A</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pontos</span>
                      <span className="font-bold">53</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jogos</span>
                      <span className="font-bold">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aproveitamento</span>
                      <span className="font-bold">63%</span>
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