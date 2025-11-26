import { atom } from 'jotai'

export type UserRole = 'admin' | 'leader'

export interface User {
  id: string
  email: string
  role: UserRole
}

// Base atom for user state
export const userAtom = atom<User | null>(null)

// Hydration flag to avoid redirects before we know auth state
export const authInitializedAtom = atom(false)

// Derived atom for user role
export const userRoleAtom = atom((get) => {
  const user = get(userAtom)
  return user?.role ?? null
})

// Derived atom for authentication status
export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom)
  return user !== null
})
