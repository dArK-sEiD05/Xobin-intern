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
    <div className=" container mx-auto px-4 py-8 max-w-9xl">
      <div className="w-full flex flex-col md:flex-row gap-20 md:gap-8">
        {/* Image Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden mt-5.5 h-full max-w-xl md:w-1/2 border-2 border-gray-300">
          <div className="relative w-full aspect-square">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {recipe.strMeal}
            </h1>
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Instructions</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recipe.strInstructions}
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {ingredients.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Actions */}
          <div className="mt-6 flex justify-start">
            {session ? (
              <button
                onClick={handleAddToFavorites}
                className="px-6 py-3  bg-white-600 text-black border-2 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add to Favorites
              </button>
            ) : (
              <p className="text-gray-600">
                Please <Link href="/login" className="text-blue-500 hover:underline">log in</Link> to save this recipe to favorites.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}