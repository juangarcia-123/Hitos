'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-primary-foreground text-2xl font-bold">H</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Bienvenido a Hitos</h1>
            <p className="text-muted-foreground">Inicia sesión para continuar</p>
          </div>

          {/* Clerk SignIn */}
          <div className="flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none bg-transparent',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'h-12 text-base font-medium',
                  formFieldInput: 'h-12 text-base',
                  formButtonPrimary: 'h-12 text-base font-semibold bg-primary hover:bg-primary/90',
                  footerAction: 'hidden',
                },
              }}
              routing="path"
              path="/auth/login"
              signUpUrl="/auth/sign-up"
              forceRedirectUrl="/"
            />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{' '}
            <Link href="/auth/sign-up" className="text-primary font-medium hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
