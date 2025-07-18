'use client';

export default function NotFound({ recipe, loading }: { recipe: any; loading: boolean }) {
  if (loading || recipe) return null;
  return <div className="text-center p-4 text-red-500">Recipe not found</div>;
}