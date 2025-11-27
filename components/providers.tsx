'use client'

import { Provider } from 'jotai'
import { ReactNode } from 'react'
import { AuthListener } from './auth/auth-listener'
import { Toaster } from './ui/sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
      <AuthListener />
      {children}
      <Toaster />
    </Provider>
  )
}
