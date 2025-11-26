import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin-client'

interface RoleResponse {
  role: 'admin' | 'leader'
  profileId: string
  assignedMeetingId?: string | null
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

    const { data: admin, error: adminError } = await supabaseAdmin
      .from('administrators')
      .select('id')
      .eq('google_email', normalizedEmail)
      .maybeSingle()

    if (adminError) {
      console.error('Administrator lookup failed', adminError)
      return NextResponse.json(
        { error: '역할 확인 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (admin) {
      const response: RoleResponse = { role: 'admin', profileId: admin.id }
      return NextResponse.json(response)
    }

    const { data: leader, error: leaderError } = await supabaseAdmin
      .from('leaders')
      .select('id, assigned_meeting_id')
      .eq('google_email', normalizedEmail)
      .maybeSingle()

    if (leaderError) {
      console.error('Leader lookup failed', leaderError)
      return NextResponse.json(
        { error: '역할 확인 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (leader) {
      const response: RoleResponse = {
        role: 'leader',
        profileId: leader.id,
        assignedMeetingId: leader.assigned_meeting_id,
      }
      return NextResponse.json(response)
    }

    return NextResponse.json(
      {
        error: '등록되지 않은 Google 계정입니다. 관리자에게 문의하세요.',
      },
      { status: 403 }
    )
  } catch (error) {
    console.error('Role lookup failed', error)
    return NextResponse.json(
      { error: '역할 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
