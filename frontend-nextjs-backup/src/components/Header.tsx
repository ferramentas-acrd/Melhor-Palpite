'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Sexta-feira, 23 de Setembro de 2025 | 14:35</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/politica-privacidade" className="hover:text-red-500 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/jogo-responsavel" className="hover:text-red-500 transition-colors">
              Jogo Responsável
            </Link>
            <span className="text-yellow-500">+18</span>
          </div>
        </div>
      </div>

      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <span className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm mr-4">
            URGENTE
          </span>
          <div className="overflow-hidden">
            <div className="animate-scroll whitespace-nowrap">
              <span className="inline-block mx-8">Flamengo anuncia contratação milionária para 2025</span>
              <span className="inline-block mx-8">Barcelona vence Real Madrid por 3x0 no clássico</span>
              <span className="inline-block mx-8">Seleção Brasileira convoca jogadores para Copa América</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-red-600 text-white p-2 rounded font-bold text-xl">
                DF
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diário do Futebol</h1>
                <p className="text-sm text-gray-600">Esportes • Apostas • Notícias</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Futebol
              </Link>
              <Link href="/apostas" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Apostas
              </Link>
              <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                HOT
              </div>
              <Link href="/brasileirao" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Brasileirão
              </Link>
              <Link href="/champions" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Champions
              </Link>
              <Link href="/premier-league" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Premier League
              </Link>
              <Link href="/estatisticas" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Estatísticas
              </Link>
              <Link href="/videos" className="text-gray-900 hover:text-red-600 transition-colors font-medium">
                Vídeos
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-red-600 transition-colors">
                Entrar
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Cadastrar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-4 space-y-4">
              <Link href="/" className="block text-gray-900 hover:text-red-600 transition-colors">
                Futebol
              </Link>
              <Link href="/apostas" className="block text-gray-900 hover:text-red-600 transition-colors">
                Apostas
              </Link>
              <Link href="/brasileirao" className="block text-gray-900 hover:text-red-600 transition-colors">
                Brasileirão
              </Link>
              <Link href="/champions" className="block text-gray-900 hover:text-red-600 transition-colors">
                Champions
              </Link>
              <Link href="/premier-league" className="block text-gray-900 hover:text-red-600 transition-colors">
                Premier League
              </Link>
              <Link href="/estatisticas" className="block text-gray-900 hover:text-red-600 transition-colors">
                Estatísticas
              </Link>
              <Link href="/videos" className="block text-gray-900 hover:text-red-600 transition-colors">
                Vídeos
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}