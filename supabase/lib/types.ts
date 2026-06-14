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
      order_clicks: {
        Row: OrderClick
        Insert: Omit<OrderClick, 'id' | 'created_at'>
        Update: Partial<Omit<OrderClick, 'id'>>
        Relationships: Array<{
          foreignKeyName: 'order_clicks_product_id_fkey'
          columns: ['product_id']
          isOneToOne?: false
          referencedRelation: 'products'
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

export interface OrderClick {
  id: string
  product_id: string | null
  product_name: string
  sku: string
  source: string
  metadata: Record<string, unknown>
  created_at: string
}
