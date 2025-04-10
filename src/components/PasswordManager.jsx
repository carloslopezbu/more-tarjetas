import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Trash2, Plus } from "lucide-react"
import { createSupabaseClient } from "@/api/Supabase"
import Home from "./Home"

const supabase = createSupabaseClient()
const user = JSON.parse(localStorage.getItem("user")) || null
const userEmail = user?.email ?? null

export default function PasswordManager() {
  const [passwords, setPasswords] = useState([])
  const [newName, setNewName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState({})

  useEffect(() => {
    const fetchPasswords = async () => {
      if (!userEmail) return

      const { data, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("user_email", userEmail)

      if (error) {
        console.error("Error al cargar contraseñas:", error)
      } else {
        setPasswords(data)
      }
    }

    fetchPasswords()
  }, [])

  const addPassword = async () => {
    if (!newName.trim() || !newPassword.trim()) return

    const newEntry = {
      name: newName.trim(),
      password: newPassword.trim(),
      user_email: userEmail,
    }

    const { data, error } = await supabase
      .from("passwords")
      .insert([newEntry])
      .select()

    if (error) {
      console.error("Error al agregar contraseña:", error)
    } else {
      setPasswords([...passwords, ...data])
      setNewName("")
      setNewPassword("")
    }
  }

  const removePassword = async (id) => {
    const { error } = await supabase
      .from("passwords")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail)

    if (error) {
      console.error("Error al eliminar contraseña:", error)
    } else {
      setPasswords(passwords.filter((password) => password.id !== id))
    }
  }

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="w-full h-screen p-6 bg-rose-100 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">🔒 Gestor de Contraseñas</h2>

      {/* Formulario para agregar nueva contraseña */}
      <div className="flex gap-4 mb-6">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre"
          className="flex-1 ring-2 ring-rose-300 focus:ring-rose-500 transition-all duration-200"
        />
        <Input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          className="flex-1 ring-2 ring-rose-300 focus:ring-rose-500 transition-all duration-200"
        />
        <Button onClick={addPassword} size="icon" variant="default">
          <Plus size={24} />
        </Button>
      </div>

      {/* Lista de contraseñas */}
      <div className="space-y-4">
        {passwords.map((password) => (
          <div
            key={password.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">{password.name}</span>
              <span className="text-lg">
                {visiblePasswords[password.id]
                  ? password.password
                  : "••••••••"}
              </span>
              <Button
                onClick={() => togglePasswordVisibility(password.id)}
                size="icon"
                variant="ghost"
              >
                {visiblePasswords[password.id] ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </Button>
            </div>
            <Button
              onClick={() => removePassword(password.id)}
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={24} />
            </Button>
          </div>
        ))}
      </div>

        <Home />
    </div>
  )
}
