import { z } from 'zod'
import {
  createLeaderSchema,
  leaderSchema,
  updateLeaderSchema,
  type CreateLeader,
  type UpdateLeader,
} from '../validations/leader'

const leaderWithMeetingSchema = leaderSchema.extend({
  meeting_name: z.string().nullable().optional(),
})

export type LeaderWithMeeting = z.infer<typeof leaderWithMeetingSchema>

export class LeaderService {
  async getCurrentLeader(email: string): Promise<LeaderWithMeeting> {
    const response = await fetch('/api/leaders/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '리더 정보 조회에 실패했습니다.'
      throw new Error(message)
    }

    return leaderWithMeetingSchema.parse(payload)
  }

  async list(): Promise<LeaderWithMeeting[]> {
    const response = await fetch('/api/leaders', {
      method: 'GET',
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '리더 목록 조회에 실패했습니다.'
      throw new Error(message)
    }

    return leaderWithMeetingSchema.array().parse(payload)
  }

  async create(leader: CreateLeader): Promise<LeaderWithMeeting> {
    const validated = createLeaderSchema.parse(leader)

    const response = await fetch('/api/leaders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '리더 생성에 실패했습니다.'
      throw new Error(message)
    }

    return leaderWithMeetingSchema.parse(payload)
  }

  async update(id: string, leader: UpdateLeader): Promise<LeaderWithMeeting> {
    const validated = updateLeaderSchema.parse(leader)

    const response = await fetch(`/api/leaders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '리더 수정에 실패했습니다.'
      throw new Error(message)
    }

    return leaderWithMeetingSchema.parse(payload)
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/leaders/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : '리더 삭제에 실패했습니다.'
      throw new Error(message)
    }
  }
}
