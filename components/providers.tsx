'use client'

import { Provider } from 'jotai'
import { ReactNode } from 'react'
import { AuthListener } from './auth/auth-listener'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
      <AuthListener />
      {children}
    </Provider>
  )
}
