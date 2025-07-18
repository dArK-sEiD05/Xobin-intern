'use client';
import RecipeClient from './RecipeClient';
import { useParams } from 'next/navigation';

export default function RecipePage() {
  const { id } = useParams();
  return <RecipeClient id={id as string} />;
}