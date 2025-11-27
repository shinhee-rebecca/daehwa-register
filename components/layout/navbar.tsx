'use client'

import Link from 'next/link'
import { useAtom } from 'jotai'
import { userAtom, userRoleAtom } from '@/lib/store/auth'
import { AuthService } from '@/lib/services/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Users, UserCircle, LogOut, RefreshCw } from 'lucide-react'

export function Navbar() {
  const [user] = useAtom(userAtom)
  const [role] = useAtom(userRoleAtom)
  const authService = new AuthService()

  const handleSignOut = async () => {
    await authService.signOut()
    window.location.href = '/login'
  }

  const handleSwitchAccount = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Failed to sign out before switching account:', error)
    }

    const redirectPath =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}` || '/'
        : '/'

    try {
      await authService.signInWithGoogle(redirectPath, true)
    } catch (error) {
      console.error('Failed to start Google login for account switch:', error)
    }
  }

  if (!user) return null

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Users className="h-6 w-6" />
          <span>대화상점 인명부</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {role === 'admin' && (
            <div className="flex items-center gap-2">
              <Link href="/participants">
                <Button variant="ghost">참여자 관리</Button>
              </Link>
              <Link href="/leaders">
                <Button variant="ghost">리더 관리</Button>
              </Link>
              <Link href="/meetings">
                <Button variant="ghost">모임 관리</Button>
              </Link>
            </div>
          )}
          {role === 'leader' && (
            <div className="flex items-center gap-2">
              <Link href="/leader-dashboard">
                <Button variant="ghost">참여자 조회</Button>
              </Link>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-stone-500">
                    {role === 'admin' ? '관리자' : '리더'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSwitchAccount}>
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>다른 계정으로 로그인</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
