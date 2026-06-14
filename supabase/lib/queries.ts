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
  return getProducts({ availableOnly: true, limit: 20 })
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

export async function getOrderClickCount(): Promise<number> {
  const { count, error } = await supabase
    .from('order_clicks')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching order click count:', error)
    return 0
  }

  return count || 0
}

export async function getTodayOrderClickCount(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('order_clicks')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())

  if (error) {
    console.error('Error fetching today order click count:', error)
    return 0
  }

  return count || 0
}

export const productCacheOptions = { next: { revalidate: 30 } }
export const categoryCacheOptions = { next: { revalidate: 60 } }
