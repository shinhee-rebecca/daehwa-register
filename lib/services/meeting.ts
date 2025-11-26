import { supabase } from '../supabase/client'

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
}
