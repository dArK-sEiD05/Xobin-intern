'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { SessionProvider } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); 

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
        setMeals(response.data.meals || []);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [status, searchQuery]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSurpriseMe = () => {
    if (meals.length > 0) {
      const randomMeal = meals[Math.floor(Math.random() * meals.length)];
      router.push(`/recipe/${randomMeal.idMeal}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 relative">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Explore Meals</h1>

          
          <div className="flex flex-row sm:flex-row items-center justify-center gap-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by dish name..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
            />
            <button
              onClick={handleSurpriseMe}
              className="bg-pink-500 hover:bg-pink-500 text-white px-4 py-2 rounded-lg shadow transition"
            >
              🎲 Surprise Me!
            </button>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <Link href={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-transform duration-200 hover:scale-105">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{meal.strMeal}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {meals.length === 0 && !loading && (
            <p className="text-center text-gray-600 mt-6">No meals found.</p>
          )}
        </div>
      </div>
    </SessionProvider>
  );
}
