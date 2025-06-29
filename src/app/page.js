'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getSuggestedRecipes } from '@/lib/database'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [suggestedRecipes, setSuggestedRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        const { data } = await getSuggestedRecipes(currentUser.id)
        setSuggestedRecipes(data || [])
      }
      
      setLoading(false)
    }
    
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="skeleton h-8 w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="gradient-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white text-4xl">🍳</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Kitchen Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage your recipes and ingredients with smart suggestions. 
              Never wonder what to cook again!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/signin"
                className="btn-secondary text-lg px-8 py-4"
              >
                Sign In
              </Link>
            </div>
            
            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe Management</h3>
                <p className="text-gray-600">Create and organize your favorite recipes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
                <p className="text-gray-600">Get recipe ideas based on your ingredients</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Tracking</h3>
                <p className="text-gray-600">Keep track of what you have in stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Here are some recipes you can make with your current ingredients
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/recipes/new"
          className="card group hover:scale-105 transition-transform duration-200"
        >
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-white text-2xl">➕</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Recipe</h3>
            <p className="text-gray-600">Create a new recipe for your collection</p>
          </div>
        </Link>
        
        <Link
          href="/inventory"
          className="card group hover:scale-105 transition-transform duration-200"
        >
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-white text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Inventory</h3>
            <p className="text-gray-600">Update your ingredients and quantities</p>
          </div>
        </Link>
        
        <Link
          href="/recipes"
          className="card group hover:scale-105 transition-transform duration-200"
        >
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-white text-2xl">📖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Recipes</h3>
            <p className="text-gray-600">Browse and manage your recipe collection</p>
          </div>
        </Link>
      </div>

      {/* Suggested Recipes */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Suggested Recipes
        </h2>
        
        {suggestedRecipes.length === 0 ? (
          <div className="card text-center">
            <div className="card-body py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No recipes found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add some ingredients to your inventory and create recipes to get started with smart suggestions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/inventory"
                  className="btn-success"
                >
                  Add Ingredients
                </Link>
                <Link
                  href="/recipes/new"
                  className="btn-secondary"
                >
                  Create Recipe
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="card group hover:scale-105 transition-transform duration-200"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                      {recipe.name}
                    </h3>
                    <span className={`badge ${recipe.matchPercentage >= 80 ? 'badge-success' : recipe.matchPercentage >= 60 ? 'badge-warning' : 'badge-error'}`}>
                      {recipe.matchPercentage}% match
                    </span>
                  </div>
                  
                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                  
                  {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Missing ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.missingIngredients.slice(0, 3).map((ri) => (
                          <span
                            key={ri.id}
                            className="badge badge-error"
                          >
                            {ri.ingredients?.name}
                          </span>
                        ))}
                        {recipe.missingIngredients.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{recipe.missingIngredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
