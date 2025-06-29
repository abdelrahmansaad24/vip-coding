'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createRecipe, getAllIngredients, addRecipeIngredient, insertDummyData } from '@/lib/database'

export default function NewRecipePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Recipe form state
  const [recipeName, setRecipeName] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  
  // Ingredients state
  const [ingredients, setIngredients] = useState([])
  const [recipeIngredients, setRecipeIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState('')
  const [newIngredientName, setNewIngredientName] = useState('')
  const [ingredientQuantity, setIngredientQuantity] = useState(1)
  const [ingredientUnit, setIngredientUnit] = useState('')
  const [showNewIngredient, setShowNewIngredient] = useState(false)

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        const { data } = await getAllIngredients()
        setIngredients(data || [])
      }
      
      setLoading(false)
    }
    
    init()
  }, [])

  const addIngredientToRecipe = async () => {
    if (!selectedIngredient && !newIngredientName.trim()) return
    if (ingredientQuantity <= 0 || !ingredientUnit.trim()) return

    let ingredientId = selectedIngredient
    let ingredientName = ''

    if (showNewIngredient && newIngredientName.trim()) {
      // Create new ingredient
      const { data: newIngredient } = await createIngredient({
        name: newIngredientName.trim(),
        category: 'other'
      })
      ingredientId = newIngredient[0].id
      ingredientName = newIngredientName.trim()
      
      // Refresh ingredients list
      const { data } = await getAllIngredients()
      setIngredients(data || [])
    } else {
      const ingredient = ingredients.find(i => i.id === selectedIngredient)
      if (!ingredient) return
      ingredientName = ingredient.name
    }

    const newIngredient = {
      id: Date.now(), // temporary ID for UI
      ingredient_id: ingredientId,
      quantity: parseFloat(ingredientQuantity),
      unit: ingredientUnit.trim(),
      ingredients: { name: ingredientName }
    }

    setRecipeIngredients([...recipeIngredients, newIngredient])
    
    // Reset form
    setSelectedIngredient('')
    setNewIngredientName('')
    setIngredientQuantity(1)
    setIngredientUnit('')
    setShowNewIngredient(false)
  }

  const removeIngredient = (index) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || recipeIngredients.length === 0) return

    setSubmitting(true)

    try {
      // Create recipe
      const { data: recipe, error: recipeError } = await createRecipe({
        user_id: user.id,
        name: recipeName.trim(),
        description: description.trim(),
        instructions: instructions.trim()
      })

      if (recipeError) {
        console.error('Error creating recipe:', recipeError)
        return
      }

      // Add recipe ingredients
      for (const ingredient of recipeIngredients) {
        await addRecipeIngredient({
          recipe_id: recipe[0].id,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        })
      }

      // Redirect to recipes page
      router.push('/recipes')
    } catch (error) {
      console.error('Error creating recipe:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInsertDummyData = async () => {
    if (!user) return
    
    setSubmitting(true)
    try {
      await insertDummyData(user.id)
      // Refresh the page to show the new data
      window.location.reload()
    } catch (error) {
      console.error('Error inserting dummy data:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="skeleton h-8 w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="skeleton h-4 rounded"></div>
            <div className="skeleton h-32 rounded"></div>
            <div className="skeleton h-32 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to create recipes
          </h1>
          <a
            href="/auth/signin"
            className="btn-primary text-lg px-8 py-3"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600">
            Add a new recipe to your collection
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleInsertDummyData}
            disabled={submitting}
            className="btn-secondary mr-3"
          >
            {submitting ? 'Adding...' : 'Add Sample Recipes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Recipe Details */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recipe Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  required
                  className="input-field text-gray-900"
                  placeholder="Enter recipe name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="input-field text-gray-900"
                  placeholder="Brief description of the recipe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions *
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                  rows={6}
                  className="input-field text-gray-900"
                  placeholder="Step-by-step cooking instructions"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Ingredients
            </h2>

            {/* Add Ingredient Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredient
                </label>
                
                {!showNewIngredient ? (
                  <div className="space-y-2">
                    <select
                      value={selectedIngredient}
                      onChange={(e) => setSelectedIngredient(e.target.value)}
                      className="input-field text-gray-900"
                    >
                      <option value="">Select ingredient</option>
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
                  <div className="space-y-2">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={ingredientQuantity}
                  onChange={(e) => setIngredientQuantity(e.target.value)}
                  min="0"
                  step="0.1"
                  className="input-field text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={ingredientUnit}
                  onChange={(e) => setIngredientUnit(e.target.value)}
                  className="input-field text-gray-900"
                  placeholder="e.g., cups, grams"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addIngredientToRecipe}
                  disabled={(!selectedIngredient && !newIngredientName.trim()) || ingredientQuantity <= 0 || !ingredientUnit.trim()}
                  className="btn-primary w-full"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            {recipeIngredients.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Recipe Ingredients ({recipeIngredients.length})
                </h3>
                {recipeIngredients.map((ingredient, index) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm text-gray-900">
                      {ingredient.ingredients.name} - {ingredient.quantity} {ingredient.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No ingredients added yet. Add at least one ingredient to create the recipe.
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/recipes')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || recipeIngredients.length === 0}
            className="btn-primary"
          >
            {submitting ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
} 