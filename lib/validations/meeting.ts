import { z } from 'zod'

export const meetingSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, '모임 이름은 필수입니다'),
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const createMeetingSchema = meetingSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateMeetingSchema = meetingSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type Meeting = z.infer<typeof meetingSchema>
export type CreateMeeting = z.infer<typeof createMeetingSchema>
export type UpdateMeeting = z.infer<typeof updateMeetingSchema>
