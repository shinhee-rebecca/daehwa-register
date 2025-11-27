import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin-client'
import { updateLeaderSchema } from '@/lib/validations/leader'

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

async function ensureAuthUser(email?: string) {
  if (!email) return
  const normalizedEmail = email.trim().toLowerCase()
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
  })

  if (error) {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const json = await request.json()
    const validated = updateLeaderSchema.parse(json)
    const normalizedEmail = validated.google_email
      ? validated.google_email.trim().toLowerCase()
      : undefined

    if (normalizedEmail) {
      await ensureAuthUser(normalizedEmail)
    }

    const { data, error } = await supabaseAdmin
      .from('leaders')
      .update({
        ...validated,
        ...(normalizedEmail ? { google_email: normalizedEmail } : {}),
      })
      .eq('id', id)
      .select(
        'id, gender, name, phone, google_email, assigned_meeting_id, created_at, updated_at, meetings:assigned_meeting_id(name)'
      )
      .single()

    if (error || !data) {
      console.error('Failed to update leader', error)
      return NextResponse.json(
        { error: '리더 수정에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(mapLeader(data))
  } catch (error) {
    console.error('Failed to update leader', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '리더 수정에 실패했습니다.' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('leaders').delete().eq('id', id)

  if (error) {
    console.error('Failed to delete leader', error)
    return NextResponse.json(
      { error: '리더 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
