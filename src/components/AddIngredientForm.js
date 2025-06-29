'use client'

import { useState, useEffect } from 'react'
import { getAllIngredients, createIngredient } from '@/lib/database'

export default function AddIngredientForm({ onSubmit, onCancel }) {
  const [ingredients, setIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState('')
  const [newIngredientName, setNewIngredientName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewIngredient, setShowNewIngredient] = useState(false)

  useEffect(() => {
    const loadIngredients = async () => {
      const { data } = await getAllIngredients()
      setIngredients(data || [])
    }
    loadIngredients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let ingredientId = selectedIngredient

      if (showNewIngredient && newIngredientName.trim()) {
        // Create new ingredient
        const { data: newIngredient } = await createIngredient({
          name: newIngredientName.trim(),
          category: 'other'
        })
        ingredientId = newIngredient[0].id
      }

      if (ingredientId) {
        await onSubmit({
          ingredient_id: ingredientId,
          quantity: parseFloat(quantity),
          unit: unit.trim(),
          expiry_date: expiryDate || null
        })
      }
    } catch (error) {
      console.error('Error adding ingredient:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-lg">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Add Ingredient to Inventory
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingredient
            </label>
            
            {!showNewIngredient ? (
              <div className="space-y-3">
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="input-field text-gray-900"
                  required
                >
                  <option value="">Select an ingredient</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={() => setShowNewIngredient(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                >
                  + Add new ingredient
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  placeholder="Enter ingredient name"
                  className="input-field text-gray-900"
                  required
                />
                
                <button
                  type="button"
                  onClick={() => {
                    setShowNewIngredient(false)
                    setNewIngredientName('')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
                >
                  ← Select existing ingredient
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.1"
                className="input-field text-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="input-field text-gray-900"
                placeholder="e.g., cups, grams, pieces"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date (optional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input-field text-gray-900"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-success"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </div>
              ) : (
                'Add Ingredient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 