import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchPhotos, uploadPhoto, fetchAlbums, createAlbum, uploadImageToStorage } from "@/api/Photos"

const user = JSON.parse(localStorage.getItem("user")) || null
console.log(user)
const userEmail = user?.email ?? null
const userId = user?.id ?? null

export default function PhotoManager() {
  const [photos, setPhotos] = useState([])
  const [albums, setAlbums] = useState([])
  const [newAlbumName, setNewAlbumName] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState("")
  const [newPhotoTitle, setNewPhotoTitle] = useState("")
  const [newPhotoFile, setNewPhotoFile] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      if (!userEmail) return
      const fetchedPhotos = await fetchPhotos(userEmail)
      const fetchedAlbums = await fetchAlbums(userEmail)
      setPhotos(fetchedPhotos)
      setAlbums(fetchedAlbums)
    }

    loadData()
  }, [])

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return
    const album = await createAlbum({ name: newAlbumName, userEmail })
    if (album) {
      setAlbums([...albums, album])
      setNewAlbumName("")
    }
  }

  const handleUploadPhoto = async () => {
    if (!newPhotoTitle.trim() || !newPhotoFile || !selectedAlbum) return

    // Subir la imagen al almacenamiento de Supabase
    const imageUrl = await uploadImageToStorage(newPhotoFile, userId)
    if (!imageUrl) {
      console.error("Error al obtener la URL de la imagen.")
      return
    }

    // Guardar la información de la foto en la base de datos
    const photo = await uploadPhoto({
      title: newPhotoTitle,
      url: imageUrl,
      albumId: selectedAlbum,
      userEmail,
    })
    if (photo) {
      setPhotos([...photos, photo])
      setNewPhotoTitle("")
      setNewPhotoFile(null)
    }
  }

  return (
    <div className="w-full h-screen p-6 bg-gray-100 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">📸 Gestor de Fotos</h2>

      {/* Crear nuevo álbum */}
      <div className="flex gap-4 mb-6">
        <Input
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          placeholder="Nombre del álbum"
          className="flex-1"
        />
        <Button onClick={handleCreateAlbum} variant="default">
          Crear Álbum
        </Button>
      </div>

      {/* Subir nueva foto */}
      <div className="flex gap-4 mb-6">
        <Input
          value={newPhotoTitle}
          onChange={(e) => setNewPhotoTitle(e.target.value)}
          placeholder="Título de la foto"
          className="flex-1"
        />
        <Input
          type="file"
          onChange={(e) => setNewPhotoFile(e.target.files[0])}
          className="flex-1"
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
        <Button onClick={handleUploadPhoto} variant="default">
          Subir Foto
        </Button>
      </div>

      {/* Lista de fotos */}
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow p-4">
            <img src={photo.url} alt={photo.title} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-bold mt-2">{photo.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
