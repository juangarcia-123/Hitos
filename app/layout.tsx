import type { Metadata, Viewport } from 'next'
import { Nunito, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from '@/lib/context/app-context'
import './globals.css'

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: 'Hitos - Acompañamos cada paso de su desarrollo',
  description: 'App de seguimiento del desarrollo infantil de 0 a 5 años. Registra hitos, recibe orientación con IA y acompaña el crecimiento de tu hijo.',
  generator: 'v0.app',
  keywords: ['desarrollo infantil', 'hitos', 'bebés', 'niños', 'pediatría', 'crecimiento', 'milestones'],
  authors: [{ name: 'Hitos' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5f2' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1d2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Si no hay clave de Clerk configurada, mostrar mensaje
  if (!clerkKey) {
    return (
      <html lang="es" className={`${nunito.variable} ${geistMono.variable} bg-background`}>
        <body className="font-sans antialiased min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Configurar Clerk</h1>
            <p className="text-muted-foreground">
              Agrega las variables de entorno de Clerk para habilitar la autenticación:
            </p>
            <code className="block bg-muted p-4 rounded-lg text-sm text-left">
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...<br/>
              CLERK_SECRET_KEY=sk_test_...
            </code>
            <p className="text-sm text-muted-foreground">
              Obtené las claves en <a href="https://clerk.com" className="text-primary underline">clerk.com</a>
            </p>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider localization={esES}>
      <html lang="es" className={`${nunito.variable} ${geistMono.variable} bg-background`}>
        <body className="font-sans antialiased min-h-screen">
          <AppProvider>
            {children}
          </AppProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  )
}
