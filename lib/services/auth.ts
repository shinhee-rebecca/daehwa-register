import { supabase } from '../supabase/client'
import type { User } from '../store/auth'

export class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Map Supabase user to our User type
        // In a real app, you'd fetch the user role from your database
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'admin', // TODO: Fetch from database
        }
        callback(user)
      } else {
        callback(null)
      }
    })

    return data.subscription
  }
}
