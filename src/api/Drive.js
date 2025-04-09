import {FOLDER_ID , GD_API_KEY} from "../credentials"

const FOLDER = FOLDER_ID
const API_KEY = GD_API_KEY

export async function fetchDriveImages() {
    const q = encodeURIComponent(`'${FOLDER}' in parents and mimeType contains 'image/' and trashed = false`);
    const fields = 'files(id,name,webContentLink,thumbnailLink)';
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&key=${API_KEY}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      console.log(data);
      return data.files || [];
    } catch (err) {
      console.error("Algo malo ocurrió:", err.message);
      return [];
    }
  }