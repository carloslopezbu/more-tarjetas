import React, { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Save } from "lucide-react"

import { createSupabaseClient } from "@/api/Supabase"

const supabase = createSupabaseClient()

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

  // 🔄 Cargar tareas desde Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("id", { ascending: true })
      if (error) {
        console.error("Error al cargar tareas:", error)
      } else {
        setTasks(data)
      }
    }

    fetchTasks()
  }, [])

  // ➕ Agregar tarea (solo en UI por ahora)
  const addTask = () => {
    if (!newTask.trim()) return
    setTasks([...tasks, { title: newTask.trim(), done: false }])
    setNewTask("")
  }

  // ✅ Cambiar estado (solo en UI)
  const toggleTask = (index) => {
    const updated = [...tasks]
    updated[index].done = !updated[index].done
    setTasks(updated)
  }

  // ❌ Eliminar tarea de Supabase y UI
  const removeTask = async (index) => {
    const task = tasks[index]
    if (task.id) {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id)
      if (error) {
        console.error("Error eliminando tarea:", error)
        return
      }
    }
    setTasks(tasks.filter((_, i) => i !== index))
  }

  // 💾 Guardar nuevas tareas a Supabase
  const saveTasks = async () => {
    const newTasks = tasks.filter(task => !task.id)
    if (newTasks.length === 0) return

    const { data, error } = await supabase.from("tasks").insert(newTasks)
    if (error) {
      console.error("Error al guardar tareas:", error)
    } else {
      console.log("Tareas guardadas:", data)
      // Refrescar tareas con IDs asignados
      const { data: updatedTasks } = await supabase.from("tasks").select("*").order("id", { ascending: true })
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
        Guardar Tareas Nuevas
      </Button>
    </Card>
  )
}
