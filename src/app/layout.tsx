import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/auth/provider';
import { Toaster } from '@/components/ui/toaster';
import { Chatbot } from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'EBENESAID | Relocation Operating System',
  description: 'The trusted relocation platform for international students in Latvia and the Baltics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20 bg-background text-foreground">
        <AuthProvider>
          {children}
          <Chatbot />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
