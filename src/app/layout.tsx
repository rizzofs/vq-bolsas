import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'VQ Bolsas | Fábrica de Bolsas, Pochocleras y Packaging Personalizado',
  description: 'Fabricación y venta de bolsas de papel kraft, friselina, cartón, pochocleras y temáticas de cumpleaños. Envíos a todo el país.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased text-slate-800 bg-slate-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
