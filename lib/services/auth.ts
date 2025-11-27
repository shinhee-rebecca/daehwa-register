import { supabase } from '../supabase/client'
import type { User, UserRole } from '../store/auth'
import type { Session } from '@supabase/supabase-js'

export class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(redirectPath = '/participants', forceSelectAccount = false) {
    const queryParams = forceSelectAccount ? { prompt: 'select_account' } : undefined

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        queryParams,
      },
    })

    if (error) {
      throw new Error(`Google 로그인 실패: ${error.message}`)
    }

    return data
  }

  /**
   * Sign out current user
   */
  async signOut() {
    const clearLocalSession = async () => {
      const { error: localError } = await supabase.auth.signOut({ scope: 'local' })
      if (localError) {
        console.warn('Local signOut failed:', localError)
      }
    }

    const { data: sessionData } = await supabase.auth.getSession()

    // 이미 세션이 없는 경우 조용히 통과
    if (!sessionData.session) {
      await clearLocalSession()
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      // Supabase가 세션이 없다고 응답하는 경우는 무시하고 나머지만 에러 처리
      const message = error.message || ''
      if (!message.toLowerCase().includes('auth session missing')) {
        throw new Error(`로그아웃 실패: ${message}`)
      }
      await clearLocalSession()
    }

    // 네트워크 오류 없이 signOut 되었다면 로컬 세션도 확실히 제거
    await clearLocalSession()
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw new Error(`세션 조회 실패: ${error.message}`)
    }

    return data.session
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(
    callback: (user: User | null) => void,
    onUnauthorized?: (message: string) => void
  ) {
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user?.email) {
        callback(null)
        return
      }

      try {
        const user = await this.getUserFromSession(session)
        callback(user)
      } catch (error) {
        await this.signOut()
        callback(null)
        const message =
          error instanceof Error
            ? error.message
            : '로그인 권한이 없습니다. 관리자에게 문의하세요.'
        onUnauthorized?.(message)
      }
    })

    return data.subscription
  }

  /**
   * Convert Supabase session to app User with role validation
   */
  async getUserFromSession(session: Session | null): Promise<User | null> {
    if (!session?.user?.email) {
      return null
    }

    const role = await this.fetchUserRole(session.user.email)

    return {
      id: session.user.id,
      email: session.user.email,
      role,
    }
  }

  /**
   * Fetch user role from server-side role lookup endpoint
   */
  private async fetchUserRole(email: string): Promise<UserRole> {
    const response = await fetch('/api/auth/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const payload = await response.json().catch(() => ({}))

    console.log('fetchUserRole response:', { status: response.ok, payload })

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '역할 확인에 실패했습니다.'
      console.error('fetchUserRole error:', message)
      throw new Error(message)
    }

    if (!payload?.role) {
      console.error('fetchUserRole: no role in payload')
      throw new Error('역할 정보를 찾을 수 없습니다.')
    }

    console.log('fetchUserRole success:', payload.role)
    return payload.role as UserRole
  }
}
