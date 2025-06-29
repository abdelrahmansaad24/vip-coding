'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getUserRecipes } from '@/lib/database'

export default function RecipesPage() {
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecipes = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        const { data } = await getUserRecipes(currentUser.id)
        setRecipes(data || [])
      }
      
      setLoading(false)
    }
    
    loadRecipes()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="skeleton h-8 w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">📖</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please sign in to view your recipes
          </h1>
          <p className="text-gray-600 mb-8">
            Create an account to start building your recipe collection
          </p>
          <Link
            href="/auth/signin"
            className="btn-primary text-lg px-8 py-3"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Recipes
          </h1>
          <p className="text-xl text-gray-600">
            Manage your personal recipe collection
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/recipes/new"
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Recipe
          </Link>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="card text-center">
          <div className="card-body py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📖</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No recipes yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your recipe collection by adding your favorite dishes. 
              You'll be able to get smart suggestions based on your ingredients!
            </p>
            <Link
              href="/recipes/new"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Recipe
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="card group hover:scale-105 transition-transform duration-200"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                    {recipe.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {recipe.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {recipe.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200"
                  >
                    View Recipe
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 