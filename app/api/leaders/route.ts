import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin-client'
import { createLeaderSchema } from '@/lib/validations/leader'

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

async function ensureAuthUser(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
  })

  if (error) {
    // Ignore duplicate users
    if (
      error.status === 422 ||
      (typeof error.message === 'string' &&
        error.message.toLowerCase().includes('registered'))
    ) {
      return
    }

    console.error('Failed to create Supabase auth user', error)
    throw new Error('Supabase 사용자 등록에 실패했습니다.')
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('leaders')
    .select(
      'id, gender, name, phone, google_email, assigned_meeting_id, created_at, updated_at, meetings:assigned_meeting_id(name)'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch leaders', error)
    return NextResponse.json(
      { error: '리더 목록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }

  return NextResponse.json((data || []).map(mapLeader))
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validated = createLeaderSchema.parse(json)
    const normalizedEmail = validated.google_email.trim().toLowerCase()

    await ensureAuthUser(normalizedEmail)

    const { data, error } = await supabaseAdmin
      .from('leaders')
      .insert({
        ...validated,
        google_email: normalizedEmail,
      })
      .select(
        'id, gender, name, phone, google_email, assigned_meeting_id, created_at, updated_at, meetings:assigned_meeting_id(name)'
      )
      .single()

    if (error || !data) {
      console.error('Failed to create leader', error)
      return NextResponse.json(
        { error: '리더 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(mapLeader(data))
  } catch (error) {
    console.error('Failed to create leader', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '리더 생성에 실패했습니다.',
      },
      { status: 400 }
    )
  }
}
