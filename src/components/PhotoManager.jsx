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

import { Plus } from "lucide-react"

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

      if (cachedAlbums && cachedPhotos) {
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

  const handleUploadPhoto = async () => {
    if (!newPhotoTitle.trim() || !newPhotoFile || !selectedAlbum) return

    const imageUrl = await uploadImageToStorage(newPhotoFile, userId)
    if (!imageUrl) {
      console.error("Error al obtener la URL de la imagen.")
      return
    }

    const photo = await uploadPhoto({
      title: newPhotoTitle,
      url: imageUrl,
      albumId: selectedAlbum,
      userEmail,
    })

    if (photo) {
      const updatedPhotos = [...photos, photo]
      setPhotos(updatedPhotos)
      localStorage.setItem("photos", JSON.stringify(updatedPhotos))
      setNewPhotoTitle("")
      setNewPhotoFile(null)
    }
  }

  const filteredPhotos = selectedAlbum
    ? photos.filter((p) => p.album_id === selectedAlbum)
    : photos

  return (
    <div className="flex h-screen bg-rose-50">
      {/* Sidebar */}
      <aside className="w-72 bg-rose-100 p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-4">📁 Álbumes</h2>

        <div className="flex mb-4 gap-2">
          <Input
            placeholder="Nuevo álbum"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
          <Button onClick={handleCreateAlbum} className="bg-rose-400 hover:bg-rose-500 transition-all duration-200">
            <Plus size={24} />
          </Button>
        </div>

        <ul className="space-y-2 w-64">
          {albums.map((album) => (
            <li
              key={album.id}
              className={`cursor-pointer p-3 rounded ring-2 ring-rose-400 m-1 ${
                selectedAlbum === album.id
                  ? "bg-rose-400 font-bold"
                  : "hover:bg-rose-400"
              }`}
              onClick={() => setSelectedAlbum(album.id)}
            >
              📷 {album.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">🖼️ Galería de Fotos</h2>

        {/* Toggle Upload */}
        <Button
          onClick={() => setShowUploadSection(!showUploadSection)}
          className="mb-4 bg-rose-400 hover:bg-rose-500 transition-all duration-200"
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
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                placeholder="Título de la foto"
                className="flex-1 min-w-[200px]"
              />
              <Input
                type="file"
                onChange={(e) => setNewPhotoFile(e.target.files[0])}
                className="flex-1 min-w-[200px]"
              />
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="border rounded px-4 py-2"
              >
                <option value="">Seleccionar Álbum</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleUploadPhoto}>📤 Subir</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-64 object-cover transition-transform hover:scale-105 blur-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{photo.title}</h3>
              </div>
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
    </div>
  )
}
