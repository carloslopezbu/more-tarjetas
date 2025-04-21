import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  fetchPhotos,
  uploadPhoto,
  fetchAlbums,
  createAlbum,
  uploadImageToStorage,
} from "@/api/Photos"
import { motion, AnimatePresence } from "framer-motion"

import { Plus, CameraIcon, Trash } from "lucide-react"
import Home from "./Home"
import { SidebarMenuButton, SidebarProvider, SidebarMenu, SidebarMenuItem } from "./ui/sidebar"

const user = JSON.parse(localStorage.getItem("user")) || null
const userEmail = user?.email ?? null
const userId = user?.id ?? null

export default function PhotoManager() {
  const [photos, setPhotos] = useState([])
  const [albums, setAlbums] = useState([])
  const [newAlbumName, setNewAlbumName] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState("")
  const [newPhotoTitle, setNewPhotoTitle] = useState("")
  const [newPhotoFile, setNewPhotoFile] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showUploadSection, setShowUploadSection] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!userEmail) return

      const cachedAlbums = JSON.parse(localStorage.getItem("albums"))
      const cachedPhotos = JSON.parse(localStorage.getItem("photos"))

      if (cachedAlbums && cachedPhotos && false) {
        setAlbums(cachedAlbums)
        setPhotos(cachedPhotos)
      } else {
        const fetchedAlbums = await fetchAlbums(userEmail)
        const fetchedPhotos = await fetchPhotos(userEmail)
        setAlbums(fetchedAlbums)
        setPhotos(fetchedPhotos)
        localStorage.setItem("albums", JSON.stringify(fetchedAlbums))
        localStorage.setItem("photos", JSON.stringify(fetchedPhotos))
      }
    }

    loadData()
  }, [])

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return
    const album = await createAlbum({ name: newAlbumName, userEmail })
    if (album) {
      const updatedAlbums = [...albums, album]
      setAlbums(updatedAlbums)
      localStorage.setItem("albums", JSON.stringify(updatedAlbums))
      setNewAlbumName("")
    }
  }

  const handleUploadPhotos = async () => {
    if (!newPhotoFile || !selectedAlbum) return

    const uploadedPhotos = []
    for (const file of newPhotoFile) {
      const imageUrl = await uploadImageToStorage(file, userId)
      if (!imageUrl) {
        console.error(`Error al obtener la URL de la imagen: ${file.name}`)
        continue
      }

      const photo = await uploadPhoto({
        title: file.name,
        url: imageUrl,
        albumId: selectedAlbum,
        userEmail,
      })

      if (photo) {
        uploadedPhotos.push(photo)
      }
    }

    if (uploadedPhotos.length > 0) {
      const updatedPhotos = [...photos, ...uploadedPhotos]
      setPhotos(updatedPhotos)
      localStorage.setItem("photos", JSON.stringify(updatedPhotos))
      setNewPhotoFile(null)
    }
  }

  const handleDeletePhoto = async (photoId) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId)
    setPhotos(updatedPhotos)
    localStorage.setItem("photos", JSON.stringify(updatedPhotos))
    // Optionally, call an API to delete the photo from the backend
  }

  const handleDeleteAlbum = async (albumId) => {
    const updatedAlbums = albums.filter((album) => album.id !== albumId)
    setAlbums(updatedAlbums)
    localStorage.setItem("albums", JSON.stringify(updatedAlbums))
    const updatedPhotos = photos.filter((photo) => photo.album_id !== albumId)
    setPhotos(updatedPhotos)
    localStorage.setItem("photos", JSON.stringify(updatedPhotos))
    // Optionally, call an API to delete the album from the backend
  }

  const filteredPhotos = selectedAlbum
    ? photos.filter((p) => p.album_id === selectedAlbum)
    : photos

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-rose-200 p-5 flex flex-col h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">📁 Álbumes</h2>

        <div className="flex mb-4 gap-2">
          <Input
            placeholder="Nuevo álbum"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
          <Button onClick={handleCreateAlbum} className="bg-rose-300 hover:bg-rose-400 transition-all duration-200">
            <Plus size={24} />
          </Button>
        </div>

        <SidebarProvider>
          <SidebarMenu>
            {albums.map((album) => (
              <SidebarMenuItem key={album.id}>
                <div className="flex items-center justify-between">
                  <SidebarMenuButton
                    className={`flex items-center gap-2 ${
                      selectedAlbum === album.id
                        ? "bg-rose-400 font-bold text-white"
                        : "hover:bg-rose-300"
                    }`}
                    onClick={() => setSelectedAlbum(album.id)}
                  >
                    <CameraIcon size={24} />
                    <span>{album.name}</span>
                  </SidebarMenuButton>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    <Trash size={24} />
                  </Button>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarProvider>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">🖼️ Galería de Fotos</h2>

        {/* Toggle Upload */}
        <Button
          onClick={() => setShowUploadSection(!showUploadSection)}
          className="mb-4 bg-rose-300 hover:bg-rose-400 transition-all duration-200"
        >
          {showUploadSection ? "⬆️ Ocultar Subida" : "📤 Subir Nueva Foto"}
        </Button>

        {/* Upload Section con animación */}
        <AnimatePresence>
          {showUploadSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden flex gap-4 mb-6 flex-wrap"
            >
              <Input
                type="file"
                multiple
                onChange={(e) => setNewPhotoFile(e.target.files)}
                className="flex-1 min-w-[200px] h-13"
              />
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="border rounded px-4 py-2 h-13"
              >
                <option value="">Seleccionar Álbum</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name}
                  </option>
                ))}
              </select>
              <Button
                className="bg-rose-300 hover:bg-rose-400"
                onClick={handleUploadPhotos}
              >
                📤 Subir
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer relative"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-64 object-cover transition-transform hover:scale-105"
                onClick={() => setSelectedPhoto(photo)}
              />
              {/* <div className="p-4">
                <h3 className="text-lg font-semibold">{photo.title}</h3>
              </div> */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleDeletePhoto(photo.id)}
              >
                <Trash size={24} />
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* Fullscreen Viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-5xl w-full px-4">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
            />
            <p className="text-center text-white mt-4 text-lg">
              {selectedPhoto.title}
            </p>
          </div>
        </div>
      )}

      <Home />
    </div>
  )
}
