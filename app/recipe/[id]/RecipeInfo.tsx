'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface RecipeInfoProps {
  recipe: any;
  session: any;
  handleAddToFavorites: () => void;
}

export default function RecipeInfo({ recipe, session, handleAddToFavorites }: RecipeInfoProps) {
  if (!recipe) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient}`);
    }
  }

  return (
    <div className="container  flex-row mx-auto px-4 py-8 max-w-5xl">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="relative w-full aspect-[16/9]">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white p-4 sm:p-6">
              {recipe.strMeal}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instructions */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{recipe.strInstructions}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {ingredients.map((item, index) => (
                <li key={index} className="text-base">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          {session ? (
            <button
              onClick={handleAddToFavorites}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add to Favorites
            </button>
          ) : (
            <p className="text-gray-600 text-center">
              Please <Link href="/login" className="text-blue-500 hover:underline">log in</Link> to save this recipe to favorites.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}