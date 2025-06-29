'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, signOut } from '@/lib/auth'

export default function Navigation() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="skeleton h-8 w-48 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="skeleton h-8 w-20 rounded"></div>
              <div className="skeleton h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍳</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Kitchen Manager
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link 
                  href="/recipes" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
                >
                  📖 My Recipes
                </Link>
                <Link 
                  href="/inventory" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
                >
                  📦 Inventory
                </Link>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {user ? (
              <div className="space-y-2">
                <Link 
                  href="/recipes" 
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📖 My Recipes
                </Link>
                <Link 
                  href="/inventory" 
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 Inventory
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-rose-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/auth/signin" 
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="btn-primary text-sm block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
} 