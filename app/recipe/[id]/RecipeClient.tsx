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
  const [recipe, setRecipe] = useState<any | null>(null); // Explicitly typed as any or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Session status:', status, 'Session data:', session);
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setRecipe(response.data.meals ? response.data.meals[0] : null);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!session) {
      alert('Please log in to save favorites');
      return;
    }
    if (!recipe) {
      alert('No recipe available to add to favorites');
      return;
    }
    try {
      await axios.post('/api/favorites', {
        recipeId: recipe.idMeal,
        recipeName: recipe.strMeal,
        imageUrl: recipe.strMealThumb,
      });
      alert('Added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  return (
    <>
      <Loading loading={loading} />
      <NotFound recipe={recipe} loading={loading} />
      <RecipeInfo recipe={recipe} session={session} handleAddToFavorites={handleAddToFavorites} />
    </>
  );
}