export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id'>>
        Relationships: Array<{
          foreignKeyName: string
          columns: string[]
          isOneToOne?: boolean
          referencedRelation: string
          referencedColumns: string[]
        }>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id'>>
        Relationships: Array<{
          foreignKeyName: 'products_category_id_fkey'
          columns: ['category_id']
          isOneToOne?: false
          referencedRelation: 'categories'
          referencedColumns: ['id']
        }>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  category_id: string
  available: boolean
  sku: string
  description: string | null
  created_at: string
}

export interface ProductWithCategory extends Product {
  category: Pick<Category, 'name'>
}
