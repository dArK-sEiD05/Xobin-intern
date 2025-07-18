'use client'; // Ensure this is at the top
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import Link from 'next/link';
  import { useSession, signOut } from 'next-auth/react';

  export default function Home() {
    const { data: session } = useSession();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
          setRecipes(response.data.meals || []);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Recipes</h1>
        {session && (
          <button
            onClick={() => signOut()}
            className="mb-4 px-4 py-2 font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.idMeal} className="border p-4 rounded">
              <h2 className="text-xl">{recipe.strMeal}</h2>
              <p>{recipe.strInstructions?.substring(0, 100) || 'No description'}</p>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover mt-2" />
              <Link href={`/recipe/${recipe.idMeal}`} className="text-blue-500 mt-2 inline-block">
                View Details
              </Link>
            </div>
          ))}
        </div>
        {!session && (
          <p className="mt-4">Please <a href="/login" className="text-blue-500">log in</a> or <a href="/signup" className="text-blue-500">sign up</a> to save favorites.</p>
        )}
      </div>
    );
  }