'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import RecipeInfo from './RecipeInfo';
import Loading from './Loading';
import NotFound from './NotFound';

export default function RecipeClient({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setRecipe(response.data.meals[0]);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (status === 'loading' || !session) {
      console.log('Session status:', status, 'Session:', session);
      alert('Please log in to save favorites');
      return;
    }
    console.log('Sending request with session:', session);
    try {
      const response = await axios.post('/api/favorites', {
        recipeId: recipe.idMeal,
        recipeName: recipe.strMeal,
        imageUrl: recipe.strMealThumb,
      });
      console.log('API Response:', response.data);
      alert('Added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error.response?.data || error.message);
      alert('Failed to add to favorites: ' + (error.response?.data?.error || 'Unauthorized'));
    }
  };

  const value = { recipe, loading, session, handleAddToFavorites };

  return (
    <>
      <Loading loading={loading} />
      <NotFound recipe={recipe} loading={loading} />
      <RecipeInfo recipe={recipe} session={session} handleAddToFavorites={handleAddToFavorites} />
    </>
  );
}