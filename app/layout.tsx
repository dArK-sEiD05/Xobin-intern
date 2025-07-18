import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li><Link href="/">All Meals</Link></li>
            <li><Link href="/favorites">Favorite Meals</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/signup">Sign Up</Link></li>
          </ul>
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}