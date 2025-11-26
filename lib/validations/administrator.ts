import { z } from 'zod'

const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/

export const administratorSchema = z.object({
  id: z.string().uuid().optional(),
  gender: z.enum(['male', 'female']),
  name: z.string().min(1, '이름은 필수입니다'),
  phone: z.string().regex(phoneRegex, '올바른 전화번호 형식이 아닙니다'),
  created_at: z.string().datetime({ offset: true }).optional(),
  updated_at: z.string().datetime({ offset: true }).optional(),
})

export const createAdministratorSchema = administratorSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateAdministratorSchema = administratorSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type Administrator = z.infer<typeof administratorSchema>
export type CreateAdministrator = z.infer<typeof createAdministratorSchema>
export type UpdateAdministrator = z.infer<typeof updateAdministratorSchema>
