/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/supabase/lib/client'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sb = supabaseAdmin as any

  const { data: product, error } = await sb
    .from('products')
    .select('*, category:categories(name)')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { name, price, image_url, category_id, available, description } = body

    if (!name || !price || !category_id) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 })
    }

    const { data, error } = await (supabaseAdmin as any)
      .from('products')
      .update({
        name,
        price: parseFloat(price),
        image_url: image_url || null,
        category_id,
        available: available !== undefined ? available : true,
        description: description || null,
      })
      .eq('id', id)
      .select('*, category:categories(name)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await (supabaseAdmin as any)
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
