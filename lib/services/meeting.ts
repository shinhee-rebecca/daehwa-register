import { supabase } from '../supabase/client'
import {
  meetingSchema,
  createMeetingSchema,
  updateMeetingSchema,
  type Meeting,
  type CreateMeeting,
  type UpdateMeeting,
} from '../validations/meeting'

export interface MeetingOption {
  id: string
  name: string
}

export class MeetingService {
  async listNames(): Promise<MeetingOption[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(`모임 조회 실패: ${error.message}`)
    }

    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
    }))
  }

  async list(): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(`모임 목록 조회 실패: ${error.message}`)
    }

    return (data || []).map((item) => meetingSchema.parse(item))
  }

  async getById(id: string): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`모임 조회 실패: ${error.message}`)
    }

    return meetingSchema.parse(data)
  }

  async create(meeting: CreateMeeting): Promise<Meeting> {
    const validated = createMeetingSchema.parse(meeting)

    const { data, error } = await supabase
      .from('meetings')
      .insert(validated)
      .select()
      .single()

    if (error) {
      throw new Error(`모임 생성 실패: ${error.message}`)
    }

    return meetingSchema.parse(data)
  }

  async update(id: string, meeting: UpdateMeeting): Promise<Meeting> {
    const validated = updateMeetingSchema.parse(meeting)

    const { data, error } = await supabase
      .from('meetings')
      .update(validated)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`모임 수정 실패: ${error.message}`)
    }

    return meetingSchema.parse(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('meetings').delete().eq('id', id)

    if (error) {
      throw new Error(`모임 삭제 실패: ${error.message}`)
    }
  }
}
