import 'server-only'

import { supabase } from './client'
import type { Category, Product, ProductWithCategory } from './types'

export async function getCategories(): Promise<Pick<Category, 'id' | 'name'>[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function getProducts(options?: {
  availableOnly?: boolean
  limit?: number
}): Promise<ProductWithCategory[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  if (options?.availableOnly) {
    query = query.eq('available', true)
  }

  if (options?.limit && options.limit > 0) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as unknown as ProductWithCategory[]
}

export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  return getProducts({ availableOnly: true, limit: 8 })
}

export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as unknown as ProductWithCategory
}

export const productCacheOptions = { next: { revalidate: 30 } }
export const categoryCacheOptions = { next: { revalidate: 60 } }
