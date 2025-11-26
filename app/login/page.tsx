'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthService } from '@/lib/services/auth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authService = new AuthService()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const redirectParam = searchParams.get('redirect')

  useEffect(() => {
    if (!errorParam) {
      return
    }

    const message =
      errorParam === 'unauthorized'
        ? '등록되지 않은 Google 계정입니다. 관리자에게 문의하세요.'
        : errorParam

    setError(message)

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState(null, '', url.toString())
    }
  }, [errorParam])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await authService.signInWithGoogle(redirectParam || '/participants')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">대화상점 인명부</h1>
          <p className="mt-2 text-sm text-stone-600">
            독서모임 참여자 관리 시스템
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? '로그인 중...' : 'Google로 로그인'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-stone-500">
            로그인하려면 관리자가 등록한 Google 계정이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
