import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="bg-red-600 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Receba as Melhores Notícias</h3>
          <p className="mb-6">Cadastre-se e receba análises exclusivas, dicas de apostas e as últimas notícias do futebol mundial.</p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-l text-black"
            />
            <button className="bg-black text-white px-6 py-3 rounded-r font-medium hover:bg-gray-800 transition-colors">
              Inscrever
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-red-600 text-white p-2 rounded font-bold text-xl">
                  DF
                </div>
                <div>
                  <h2 className="text-xl font-bold">Diário do Futebol</h2>
                  <p className="text-gray-400 text-sm">Esportes • Apostas • Notícias</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                O portal mais completo de esportes e apostas do Brasil. 
                Notícias em tempo real, análises exclusivas e as melhores 
                dicas para suas apostas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-xl">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-xl">▶</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-xl">in</span>
                </a>
              </div>
            </div>

            {/* Futebol */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Futebol</h3>
              <ul className="space-y-2">
                <li><Link href="/brasileirao" className="text-gray-400 hover:text-white transition-colors">Brasileirão</Link></li>
                <li><Link href="/copa-do-brasil" className="text-gray-400 hover:text-white transition-colors">Copa do Brasil</Link></li>
                <li><Link href="/libertadores" className="text-gray-400 hover:text-white transition-colors">Libertadores</Link></li>
                <li><Link href="/champions-league" className="text-gray-400 hover:text-white transition-colors">Champions League</Link></li>
                <li><Link href="/premier-league" className="text-gray-400 hover:text-white transition-colors">Premier League</Link></li>
              </ul>
            </div>

            {/* Apostas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Apostas</h3>
              <ul className="space-y-2">
                <li><Link href="/apostas/melhores-casas" className="text-gray-400 hover:text-white transition-colors">Melhores Casas</Link></li>
                <li><Link href="/apostas/dicas" className="text-gray-400 hover:text-white transition-colors">Dicas</Link></li>
                <li><Link href="/palpites" className="text-gray-400 hover:text-white transition-colors">Prognósticos</Link></li>
                <li><Link href="/apostas/odds" className="text-gray-400 hover:text-white transition-colors">Odds</Link></li>
                <li><Link href="/apostas/bonus" className="text-gray-400 hover:text-white transition-colors">Bônus</Link></li>
              </ul>
            </div>

            {/* Conteúdo */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Conteúdo</h3>
              <ul className="space-y-2">
                <li><Link href="/noticias" className="text-gray-400 hover:text-white transition-colors">Notícias</Link></li>
                <li><Link href="/videos" className="text-gray-400 hover:text-white transition-colors">Vídeos</Link></li>
                <li><Link href="/analises" className="text-gray-400 hover:text-white transition-colors">Análises</Link></li>
                <li><Link href="/estatisticas" className="text-gray-400 hover:text-white transition-colors">Estatísticas</Link></li>
                <li><Link href="/calendario" className="text-gray-400 hover:text-white transition-colors">Calendário</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Diário do Futebol. Todos os direitos reservados. Jogue com responsabilidade. +18
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">Termos</Link>
                <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">Privacidade</Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
                <Link href="/anuncie" className="text-gray-400 hover:text-white transition-colors">Anuncie</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}