import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE
const supabase = createClient(supabaseUrl, supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.")
  console.log("Supabase URL:", supabaseUrl)
  console.log("Supabase Key:", supabaseKey)
}


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state
    try {
      let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)


      if (error) {
        console.error("Error al obtener el usuario:", error)
        setError("Error al obtener el usuario. Intenta de nuevo.")
        return
      }
      else if (users.length === 0) {
        setError("El usuario no existe. Verifica tu email.")
        return
      }

      else if (users[0].password !== password) {
        setError("Contraseña incorrecta. Intenta de nuevo.")
        return
      }

      // Redirigir a otra página después de iniciar sesión correctamente
      // window.location.href = "/dashboard"
    } catch (err) {
      console.error("Error inesperado:", err)
      setError("Error inesperado al intentar iniciar sesión. Verifica tu conexión.")
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
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-red-300">
          <span className="relative z-10 bg-pink-50 px-2 text-red-400">
            O también creo que puedes con...
          </span>
        </div>
        <Button variant="outline" className="w-full border-red-300 text-red-500 hover:bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.63 1.22 9.1 3.22l6.8-6.8C36.2 2.7 30.5 0 24 0 14.8 0 6.9 5.8 3.1 14.1l7.9 6.1C12.8 13.4 17.9 9.5 24 9.5z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2.1 15.2-5.7l-7.3-6.1c-2.1 1.4-4.9 2.3-7.9 2.3-6.1 0-11.3-4.1-13.1-9.6l-8 6.2C6.8 42.2 14.8 48 24 48z"/>
            <path fill="#4A90E2" d="M46.5 24.5c0-1.6-.2-3.1-.5-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.3l7.3 6.1c4.3-4 6.8-9.9 6.8-17.9z"/>
            <path fill="#FBBC05" d="M10.9 28.5c-.5-1.5-.9-3-.9-4.5s.3-3.1.9-4.5l-7.9-6.1C1.1 16.2 0 20 0 24s1.1 7.8 3 11.1l7.9-6.1z"/>
          </svg>
          Inicia sesión con Google
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
