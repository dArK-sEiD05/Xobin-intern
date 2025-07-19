'use client';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios'; // Imported AxiosError for type safety
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Define the Favorite interface based on your API response
interface Favorite {
  recipeId: string;
  recipeName: string;
  imageUrl: string;
}

export default function Favorites() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === 'loading' || !session?.user?.id) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/api/favorites', {
          params: { userId: session.user.id },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', 
          error instanceof Error ? error.message : 
          error instanceof AxiosError ? error.response?.data || error.message : 
          String(error)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [session]);

  const handleRemove = async (recipeId: string) => {
    try {
      await axios.delete('/api/favorites', {
        data: { recipeId, userId: session?.user?.id },
      });
      setFavorites(favorites.filter((fav) => fav.recipeId !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', 
        error instanceof Error ? error.message : 
        error instanceof AxiosError ? error.response?.data || error.message : 
        String(error)
      );
    }
  };

  if (loading) return <div className="text-center py-8 bg-gray-100">Loading...</div>;

  if (!session) {
    return (
      <div className="text-center py-8 ">
        Please{' '}
        <a href="/login" className="text-blue-500 underline">
          log in
        </a>{' '}
        to view favorites.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Favorite Recipes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.recipeId}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-transform duration-200 hover:scale-105"
            >
              <Link href={`/recipe/${favorite.recipeId}`} className="block">
                <img
                  src={favorite.imageUrl}
                  alt={favorite.recipeName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    {favorite.recipeName}
                  </h2>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handleRemove(favorite.recipeId)}
                  className="w-[1/2] px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {favorites.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No favorite recipes found.</p>
        )}
      </div>
    </div>
  );
}