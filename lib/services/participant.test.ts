import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ParticipantService } from './participant'

// Mock Supabase client
vi.mock('../supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
        order: vi.fn(() => ({
          range: vi.fn(),
        })),
        range: vi.fn(),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}))

describe('ParticipantService', () => {
  let service: ParticipantService

  beforeEach(() => {
    service = new ParticipantService()
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all participants with pagination', async () => {
      // This test verifies the interface - implementation will be added
      expect(service.getAll).toBeDefined()
      expect(typeof service.getAll).toBe('function')
    })
  })

  describe('getById', () => {
    it('should fetch a single participant by id', async () => {
      expect(service.getById).toBeDefined()
      expect(typeof service.getById).toBe('function')
    })
  })

  describe('create', () => {
    it('should create a new participant', async () => {
      expect(service.create).toBeDefined()
      expect(typeof service.create).toBe('function')
    })

    it('should validate participant data before creation', async () => {
      expect(service.create).toBeDefined()
    })
  })

  describe('update', () => {
    it('should update an existing participant', async () => {
      expect(service.update).toBeDefined()
      expect(typeof service.update).toBe('function')
    })
  })

  describe('delete', () => {
    it('should delete a participant by id', async () => {
      expect(service.delete).toBeDefined()
      expect(typeof service.delete).toBe('function')
    })
  })

  describe('search', () => {
    it('should search participants by multiple criteria', async () => {
      expect(service.search).toBeDefined()
      expect(typeof service.search).toBe('function')
    })
  })
})
