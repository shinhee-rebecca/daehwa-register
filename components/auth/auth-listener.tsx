'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { AuthService } from '@/lib/services/auth'
import { userAtom } from '@/lib/store/auth'

const UNAUTHORIZED_CODE = 'unauthorized'

function redirectToLoginWithError(code: string) {
  if (typeof window === 'undefined') return
  const url = new URL('/login', window.location.origin)
  url.searchParams.set('error', code)
  window.location.href = url.toString()
}

export function AuthListener() {
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    const authService = new AuthService()

    const handleUnauthorized = () => {
      setUser(null)
      redirectToLoginWithError(UNAUTHORIZED_CODE)
    }

    const syncSession = async () => {
      try {
        const session = await authService.getSession()
        const user = await authService.getUserFromSession(session)
        setUser(user)
      } catch {
        handleUnauthorized()
      }
    }

    syncSession()

    const subscription = authService.onAuthStateChange(
      (user) => setUser(user),
      () => handleUnauthorized()
    )

    return () => {
      subscription?.unsubscribe?.()
    }
  }, [setUser])

  return null
}
