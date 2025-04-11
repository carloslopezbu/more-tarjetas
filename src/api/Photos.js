import { createSupabaseClient } from "@/api/Supabase"

const supabase = createSupabaseClient()

// Subir una imagen al almacenamiento de Supabase
export async function uploadImageToStorage(file, userName) {
  const fileName = `${userName}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(fileName, file)

  if (error) {
    console.error("Error al subir la imagen al almacenamiento:", error)
    return null
  }

  const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(fileName)
  return publicUrlData?.publicUrl || null
}

// Fetch all photos for a specific user
export async function fetchPhotos(userEmail) {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("user_email", userEmail)

  if (error) {
    console.error("Error fetching photos:", error)
    return []
  }
  console.log("Fetched photos:", data)
  return data
}

// Upload a new photo
export async function uploadPhoto({ title, url, albumId, userEmail }) {
  const { data, error } = await supabase
    .from("photos")
    .insert([{ title, url, album_id: albumId, user_email: userEmail }])
    .select()

  if (error) {
    console.error("Error uploading photo:", error)
    return null
  }

  return data[0]
}

// Fetch all albums for a specific user
export async function fetchAlbums(userEmail) {
  const { data, error } = await supabase
    .from("album")
    .select("*")
    .eq("user_email", userEmail)

  if (error) {
    console.error("Error fetching albums:", error)
    return []
  }

  return data
}

export async function fechtAmbumPhotos(userEmail, albumId) {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("user_email", userEmail)
    .eq("album_id", albumId)

  if (error) {
    console.error("Error fetching album photos:", error)
    return []
  }

  return data
}

// Create a new album
export async function createAlbum({ name, userEmail }) {
  const { data, error } = await supabase
    .from("album")
    .insert([{ name, user_email: userEmail }])
    .select()

  if (error) {
    console.error("Error creating album:", error)
    return null
  }

  return data[0]
}
