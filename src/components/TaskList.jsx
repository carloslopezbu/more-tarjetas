import React, { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Save } from "lucide-react"

import { createSupabaseClient } from "@/api/Supabase"

const supabase = createSupabaseClient()
const user = JSON.parse(sessionStorage.getItem("user")) || null
const userEmail = user?.email ?? null

export default function TaskList({ type }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState(null) // Estado para el filtro

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
        status: 0, // Default status: 0
        type,
        user_email: userEmail,
      },
    ])
    setNewTask("")
  }

  // ✅ Cambiar estado (y guardar si ya existe)
  const toggleTaskStatus = async (index) => {
    const updated = [...tasks]
    updated[index].status = (updated[index].status + 1) % 3 // Ciclar entre 0, 1, 2
    setTasks(updated)

    const task = updated[index]
    if (task.id) {
      const { error } = await supabase
        .from("tasks")
        .update({ status: task.status })
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
        .insert(newTasks.map(task => ({ ...task, status: 0 }))) // Default status: 0
        .select() // para recuperar los IDs de las nuevas tareas

      if (error) {
        console.error("Error al guardar nuevas tareas:", error)
      } else {
        // Si se insertan nuevas tareas, actualizamos el estado con las tareas insertadas
        setTasks([...tasks.filter(task => task.id), ...insertedTasks])
      }
    }

    // Actualizar tareas existentes (solo campo 'status')
    for (const task of existingTasks) {
      const { error } = await supabase
        .from("tasks")
        .update({ status: task.status })
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

  // Filtrar tareas según el estado seleccionado
  const filteredTasks = filter === null ? tasks : tasks.filter(task => task.status === filter)

  return (
    <Card className="w-full h-full p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">📝 Lista de Tareas</h2>

      {/* Filtro de tareas */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setFilter(null)}
          variant={filter === null ? "secondary" : "outline"}
        >
          Todas
        </Button>
        <Button
          onClick={() => setFilter(0)}
          variant={filter === 0 ? "secondary" : "outline"}
          className="text-red-500"
        >
          Por Completar
        </Button>
        <Button
          onClick={() => setFilter(1)}
          variant={filter === 1 ? "secondary" : "outline"}
          className="text-yellow-500"
        >
          En Progreso
        </Button>
        <Button
          onClick={() => setFilter(2)}
          variant={filter === 2 ? "secondary" : "outline"}
          className="text-green-500"
        >
          Finalizada
        </Button>
      </div>

      {/* Input para nueva tarea */}
      <div className="flex gap-4 mb-6">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          className="flex-1"
        />
        <Button onClick={addTask} size="icon" variant="default" className="bg-rose-300 hover:bg-rose-400">
          <Plus size={24} />
        </Button>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => (
          <div
            key={task.id ?? `temp-${index}`}
            className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition"
          >
            <div className="flex items-center gap-4">
              <Button
                onClick={() => toggleTaskStatus(index)}
                size="sm"
                variant="outline"
                className={`${
                  task.status === 0
                    ? "text-red-500"
                    : task.status === 1
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {task.status === 0
                  ? "Por Completar"
                  : task.status === 1
                  ? "En Progreso"
                  : "Finalizada"}
              </Button>
              <span className="text-lg">{task.title}</span>
            </div>
            <Button
              onClick={() => removeTask(index)}
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={24} />
            </Button>
          </div>
        ))}
      </div>

      {/* Botón para guardar cambios */}
      <Button
        onClick={saveTasks}
        className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded"
        variant="primary"
      >
        <Save className="mr-2" size={24} />
        Guardar Cambios
      </Button>
    </Card>
  )
}