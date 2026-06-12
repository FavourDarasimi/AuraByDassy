import { supabase } from './client'

const BUCKET_NAME = 'products'

export function getPublicImageUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadProductImage(
  file: File,
  productSku: string,
): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${productSku}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  return getPublicImageUrl(filePath)
}
