/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/supabase/lib/client'

export async function GET(request: Request) {
  try {
    const sb = supabaseAdmin as any
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const available = searchParams.get('available')

    let query = sb
      .from('products')
      .select('*, category:categories(name)', { count: 'exact' })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (available === 'true') {
      query = query.eq('available', true)
    } else if (available === 'false') {
      query = query.eq('available', false)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: products, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      products: products || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, price, image_url, category_id, available } = body

    if (!name || !price || !category_id) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 })
    }

    const sku = `PRD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const { data, error } = await (supabaseAdmin as any)
      .from('products')
      .insert({
        name,
        price: parseFloat(price),
        image_url: image_url || null,
        category_id,
        sku,
        available: available !== undefined ? available : true,
      })
      .select('*, category:categories(name)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
