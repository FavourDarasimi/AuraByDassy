import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/supabase/lib/auth-server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({ user: { id: user.id, email: user.email } })
}
