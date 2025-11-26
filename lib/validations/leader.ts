import { z } from 'zod'

const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/

export const leaderSchema = z.object({
  id: z.string().uuid().optional(),
  gender: z.enum(['male', 'female']),
  name: z.string().min(1, '이름은 필수입니다'),
  phone: z.string().regex(phoneRegex, '올바른 전화번호 형식이 아닙니다'),
  assigned_meeting_id: z.string().uuid().nullable().optional(),
  google_email: z.string().email('올바른 이메일 형식이 아닙니다'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const createLeaderSchema = leaderSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateLeaderSchema = leaderSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type Leader = z.infer<typeof leaderSchema>
export type CreateLeader = z.infer<typeof createLeaderSchema>
export type UpdateLeader = z.infer<typeof updateLeaderSchema>
