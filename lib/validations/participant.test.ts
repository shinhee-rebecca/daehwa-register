import { describe, it, expect } from 'vitest'
import { participantSchema, createParticipantSchema } from './participant'

describe('Participant Validation', () => {
  describe('participantSchema', () => {
    it('should validate a valid participant', () => {
      const validParticipant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        gender: 'male',
        age: 30,
        name: '홍길동',
        months: 12,
        first_registration_month: '2024-01',
        phone: '010-1234-5678',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
        current_meeting_id: '123e4567-e89b-12d3-a456-426614174001',
        notes: '특이사항 없음',
        past_meetings: ['meeting1', 'meeting2'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = participantSchema.safeParse(validParticipant)
      expect(result.success).toBe(true)
    })

    it('should reject invalid gender', () => {
      const invalidParticipant = {
        gender: 'invalid',
        age: 30,
        name: '홍길동',
        months: 12,
        first_registration_month: '2024-01',
        phone: '010-1234-5678',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
      }

      const result = participantSchema.safeParse(invalidParticipant)
      expect(result.success).toBe(false)
    })

    it('should reject negative age', () => {
      const invalidParticipant = {
        gender: 'male',
        age: -1,
        name: '홍길동',
        months: 12,
        first_registration_month: '2024-01',
        phone: '010-1234-5678',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
      }

      const result = participantSchema.safeParse(invalidParticipant)
      expect(result.success).toBe(false)
    })

    it('should reject empty name', () => {
      const invalidParticipant = {
        gender: 'male',
        age: 30,
        name: '',
        months: 12,
        first_registration_month: '2024-01',
        phone: '010-1234-5678',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
      }

      const result = participantSchema.safeParse(invalidParticipant)
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone format', () => {
      const invalidParticipant = {
        gender: 'male',
        age: 30,
        name: '홍길동',
        months: 12,
        first_registration_month: '2024-01',
        phone: 'invalid-phone',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
      }

      const result = participantSchema.safeParse(invalidParticipant)
      expect(result.success).toBe(false)
    })

    it('should accept null for optional fields', () => {
      const participantWithNulls = {
        gender: 'female',
        age: 25,
        name: '김영희',
        months: 6,
        first_registration_month: '2024-06',
        phone: '010-9876-5432',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
        current_meeting_id: null,
        notes: null,
        past_meetings: [],
        participation_month: null,
      }

      const result = participantSchema.safeParse(participantWithNulls)
      expect(result.success).toBe(true)
    })

    it('should validate participation_month in YYMM format', () => {
      const validFormats = ['2411', '2506', '1708', '3012']

      validFormats.forEach((format) => {
        const participant = {
          gender: 'male',
          age: 30,
          name: '홍길동',
          months: 12,
          first_registration_month: '2024-01',
          phone: '010-1234-5678',
          fee: 50000,
          re_registration: false,
          latest_registration: '2024-11',
          participation_month: format,
        }

        const result = participantSchema.safeParse(participant)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid participation_month format', () => {
      const invalidFormats = ['241', '24111', 'abcd', '24-11', '2024-11']

      invalidFormats.forEach((format) => {
        const participant = {
          gender: 'male',
          age: 30,
          name: '홍길동',
          months: 12,
          first_registration_month: '2024-01',
          phone: '010-1234-5678',
          fee: 50000,
          re_registration: false,
          latest_registration: '2024-11',
          participation_month: format,
        }

        const result = participantSchema.safeParse(participant)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('createParticipantSchema', () => {
    it('should validate participant creation data', () => {
      const createData = {
        gender: 'male',
        age: 30,
        name: '홍길동',
        months: 0,
        first_registration_month: '2024-11',
        phone: '010-1234-5678',
        fee: 50000,
        re_registration: false,
        latest_registration: '2024-11',
      }

      const result = createParticipantSchema.safeParse(createData)
      expect(result.success).toBe(true)
    })

    it('should use default values for optional fields', () => {
      const createData = {
        gender: 'male',
        age: 30,
        name: '홍길동',
        first_registration_month: '2024-11',
        phone: '010-1234-5678',
        fee: 50000,
        latest_registration: '2024-11',
      }

      const result = createParticipantSchema.safeParse(createData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.months).toBe(0)
        expect(result.data.re_registration).toBe(false)
        expect(result.data.past_meetings).toEqual([])
      }
    })
  })
})
