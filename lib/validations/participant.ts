import { z } from 'zod'

// 한국 전화번호 형식 검증 (010-XXXX-XXXX 또는 010XXXXXXXX)
const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/

export const participantSchema = z.object({
  id: z.string().uuid().optional(),
  gender: z.enum(['male', 'female']),
  age: z.number().int().positive(),
  name: z.string().min(1, '이름은 필수입니다'),
  months: z.number().int().min(0).default(0),
  first_registration_month: z.string().regex(/^\d{4}-\d{2}$/, '올바른 형식이 아닙니다 (YYYY-MM)'),
  phone: z.string().regex(phoneRegex, '올바른 전화번호 형식이 아닙니다'),
  fee: z.number().int().min(0),
  re_registration: z.boolean().default(false),
  latest_registration: z.string().regex(/^\d{4}-\d{2}$/, '올바른 형식이 아닙니다 (YYYY-MM)'),
  current_meeting_id: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
  past_meetings: z.array(z.string()).default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const createParticipantSchema = participantSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateParticipantSchema = participantSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type Participant = z.infer<typeof participantSchema>
export type CreateParticipant = z.infer<typeof createParticipantSchema>
export type UpdateParticipant = z.infer<typeof updateParticipantSchema>
