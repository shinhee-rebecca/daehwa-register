'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { AuthService } from '@/lib/services/auth'
import { authInitializedAtom, userAtom } from '@/lib/store/auth'

const UNAUTHORIZED_CODE = 'unauthorized'

function redirectToLoginWithError(code: string) {
  if (typeof window === 'undefined') return
  // 이미 로그인 페이지에 있다면 리다이렉트하지 않음
  if (window.location.pathname === '/login') return

  const url = new URL('/login', window.location.origin)
  url.searchParams.set('error', code)
  window.location.href = url.toString()
}

export function AuthListener() {
  const setUser = useSetAtom(userAtom)
  const setInitialized = useSetAtom(authInitializedAtom)

  useEffect(() => {
    const authService = new AuthService()

    const handleUnauthorized = () => {
      setUser(null)
      redirectToLoginWithError(UNAUTHORIZED_CODE)
    }

    const syncSession = async () => {
      try {
        const session = await authService.getSession()
        console.log('[AuthListener] syncSession - session:', session?.user?.email)
        const user = await authService.getUserFromSession(session)
        console.log('[AuthListener] syncSession - user:', user)
        setUser(user)
      } catch (error) {
        console.error('[AuthListener] syncSession error:', error)
        // 세션이 없거나 역할이 없는 경우에만 unauthorized 처리
        if (error instanceof Error && error.message.includes('등록되지 않은')) {
          console.log('[AuthListener] syncSession - handleUnauthorized')
          handleUnauthorized()
        } else {
          // 그 외의 에러는 사용자를 null로 설정만 함 (로그인 페이지로 리다이렉트하지 않음)
          console.log('[AuthListener] syncSession - setUser(null)')
          setUser(null)
        }
      } finally {
        setInitialized(true)
      }
    }

    syncSession()

    const subscription = authService.onAuthStateChange(
      (user) => {
        console.log('[AuthListener] onAuthStateChange - user:', user)
        setUser(user)
      },
      (message) => {
        console.log('[AuthListener] onAuthStateChange - error message:', message)
        // '등록되지 않은' 메시지가 포함된 경우에만 리다이렉트
        if (message.includes('등록되지 않은') || message.includes('권한이 없습니다')) {
          console.log('[AuthListener] onAuthStateChange - handleUnauthorized')
          handleUnauthorized()
        } else {
          // 그 외의 에러는 조용히 처리
          console.log('[AuthListener] onAuthStateChange - setUser(null)')
          setUser(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe?.()
    }
  }, [setInitialized, setUser])

  return null
}
