import React, { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Save } from "lucide-react"

import { createSupabaseClient } from "@/api/Supabase"

const supabase = createSupabaseClient()
const user = JSON.parse(localStorage.getItem("user")) || null
const userEmail = user?.email ?? null

export default function TaskList({ type }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

  // 🔄 Cargar tareas desde Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userEmail) return

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("type", type)
        .eq("user_email", userEmail)
        .order("id", { ascending: true })

      if (error) {
        console.error("Error al cargar tareas:", error)
      } else {
        setTasks(data)
      }
    }

    fetchTasks()
  }, [type])

  // ➕ Agregar tarea (solo en UI por ahora)
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks([
      ...tasks,
      {
        title: newTask.trim(),
        done: false,
        type,
        user_email: userEmail,
      },
    ])
    setNewTask("")
  }

  // ✅ Cambiar estado (y guardar si ya existe)
  const toggleTask = async (index) => {
    const updated = [...tasks]
    updated[index].done = !updated[index].done
    setTasks(updated)

    const task = updated[index]
    if (task.id) {
      const { error } = await supabase
        .from("tasks")
        .update({ done: task.done })
        .eq("id", task.id)
        .eq("user_email", userEmail)

      if (error) {
        console.error("Error actualizando tarea:", error)
      }
    }
  }

  // ❌ Eliminar tarea de Supabase y UI
  const removeTask = async (index) => {
    const task = tasks[index]
    if (task.id) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id)
        .eq("user_email", userEmail)

      if (error) {
        console.error("Error eliminando tarea:", error)
        return
      }
    }
    setTasks(tasks.filter((_, i) => i !== index))
  }

  // 💾 Guardar tareas y actualizarlas
  const saveTasks = async () => {
    if (!userEmail) return

    const newTasks = tasks.filter((task) => !task.id)
    const existingTasks = tasks.filter((task) => task.id)

    // Insertar nuevas tareas
    if (newTasks.length > 0) {
      const { data: insertedTasks, error } = await supabase
        .from("tasks")
        .insert(newTasks)
        .select() // para recuperar los IDs de las nuevas tareas

      if (error) {
        console.error("Error al guardar nuevas tareas:", error)
      } else {
        // Si se insertan nuevas tareas, actualizamos el estado con las tareas insertadas
        setTasks([...tasks.filter(task => task.id), ...insertedTasks])
      }
    }

    // Actualizar tareas existentes (solo campo 'done')
    for (const task of existingTasks) {
      const { error } = await supabase
        .from("tasks")
        .update({ done: task.done })
        .eq("id", task.id)
        .eq("user_email", userEmail)

      if (error) {
        console.error(`Error actualizando tarea "${task.title}":`, error)
      }
    }

    // Refrescar tareas
    const { data: updatedTasks, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("type", type)
      .eq("user_email", userEmail)
      .order("id", { ascending: true })

    if (fetchError) {
      console.error("Error recargando tareas:", fetchError)
    } else {
      setTasks(updatedTasks || [])
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-xl p-4 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">📝 Lista de Tareas</h2>
      <div className="flex gap-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          className="flex-1"
        />
        <Button onClick={addTask} size="icon" variant="default">
          <Plus size={20} />
        </Button>
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id ?? `temp-${index}`}
            className="flex items-center justify-between p-2 bg-muted rounded-xl hover:bg-muted/80 transition"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.done}
                onCheckedChange={() => toggleTask(index)}
              />
              <span className={`text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </span>
            </div>
            <Button
              onClick={() => removeTask(index)}
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        onClick={saveTasks}
        className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
        variant="primary"
      >
        <Save className="mr-2" size={18} />
        Guardar Cambios
      </Button>
    </Card>
  )
}
