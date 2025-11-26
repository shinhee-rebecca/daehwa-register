import { supabase } from '../supabase/client'
import type { User, UserRole } from '../store/auth'
import type { Session } from '@supabase/supabase-js'

export class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(redirectPath = '/participants') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
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
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`로그아웃 실패: ${error.message}`)
    }
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

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '역할 확인에 실패했습니다.'
      throw new Error(message)
    }

    if (!payload?.role) {
      throw new Error('역할 정보를 찾을 수 없습니다.')
    }

    return payload.role as UserRole
  }
}
