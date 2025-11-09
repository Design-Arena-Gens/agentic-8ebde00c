import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flux.ai Lite',
  description: 'Browser-based circuit editor (lite)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-gray-200">
        {children}
      </body>
    </html>
  );
}
