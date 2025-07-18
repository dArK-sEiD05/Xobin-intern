import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { db } = await connectToDatabase();

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ email, password: hashedPassword });

  return NextResponse.json({ message: 'User created' }, { status: 201 });
}