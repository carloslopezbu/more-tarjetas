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

export async function fechtAmbumPhotos(userEmail, albumName) {

  const { data, error } = await supabase
    .from("album")
    .select("id")
    .eq("name", albumName)

  if (error) {
    console.error("Error fetching album ID:", error)
    return []
  }

  const albumId = data[0]?.id
  if (!albumId) {
    console.error("Album not found")
    return []
  }

  const { data: photos, error: error2 } = await supabase
    .from("photos")
    .select("*")
    .eq("album_id", albumId)
    .eq("user_email", userEmail)
                                

  if (error2) {
    console.error("Error fetching album photos:", error)
    return []
  }

  return photos
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
