import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import { VITE_SUPABASE_ANON, VITE_SUPABASE_URL } from "../../credentials"

// Configuración de Supabase

const supabaseUrl = VITE_SUPABASE_URL
const supabaseKey = VITE_SUPABASE_ANON

const supabase = createClient(supabaseUrl, supabaseKey)

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  className?: string
  setLoggedIn?: (loggedIn: boolean) => void
  setUser?: (user: any) => void
}

export function LoginForm({
  className,
  setLoggedIn,
  setUser,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
  
      if (error) {
        console.error("Error al iniciar sesión:", error.message)
        setError("Email o contraseña incorrecta.")
        return
      }
  
      // Redirige o muestra mensaje
      console.log("Inicio de sesión exitoso")
      setLoggedIn && setLoggedIn(true)
      setUser && setUser(data.user)
      
    } catch (err) {
      console.error("Error inesperado:", err)
      setError("Ups... algo fue mal.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 bg-pink-50 p-6 rounded-lg shadow-md", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-red-600">Inicia sesión cariño</h1>
        <p className="text-balance text-sm text-red-400">
          Mete la cuenta Moreee!
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-red-600">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="more@more.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-red-300 focus:ring-red-500"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-red-600">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm text-red-500 underline-offset-4 hover:underline"
            >
              La contraseña moree
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-red-300 focus:ring-red-500"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full bg-red-500 text-white hover:bg-red-600">
          Login
        </Button>

      </div>
      <div className="text-center text-sm text-red-500">
        ¿No tienes cuenta?{" "}
        <a href="#" className="underline underline-offset-4 text-red-600">
          LLama a More
        </a>
      </div>
    </form>
  )
}
