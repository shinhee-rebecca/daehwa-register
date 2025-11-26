import { supabase } from '../supabase/client'
import {
  participantSchema,
  createParticipantSchema,
  updateParticipantSchema,
  type Participant,
  type CreateParticipant,
  type UpdateParticipant,
} from '../validations/participant'

export interface ParticipantFilters {
  gender?: 'male' | 'female'
  age_min?: number
  age_max?: number
  name?: string
  months_min?: number
  months_max?: number
  first_registration_month?: string
  phone?: string
  fee_min?: number
  fee_max?: number
  re_registration?: boolean
  latest_registration?: string
  current_meeting_id?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export type SortDirection = 'asc' | 'desc'

export type ParticipantSortField =
  | 'created_at'
  | 'name'
  | 'age'
  | 'months'
  | 'fee'

export interface SortParams {
  column: ParticipantSortField
  direction?: SortDirection
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class ParticipantService {
  private readonly TABLE_NAME = 'participants'
  private readonly DEFAULT_PAGE = 1
  private readonly DEFAULT_LIMIT = 15

  async getAll(
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<Participant>> {
    const page = pagination.page || this.DEFAULT_PAGE
    const limit = pagination.limit || this.DEFAULT_LIMIT
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw new Error(`참여자 목록 조회 실패: ${error.message}`)
    }

    const validatedData = data.map((item) => participantSchema.parse(item))

    return {
      data: validatedData,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  async getById(id: string): Promise<Participant | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`참여자 조회 실패: ${error.message}`)
    }

    return participantSchema.parse(data)
  }

  async create(participant: CreateParticipant): Promise<Participant> {
    const validatedData = createParticipantSchema.parse(participant)

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      throw new Error(`참여자 생성 실패: ${error.message}`)
    }

    return participantSchema.parse(data)
  }

  async update(id: string, participant: UpdateParticipant): Promise<Participant> {
    const validatedData = updateParticipantSchema.parse(participant)

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`참여자 수정 실패: ${error.message}`)
    }

    return participantSchema.parse(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`참여자 삭제 실패: ${error.message}`)
    }
  }

  async search(
    filters: ParticipantFilters,
    pagination: PaginationParams = {},
    sort?: SortParams
  ): Promise<PaginatedResponse<Participant>> {
    const page = pagination.page || this.DEFAULT_PAGE
    const limit = pagination.limit || this.DEFAULT_LIMIT
    const from = (page - 1) * limit
    const to = from + limit - 1
    const sortColumn = sort?.column || 'created_at'
    const isAscending = (sort?.direction || 'desc') === 'asc'

    let query = supabase.from(this.TABLE_NAME).select('*', { count: 'exact' })

    // Apply filters
    if (filters.gender) {
      query = query.eq('gender', filters.gender)
    }
    if (filters.age_min !== undefined) {
      query = query.gte('age', filters.age_min)
    }
    if (filters.age_max !== undefined) {
      query = query.lte('age', filters.age_max)
    }
    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`)
    }
    if (filters.months_min !== undefined) {
      query = query.gte('months', filters.months_min)
    }
    if (filters.months_max !== undefined) {
      query = query.lte('months', filters.months_max)
    }
    if (filters.first_registration_month) {
      query = query.eq('first_registration_month', filters.first_registration_month)
    }
    if (filters.phone) {
      query = query.ilike('phone', `%${filters.phone}%`)
    }
    if (filters.fee_min !== undefined) {
      query = query.gte('fee', filters.fee_min)
    }
    if (filters.fee_max !== undefined) {
      query = query.lte('fee', filters.fee_max)
    }
    if (filters.re_registration !== undefined) {
      query = query.eq('re_registration', filters.re_registration)
    }
    if (filters.latest_registration) {
      query = query.eq('latest_registration', filters.latest_registration)
    }
    if (filters.current_meeting_id) {
      query = query.eq('current_meeting_id', filters.current_meeting_id)
    }

    const { data, error, count } = await query
      .order(sortColumn, { ascending: isAscending })
      .range(from, to)

    if (error) {
      throw new Error(`참여자 검색 실패: ${error.message}`)
    }

    const validatedData = data.map((item) => participantSchema.parse(item))

    return {
      data: validatedData,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }
}
