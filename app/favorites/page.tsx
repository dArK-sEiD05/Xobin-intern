'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Favorites() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === 'loading' || !session?.user?.id) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching favorites for userId:', session.user.id);
        const response = await axios.get('/api/favorites', {
          params: { userId: session.user.id },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error.response?.data || error.message);
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
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Please <a href="/login" className="text-blue-500">log in</a> to view favorites.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Favorite Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <div key={favorite.recipeId} className="border p-4 rounded">
            <h2 className="text-xl">{favorite.recipeName}</h2>
            <img src={favorite.imageUrl} alt={favorite.recipeName} className="w-full h-48 object-cover mt-2" />
            <button
              onClick={() => handleRemove(favorite.recipeId)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}