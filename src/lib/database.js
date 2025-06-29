import { supabase } from './supabase'

// Recipe functions
export const createRecipe = async (recipeData) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipeData])
    .select()
  return { data, error }
}

export const getUserRecipes = async (userId) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getRecipe = async (recipeId) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .single()
  return { data, error }
}

// Ingredient functions
export const createIngredient = async (ingredientData) => {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([ingredientData])
    .select()
  return { data, error }
}

export const getAllIngredients = async () => {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name')
  return { data, error }
}

// Recipe ingredients functions
export const addRecipeIngredient = async (recipeIngredientData) => {
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .insert([recipeIngredientData])
    .select()
  return { data, error }
}

export const getRecipeIngredients = async (recipeId) => {
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .select(`
      *,
      ingredients (*)
    `)
    .eq('recipe_id', recipeId)
  return { data, error }
}

// User inventory functions
export const addToInventory = async (inventoryData) => {
  const { data, error } = await supabase
    .from('user_inventory')
    .insert([inventoryData])
    .select()
  return { data, error }
}

export const getUserInventory = async (userId) => {
  const { data, error } = await supabase
    .from('user_inventory')
    .select(`
      *,
      ingredients (*)
    `)
    .eq('user_id', userId)
  return { data, error }
}

export const updateInventoryQuantity = async (inventoryId, newQuantity) => {
  const { data, error } = await supabase
    .from('user_inventory')
    .update({ quantity: newQuantity })
    .eq('id', inventoryId)
    .select()
  return { data, error }
}

// Recipe suggestion function
export const getSuggestedRecipes = async (userId) => {
  // Get user's inventory
  const { data: inventory } = await getUserInventory(userId)
  const userIngredients = inventory?.map(item => item.ingredient_id) || []
  
  // Get all recipes with their ingredients
  const { data: recipes } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        *,
        ingredients (*)
      )
    `)
    .eq('user_id', userId)
  
  if (!recipes) return { data: [], error: null }
  
  // Calculate match percentage for each recipe
  const suggestedRecipes = recipes.map(recipe => {
    const recipeIngredients = recipe.recipe_ingredients || []
    const totalIngredients = recipeIngredients.length
    const availableIngredients = recipeIngredients.filter(ri => 
      userIngredients.includes(ri.ingredient_id)
    ).length
    
    const matchPercentage = totalIngredients > 0 ? (availableIngredients / totalIngredients) * 100 : 0
    
    return {
      ...recipe,
      matchPercentage: Math.round(matchPercentage),
      missingIngredients: recipeIngredients.filter(ri => 
        !userIngredients.includes(ri.ingredient_id)
      )
    }
  }).filter(recipe => recipe.matchPercentage > 0)
  .sort((a, b) => b.matchPercentage - a.matchPercentage)
  
  return { data: suggestedRecipes, error: null }
}

// Dummy data functions
export const insertDummyData = async (userId) => {
  try {
    // First, insert some common ingredients if they don't exist
    const commonIngredients = [
      { name: 'Tomato', category: 'vegetable' },
      { name: 'Onion', category: 'vegetable' },
      { name: 'Garlic', category: 'vegetable' },
      { name: 'Olive Oil', category: 'oil' },
      { name: 'Salt', category: 'spice' },
      { name: 'Black Pepper', category: 'spice' },
      { name: 'Chicken Breast', category: 'meat' },
      { name: 'Rice', category: 'grain' },
      { name: 'Pasta', category: 'grain' },
      { name: 'Egg', category: 'dairy' },
      { name: 'Milk', category: 'dairy' },
      { name: 'Cheese', category: 'dairy' },
      { name: 'Flour', category: 'grain' },
      { name: 'Butter', category: 'dairy' },
      { name: 'Lemon', category: 'fruit' },
      { name: 'Basil', category: 'herb' },
      { name: 'Oregano', category: 'herb' },
      { name: 'Chili Powder', category: 'spice' },
      { name: 'Cumin', category: 'spice' },
      { name: 'Bell Pepper', category: 'vegetable' }
    ]

    // Insert ingredients (this will ignore duplicates due to unique constraint)
    for (const ingredient of commonIngredients) {
      await supabase
        .from('ingredients')
        .upsert([ingredient], { onConflict: 'name' })
    }

    // Get all ingredients for reference
    const { data: allIngredients } = await getAllIngredients()
    const ingredientMap = {}
    allIngredients.forEach(ing => ingredientMap[ing.name.toLowerCase()] = ing.id)

    // Insert dummy recipes
    const dummyRecipes = [
      {
        user_id: userId,
        name: 'Simple Pasta Carbonara',
        description: 'A classic Italian pasta dish with eggs, cheese, and pancetta',
        instructions: '1. Cook pasta according to package instructions\n2. In a pan, cook pancetta until crispy\n3. Beat eggs with grated cheese\n4. Drain pasta and immediately mix with egg mixture\n5. Add pancetta and season with black pepper\n6. Serve immediately while hot'
      },
      {
        user_id: userId,
        name: 'Chicken Stir Fry',
        description: 'Quick and healthy chicken stir fry with vegetables',
        instructions: '1. Cut chicken into bite-sized pieces\n2. Heat oil in a wok or large pan\n3. Cook chicken until golden brown\n4. Add vegetables and stir fry for 3-4 minutes\n5. Add soy sauce and seasonings\n6. Serve hot with rice'
      },
      {
        user_id: userId,
        name: 'Tomato Basil Soup',
        description: 'Creamy tomato soup with fresh basil',
        instructions: '1. Sauté onions and garlic in olive oil\n2. Add tomatoes and cook until soft\n3. Add broth and bring to boil\n4. Simmer for 20 minutes\n5. Blend until smooth\n6. Add cream and basil, season to taste'
      },
      {
        user_id: userId,
        name: 'Classic Margherita Pizza',
        description: 'Traditional Italian pizza with tomato sauce and mozzarella',
        instructions: '1. Prepare pizza dough and let it rise\n2. Roll out dough and add tomato sauce\n3. Add fresh mozzarella and basil leaves\n4. Bake in hot oven until crust is golden\n5. Drizzle with olive oil and serve'
      },
      {
        user_id: userId,
        name: 'Lemon Garlic Shrimp',
        description: 'Quick and flavorful shrimp with lemon and garlic',
        instructions: '1. Clean and devein shrimp\n2. Heat olive oil in a pan\n3. Add minced garlic and cook until fragrant\n4. Add shrimp and cook for 2-3 minutes per side\n5. Add lemon juice and zest\n6. Season with salt and pepper'
      }
    ]

    // Insert recipes and their ingredients
    for (const recipe of dummyRecipes) {
      const { data: newRecipe } = await createRecipe(recipe)
      
      if (newRecipe) {
        const recipeIngredients = {
          'Simple Pasta Carbonara': [
            { name: 'Pasta', quantity: 1, unit: 'pound' },
            { name: 'Egg', quantity: 4, unit: 'pieces' },
            { name: 'Cheese', quantity: 1, unit: 'cup' },
            { name: 'Black Pepper', quantity: 1, unit: 'teaspoon' }
          ],
          'Chicken Stir Fry': [
            { name: 'Chicken Breast', quantity: 2, unit: 'pieces' },
            { name: 'Bell Pepper', quantity: 2, unit: 'pieces' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Garlic', quantity: 3, unit: 'cloves' },
            { name: 'Olive Oil', quantity: 2, unit: 'tablespoons' }
          ],
          'Tomato Basil Soup': [
            { name: 'Tomato', quantity: 6, unit: 'pieces' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Garlic', quantity: 2, unit: 'cloves' },
            { name: 'Basil', quantity: 1, unit: 'cup' },
            { name: 'Olive Oil', quantity: 2, unit: 'tablespoons' }
          ],
          'Classic Margherita Pizza': [
            { name: 'Flour', quantity: 3, unit: 'cups' },
            { name: 'Tomato', quantity: 4, unit: 'pieces' },
            { name: 'Cheese', quantity: 2, unit: 'cups' },
            { name: 'Basil', quantity: 1, unit: 'cup' },
            { name: 'Olive Oil', quantity: 3, unit: 'tablespoons' }
          ],
          'Lemon Garlic Shrimp': [
            { name: 'Shrimp', quantity: 1, unit: 'pound' },
            { name: 'Lemon', quantity: 2, unit: 'pieces' },
            { name: 'Garlic', quantity: 4, unit: 'cloves' },
            { name: 'Olive Oil', quantity: 3, unit: 'tablespoons' },
            { name: 'Black Pepper', quantity: 1, unit: 'teaspoon' }
          ]
        }

        const ingredients = recipeIngredients[recipe.name] || []
        for (const ing of ingredients) {
          const ingredientId = ingredientMap[ing.name.toLowerCase()]
          if (ingredientId) {
            await addRecipeIngredient({
              recipe_id: newRecipe[0].id,
              ingredient_id: ingredientId,
              quantity: ing.quantity,
              unit: ing.unit
            })
          }
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error inserting dummy data:', error)
    return { success: false, error }
  }
} 