# Kitchen Recipe Manager

A smart recipe management app that helps you track your ingredients and suggests recipes you can make with what you have.

## Features

- 🔐 **User Authentication** - Sign up with email confirmation
- 📖 **Recipe Management** - Create and manage your personal recipes
- 📦 **Ingredient Inventory** - Track what ingredients you have and their quantities
- 🧠 **Smart Suggestions** - Get recipe suggestions based on your available ingredients
- 📊 **Automatic Updates** - Ingredient counters update when you use recipes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with email confirmation

## Getting Started

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Project Settings → API
3. Enable email confirmation in Authentication → Settings → Email

### 2. Set up Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recipe ingredients junction table
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL
);

-- User inventory table
CREATE TABLE user_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  expiry_date DATE
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own inventory" ON user_inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory" ON user_inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory" ON user_inventory
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory" ON user_inventory
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Environment Variables

Create a `.env.local` file in the project root and add:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Sign Up**: Create an account with email confirmation
2. **Add Ingredients**: Go to Inventory and add ingredients you have
3. **Create Recipes**: Add your favorite recipes with ingredients and quantities
4. **Get Suggestions**: The dashboard will show recipes you can make with your ingredients
5. **Use Recipes**: When you make a recipe, the system will update your ingredient counts

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── recipes/           # Recipe management pages
│   ├── inventory/         # Inventory management pages
│   └── layout.js          # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utility functions
│   ├── auth.js           # Authentication helpers
│   ├── database.js       # Database operations
│   └── supabase.js       # Supabase client
└── styles/               # CSS styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
