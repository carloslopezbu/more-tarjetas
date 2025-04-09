import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { createSupabaseClient } from "@/api/Supabase"
import TaskList from "./TaskList"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"

const supabase = createSupabaseClient()
const user = JSON.parse(localStorage.getItem("user")) || null
const userEmail = user?.email ?? null

export default function TaskListManager() {
  const [taskLists, setTaskLists] = useState([])
  const [newListName, setNewListName] = useState("")

  useEffect(() => {
    const fetchLists = async () => {
      if (!userEmail) return

      const { data, error } = await supabase
        .from("task_list")
        .select("*")
        .eq("user_email", userEmail)

      if (error) console.error("Error cargando listas:", error)
      else setTaskLists(data)
    }

    fetchLists()
  }, [])

  const addList = async () => {
    if (!newListName.trim()) return

    const { data, error } = await supabase
      .from("task_list")
      .insert([{ name: newListName.trim(), user_email: userEmail }])
      .select()

    if (error) console.error("Error creando lista:", error)
    else {
      setTaskLists([...taskLists, ...data])
      setNewListName("")
    }
  }

  const removeList = async (id, name) => {
    const { error } = await supabase
      .from("task_list")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail)

    const { error: error2 } = await supabase
      .from("tasks")
      .delete()
      .eq("type", name)
      .eq("user_email", userEmail)

    if (error || error2) {
      console.error("Error eliminando lista:", error || error2)
    } else {
      setTaskLists(taskLists.filter((list) => list.id !== id))
    }
  }


  return (
    <div className="w-full h-screen p-6 bg-rose-100 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">📋 Gestor de Tareas</h2>

      {/* Crear nueva lista */}
      <div className="w-full max-w-5xl flex items-center gap-4 mb-6 mx-auto justify-center">
        <Input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Nueva lista"
          className="flex-1 ring-2 ring-rose-300 focus:ring-rose-500 transition-all duration-200"
        />
        <Button onClick={addList} size="icon">
          <Plus size={20} />
        </Button>
      </div>

      {/* Carrusel de listas */}
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {taskLists.map((list) => (
            <CarouselItem key={list.id}>
              <div
                className="bg-white rounded-2xl p-6 transition-all min-h-[500px] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{list.name}</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeList(list.id, list.name)
                    }}
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={24} />
                  </Button>
                </div>
                <div className="mt-4 flex-1">
                  {/* Mostrar siempre las tareas */}
                  <TaskList type={list.name} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between mt-4">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  )
}
