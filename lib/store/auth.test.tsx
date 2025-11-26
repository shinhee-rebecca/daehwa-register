import { describe, it, expect } from 'vitest'
import { useAtom, Provider } from 'jotai'
import { renderHook, act } from '@testing-library/react'
import { userAtom, userRoleAtom, isAuthenticatedAtom } from './auth'
import { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
)

describe('Authentication Atoms', () => {
  describe('userAtom', () => {
    it('should initialize with null', () => {
      const { result } = renderHook(() => useAtom(userAtom), { wrapper })
      expect(result.current[0]).toBeNull()
    })

    it('should update user state', () => {
      const { result } = renderHook(() => useAtom(userAtom), { wrapper })
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      act(() => {
        result.current[1](mockUser)
      })

      expect(result.current[0]).toEqual(mockUser)
    })

    it('should clear user state', () => {
      const { result } = renderHook(() => useAtom(userAtom), { wrapper })
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      act(() => {
        result.current[1](mockUser)
      })

      act(() => {
        result.current[1](null)
      })

      expect(result.current[0]).toBeNull()
    })
  })

  describe('userRoleAtom', () => {
    it('should return null when user is not set', () => {
      const { result } = renderHook(() => useAtom(userRoleAtom), { wrapper })
      expect(result.current[0]).toBeNull()
    })

    it('should return user role when user is set', () => {
      const { result } = renderHook(
        () => ({
          user: useAtom(userAtom),
          role: useAtom(userRoleAtom),
        }),
        { wrapper }
      )

      act(() => {
        result.current.user[1]({
          id: '123',
          email: 'admin@example.com',
          role: 'admin',
        })
      })

      expect(result.current.role[0]).toBe('admin')
    })
  })

  describe('isAuthenticatedAtom', () => {
    it('should return false when user is null', () => {
      const { result } = renderHook(() => useAtom(isAuthenticatedAtom), { wrapper })
      expect(result.current[0]).toBe(false)
    })

    it('should return true when user is set', () => {
      const { result } = renderHook(
        () => ({
          user: useAtom(userAtom),
          auth: useAtom(isAuthenticatedAtom),
        }),
        { wrapper }
      )

      act(() => {
        result.current.user[1]({
          id: '123',
          email: 'test@example.com',
          role: 'leader',
        })
      })

      expect(result.current.auth[0]).toBe(true)
    })
  })
})
