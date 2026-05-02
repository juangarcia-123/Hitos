import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="/images/logo.png"
            alt="Hitos"
            width={180}
            height={72}
            className="h-16 w-auto"
            priority
          />
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4 pb-2 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Error de autenticación</CardTitle>
            <CardDescription className="text-base">
              Hubo un problema al iniciar sesión. Por favor, intentá de nuevo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground text-center">
                Si el problema persiste, contactá a soporte o intentá con otro método de inicio de sesión.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full h-12">
                  Volver a intentar
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full h-12">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
