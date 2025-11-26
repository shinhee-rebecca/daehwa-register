import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectPath = requestUrl.searchParams.get('redirect')
  const safeRedirect =
    redirectPath && redirectPath.startsWith('/') ? redirectPath : '/participants'

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to home page after successful login
  return NextResponse.redirect(new URL(safeRedirect, requestUrl.origin))
}
