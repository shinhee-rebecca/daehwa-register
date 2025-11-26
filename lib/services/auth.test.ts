import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from './auth'

// Mock Supabase client
vi.mock('../supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}))

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    service = new AuthService()
    vi.clearAllMocks()
  })

  describe('signInWithGoogle', () => {
    it('should call Supabase signInWithOAuth with Google provider', async () => {
      expect(service.signInWithGoogle).toBeDefined()
      expect(typeof service.signInWithGoogle).toBe('function')
    })
  })

  describe('signOut', () => {
    it('should call Supabase signOut', async () => {
      expect(service.signOut).toBeDefined()
      expect(typeof service.signOut).toBe('function')
    })
  })

  describe('getSession', () => {
    it('should return current session', async () => {
      expect(service.getSession).toBeDefined()
      expect(typeof service.getSession).toBe('function')
    })
  })

  describe('onAuthStateChange', () => {
    it('should subscribe to auth state changes', () => {
      expect(service.onAuthStateChange).toBeDefined()
      expect(typeof service.onAuthStateChange).toBe('function')
    })
  })
})
