import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// Extend the built-in Session and User types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
  console.log('Authorize called with credentials:', credentials);
  try {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Please provide both email and password');
    }

    const { db } = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }

    const user = await db.collection('users').findOne({ email: credentials.email });
    if (!user) {
      throw new Error('No user found with this email');
    }

    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) {
      throw new Error('Incorrect password');
    }

    return { id: user._id.toString(), email: user.email, name: user.name };
  } catch (error: any) {
    console.error('Authorize error:', error);
    throw new Error(error.message || 'Login failed');
  }
}
,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'default-secret-for-dev-only', // Fallback for dev
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback, user:', user, 'token:', token);
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback, session:', session, 'token:', token);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        console.log('Session user ID:', session.user.id);
      }
      return session;
    },
  },
  // Explicit NEXTAUTH_URL for production
  ...(process.env.NODE_ENV === 'production' && {
    callbackUrl: `${process.env.NEXTAUTH_URL || 'https://xobin-intern.vercel.app'}/api/auth/callback/credentials`,
  }),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };