'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getUserInventory, addToInventory, updateInventoryQuantity } from '@/lib/database'
import AddIngredientForm from '@/components/AddIngredientForm'
import Link from 'next/link'

export default function InventoryPage() {
  const [user, setUser] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadInventory = async () => {
    if (user) {
      const { data } = await getUserInventory(user.id)
      setInventory(data || [])
    }
  }

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        await loadInventory()
      }
      
      setLoading(false)
    }
    
    init()
  }, [loadInventory])

  const handleAddIngredient = async (ingredientData) => {
    if (!user) return

    const { error } = await addToInventory({
      ...ingredientData,
      user_id: user.id
    })

    if (!error) {
      await loadInventory()
      setShowAddForm(false)
    }
  }

  const handleUpdateQuantity = async (inventoryId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      // You might want to add a delete function to the database.js
      return
    }

    const { error } = await updateInventoryQuantity(inventoryId, newQuantity)
    if (!error) {
      await loadInventory()
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="skeleton h-8 w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-16 rounded-lg"></div>
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
            <span className="text-white text-3xl">📦</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please sign in to manage your inventory
          </h1>
          <p className="text-gray-600 mb-8">
            Create an account to start tracking your ingredients
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
            My Inventory
          </h1>
          <p className="text-xl text-gray-600">
            Track your ingredients and quantities
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-success inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Ingredient
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddIngredientForm
            onSubmit={handleAddIngredient}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {inventory.length === 0 ? (
        <div className="card text-center">
          <div className="card-body py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No ingredients yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your inventory by adding ingredients you have. 
              This will help you get smart recipe suggestions!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-success text-lg px-8 py-3 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Ingredient
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Ingredients ({inventory.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {inventory.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.ingredients?.name}
                    </h3>
                    {item.expiry_date && (
                      <p className="text-sm text-gray-500 mt-1">
                        Expires: {new Date(item.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-lg font-semibold text-gray-900 min-w-[4rem] text-center">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 