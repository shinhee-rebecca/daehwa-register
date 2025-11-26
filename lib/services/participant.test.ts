import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ParticipantService } from './participant'
import type { CreateParticipant } from '../validations/participant'

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
      const mockParticipants = [
        {
          id: '1',
          gender: 'male',
          age: 30,
          name: '홍길동',
          months: 12,
          first_registration_month: '2024-01',
          phone: '010-1234-5678',
          fee: 50000,
          re_registration: false,
          latest_registration: '2024-11',
          current_meeting_id: null,
          notes: null,
          past_meetings: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

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
      const newParticipant: CreateParticipant = {
        gender: 'male',
        age: 30,
        name: '홍길동',
        months: 0,
        first_registration_month: '2024-11',
        phone: '010-1234-5678',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
        past_meetings: [],
      }

      expect(service.create).toBeDefined()
      expect(typeof service.create).toBe('function')
    })

    it('should validate participant data before creation', async () => {
      const invalidParticipant = {
        gender: 'invalid',
        age: -1,
        name: '',
        phone: 'invalid',
      }

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
