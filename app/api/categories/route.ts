/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/supabase/lib/client'
import type { Category } from '@/supabase/lib/types'

export async function GET() {
  try {
    const sb = supabaseAdmin as any
    const { data: categories, error } = await sb
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const cats = (categories || []) as Pick<Category, 'id' | 'name'>[]
    const categoryIds = cats.map((c) => c.id)
    const counts: Record<string, number> = {}

    if (categoryIds.length > 0) {
      const { data: countsData } = await sb
        .from('products')
        .select('category_id')
        .in('category_id', categoryIds)

      for (const product of (countsData || []) as { category_id: string }[]) {
        counts[product.category_id] = (counts[product.category_id] || 0) + 1
      }
    }

    const result = cats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      product_count: counts[cat.id] || 0,
    }))

    return NextResponse.json({ categories: result })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const { data, error } = await (supabaseAdmin as any)
      .from('categories')
      .insert({ name: name.trim() })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category: data as Category }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
