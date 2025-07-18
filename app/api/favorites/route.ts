import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  console.log('Session in /api/favorites:', session);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipeId, recipeName, imageUrl } = await request.json();
  const { db } = await connectToDatabase();

  const existingFavorite = await db.collection('favorites').findOne({
    userId: session.user.id,
    recipeId,
  });

  if (existingFavorite) {
    return NextResponse.json({ error: 'Recipe already in favorites' }, { status: 400 });
  }

  await db.collection('favorites').insertOne({
    userId: session.user.id,
    recipeId,
    recipeName,
    imageUrl,
    createdAt: new Date(),
  });

  return NextResponse.json({ message: 'Added to favorites' }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipeId } = await request.json();
  const { db } = await connectToDatabase();

  const result = await db.collection('favorites').deleteOne({
    userId: session.user.id,
    recipeId,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Removed from favorites' }, { status: 200 });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  console.log('GET Session in /api/favorites:', session);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = session.user.id;
  const { db } = await connectToDatabase();

  const favorites = await db.collection('favorites')
    .find({ userId })
    .toArray();

  return NextResponse.json(favorites, { status: 200 });
}