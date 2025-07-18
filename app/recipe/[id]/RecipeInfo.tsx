'use client';
import { useState } from 'react';

export default function RecipeInfo({ recipe, session, handleAddToFavorites }: { recipe: any; session: any; handleAddToFavorites: () => void }) {
  if (!recipe) return null;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{recipe.strMeal}</h1>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-64 object-cover mt-2" />
      {session && (
        <button onClick={handleAddToFavorites} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          Add to Favorites
        </button>
      )}
    </div>
  );
}