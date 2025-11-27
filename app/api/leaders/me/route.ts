import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin-client'

type SupabaseLeaderRow = {
  id: string
  gender: string
  name: string
  phone: string
  google_email: string
  assigned_meeting_id: string | null
  created_at?: string
  updated_at?: string
  meetings?: {
    name?: string | null
  } | null
}

function mapLeader(row: SupabaseLeaderRow) {
  return {
    id: row.id,
    gender: row.gender,
    name: row.name,
    phone: row.phone,
    google_email: row.google_email,
    assigned_meeting_id: row.assigned_meeting_id,
    meeting_name: row.meetings?.name ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data, error } = await supabaseAdmin
      .from('leaders')
      .select(
        'id, gender, name, phone, google_email, assigned_meeting_id, created_at, updated_at, meetings:assigned_meeting_id(name)'
      )
      .eq('google_email', normalizedEmail)
      .single()

    if (error) {
      console.error('Failed to fetch leader info', error)
      return NextResponse.json(
        { error: '리더 정보 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: '리더 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(mapLeader(data))
  } catch (error) {
    console.error('Failed to fetch leader info', error)
    return NextResponse.json(
      { error: '리더 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
