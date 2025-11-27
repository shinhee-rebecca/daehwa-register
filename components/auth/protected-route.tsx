'use client'

import { useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'
import { authInitializedAtom, userAtom } from '@/lib/store/auth'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'leader')[]
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const [user] = useAtom(userAtom)
  const [initialized] = useAtom(authInitializedAtom)
  const router = useRouter()
  const pathname = usePathname()

  const roleHome = useMemo(() => {
    if (!user) return null
    return user.role === 'admin' ? '/participants' : '/leader-dashboard'
  }, [user])

  const isAllowed = useMemo(() => {
    if (!user) return false
    if (!allowedRoles || allowedRoles.length === 0) return true
    return allowedRoles.includes(user.role)
  }, [allowedRoles, user])

  useEffect(() => {
    if (!initialized) return

    if (!user) {
      const url = new URL(redirectTo, window.location.origin)
      url.searchParams.set('redirect', pathname || '/')
      router.replace(url.toString())
      return
    }

    if (!isAllowed) {
      if (roleHome) {
        router.replace(roleHome)
      } else {
        const url = new URL('/login', window.location.origin)
        url.searchParams.set('error', 'unauthorized')
        router.replace(url.toString())
      }
    }
  }, [initialized, isAllowed, pathname, redirectTo, roleHome, router, user])

  if (!initialized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-stone-500">
        로그인 상태를 확인하는 중...
      </div>
    )
  }

  if (!user || !isAllowed) {
    return null
  }

  return <>{children}</>
}
