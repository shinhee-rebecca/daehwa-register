import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/admin-client'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectPath = requestUrl.searchParams.get('redirect')

  let userEmail: string | null = null

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Failed to exchange code for session:', error)
    } else {
      userEmail = data?.user?.email ?? data?.session?.user?.email ?? null
    }
  }

  // 사용자 역할에 따라 리다이렉트 경로 결정 (역할 기반 라우팅을 우선 적용)
  let finalRedirect: string | null = null

  try {
    // SSR 환경에서 exchangeCodeForSession 결과로 이메일을 얻지 못한 경우를 대비해 한 번 더 조회
    if (!userEmail) {
      const { data: { user } } = await supabase.auth.getUser()
      userEmail = user?.email ?? null
    }

    if (userEmail) {
      const normalizedEmail = userEmail.trim().toLowerCase()

      // 관리자 확인
      const { data: admin } = await supabaseAdmin
        .from('administrators')
        .select('id')
        .eq('google_email', normalizedEmail)
        .maybeSingle()

      if (admin) {
        finalRedirect = '/participants'
      } else {
        // 리더 확인
        const { data: leader } = await supabaseAdmin
          .from('leaders')
          .select('id')
          .eq('google_email', normalizedEmail)
          .maybeSingle()

        if (leader) {
          finalRedirect = '/leader-dashboard'
        }
      }
    }
  } catch (error) {
    console.error('Failed to determine redirect path:', error)
  }

  // 역할 기반 경로가 없는 경우에만 redirect 파라미터 사용
  if (!finalRedirect) {
    finalRedirect = redirectPath && redirectPath.startsWith('/') ? redirectPath : '/participants'
  }

  return NextResponse.redirect(new URL(finalRedirect, requestUrl.origin))
}
