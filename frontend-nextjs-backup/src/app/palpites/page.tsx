import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PalpitesPage() {
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
                <h1 className="text-4xl font-bold mb-4">Palpites e Prognósticos</h1>
                <p className="text-gray-600 text-lg">
                  Análises especializadas e palpites certeiros para os principais jogos do futebol mundial. 
                  Baseados em estatísticas e conhecimento técnico.
                </p>
              </div>

              {/* Featured Prediction */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold mr-3">
                      PALPITE PREMIUM
                    </span>
                    <span className="text-sm opacity-90">Hoje • 20:00</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Taxa de acerto</div>
                    <div className="text-2xl font-bold">87%</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold mb-2">Flamengo</div>
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto flex items-center justify-center">
                      🔴
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm opacity-80 mb-2">Brasileirão - Rodada 34</div>
                    <div className="text-3xl font-bold mb-2">VS</div>
                    <div className="bg-black bg-opacity-20 rounded px-3 py-1">Maracanã</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold mb-2">Corinthians</div>
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto flex items-center justify-center">
                      ⚫
                    </div>
                  </div>
                </div>

                <div className="bg-black bg-opacity-20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Nosso Palpite Principal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Vitória do Flamengo</span>
                        <span className="bg-green-500 px-2 py-1 rounded text-sm font-bold">1.85</span>
                      </div>
                      <div className="text-sm opacity-80 mb-4">
                        Flamengo vem de 5 vitórias consecutivas e joga em casa com apoio da torcida.
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-2">⭐</span>
                        <span className="text-sm">Confiança: Alta (4/5)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">Palpites Secundários:</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mais de 2.5 gols</span>
                          <span className="text-green-400">2.10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pedro marcar</span>
                          <span className="text-green-400">2.75</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ambos marcam</span>
                          <span className="text-green-400">1.95</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Predictions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Palpites de Hoje</h2>
                <div className="space-y-6">
                  {[
                    {
                      league: "Champions League",
                      time: "16:00",
                      homeTeam: "Barcelona",
                      awayTeam: "Real Madrid",
                      prediction: "Vitória Barcelona",
                      odds: "2.45",
                      confidence: 4,
                      reason: "Barcelona superior tecnicamente e jogando em casa"
                    },
                    {
                      league: "Premier League", 
                      time: "13:30",
                      homeTeam: "Liverpool",
                      awayTeam: "Manchester City",
                      prediction: "Empate",
                      odds: "3.50",
                      confidence: 3,
                      reason: "Clássico equilibrado entre dois gigantes ingleses"
                    },
                    {
                      league: "Brasileirão",
                      time: "18:00",
                      homeTeam: "Palmeiras",
                      awayTeam: "Santos",
                      prediction: "Mais de 2.5 gols",
                      odds: "1.90",
                      confidence: 5,
                      reason: "Ambas equipes com ataques eficientes e defesas vulneráveis"
                    }
                  ].map((match, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                            {match.league}
                          </span>
                          <span className="text-sm text-gray-500">{match.time}</span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < match.confidence ? "text-yellow-400" : "text-gray-300"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">{match.homeTeam}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">VS</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{match.awayTeam}</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-bold text-lg text-green-600">{match.prediction}</span>
                            <span className="bg-green-600 text-white px-2 py-1 rounded ml-2 text-sm">
                              {match.odds}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{match.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Analysis */}
              <div className="bg-gray-50 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Análise dos Especialistas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      analyst: "João Silva",
                      title: "Especialista em Brasileirão",
                      prediction: "Flamengo campeão com 3 rodadas de antecedência",
                      accuracy: "89%",
                      avatar: "👨‍💼"
                    },
                    {
                      analyst: "Maria Santos", 
                      title: "Analista de Futebol Europeu",
                      prediction: "Manchester City favorito na Champions League",
                      accuracy: "85%",
                      avatar: "👩‍💼"
                    }
                  ].map((expert, index) => (
                    <div key={index} className="bg-white rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">{expert.avatar}</span>
                        <div>
                          <h3 className="font-bold">{expert.analyst}</h3>
                          <p className="text-sm text-gray-600">{expert.title}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-green-600 font-medium">
                              {expert.accuracy} de acertos
                            </span>
                          </div>
                        </div>
                      </div>
                      <blockquote className="text-gray-700 italic">
                        "{expert.prediction}"
                      </blockquote>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Success Rate */}
              <div className="bg-green-600 text-white rounded-lg p-6 mb-6">
                <h3 className="font-bold mb-4">Taxa de Acerto</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">84%</div>
                  <div className="text-sm opacity-80 mb-4">Últimos 30 dias</div>
                  <div className="bg-black bg-opacity-20 rounded p-3">
                    <div className="text-sm">Palpites certeiros: 67/80</div>
                  </div>
                </div>
              </div>

              {/* Popular Leagues */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-4">Ligas Populares</h3>
                <div className="space-y-3">
                  {[
                    { league: "Brasileirão", games: "8 jogos hoje", flag: "🇧🇷" },
                    { league: "Champions League", games: "4 jogos hoje", flag: "🏆" },
                    { league: "Premier League", games: "6 jogos hoje", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
                    { league: "La Liga", games: "5 jogos hoje", flag: "🇪🇸" },
                    { league: "Serie A", games: "3 jogos hoje", flag: "🇮🇹" }
                  ].map((league, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center">
                        <span className="mr-2">{league.flag}</span>
                        <span className="font-medium">{league.league}</span>
                      </div>
                      <span className="text-xs text-gray-500">{league.games}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Hits */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold mb-4">Acertos Recentes</h3>
                <div className="space-y-3">
                  {[
                    { match: "Real Madrid 2-1 Atletico", prediction: "Real Madrid", status: "✅" },
                    { match: "Barcelona 3-0 Sevilla", prediction: "Mais 2.5 gols", status: "✅" },
                    { match: "Liverpool 1-1 Arsenal", prediction: "Empate", status: "✅" }
                  ].map((hit, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">{hit.match}</div>
                        <div className="text-gray-600">{hit.prediction}</div>
                      </div>
                      <span className="text-lg">{hit.status}</span>
                    </div>
                  ))}
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