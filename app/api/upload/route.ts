/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/supabase/lib/client'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const sb = supabaseAdmin as any
    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { error } = await sb.storage
      .from('products')
      .upload(filePath, file, {
        contentType: file.type,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = sb.storage
      .from('products')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
