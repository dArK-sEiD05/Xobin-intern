import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Attempting to authorize user with email:', credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials:', credentials);
          throw new Error('Email and password are required');
        }
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: credentials.email });
        console.log('Database query result for email', credentials.email, ':', user);
        if (!user) {
          console.log('User not found for email:', credentials.email);
          throw new Error('No user found');
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log('Password comparison result for', credentials.email, ':', isValid);
        if (!isValid) {
          console.log('Invalid password for email:', credentials.email);
          throw new Error('Invalid password');
        }
        console.log('User authorized successfully:', { id: user._id.toString(), email: user.email, name: user.name });
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log('JWT callback - Token:', token, 'User:', user);
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log('Session callback - Session:', session, 'Token:', token);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
};

export default NextAuth(authOptions);