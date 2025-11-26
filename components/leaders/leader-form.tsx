'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  createLeaderSchema,
  type CreateLeader,
  type Leader,
} from '@/lib/validations/leader'
import { LeaderService } from '@/lib/services/leader'
import { MeetingService, type MeetingOption } from '@/lib/services/meeting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LeaderFormProps {
  leader?: Leader
  onSuccess: () => void
  onCancel: () => void
}

export function LeaderForm({ leader, onSuccess, onCancel }: LeaderFormProps) {
  const [loading, setLoading] = useState(false)
  const [meetings, setMeetings] = useState<MeetingOption[]>([])
  const [meetingsLoading, setMeetingsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!leader

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateLeader>({
    resolver: zodResolver(createLeaderSchema),
    defaultValues: leader
      ? {
          name: leader.name,
          gender: leader.gender,
          phone: leader.phone,
          assigned_meeting_id: leader.assigned_meeting_id,
          google_email: leader.google_email,
        }
      : {
          name: '',
          gender: 'male',
          phone: '',
          assigned_meeting_id: null,
          google_email: '',
        },
  })

  const gender = watch('gender')
  const assignedMeetingId = watch('assigned_meeting_id')

  useEffect(() => {
    const fetchMeetings = async () => {
      setMeetingsLoading(true)
      try {
        const service = new MeetingService()
        const options = await service.listNames()
        setMeetings(options)
      } catch (err) {
        console.error(err)
        setError('모임 목록을 불러오지 못했습니다.')
      } finally {
        setMeetingsLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  const onSubmit = async (data: CreateLeader) => {
    setLoading(true)
    setError(null)

    try {
      const service = new LeaderService()
      if (isEdit && leader?.id) {
        await service.update(leader.id, data)
      } else {
        await service.create(data)
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-600">{String(errors.name.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">성별 *</Label>
          <Select
            value={gender}
            onValueChange={(value) => setValue('gender', value as 'male' | 'female')}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="성별을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">남성</SelectItem>
              <SelectItem value="female">여성</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-600">{String(errors.gender.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">전화번호 *</Label>
          <Input id="phone" placeholder="010-1234-5678" {...register('phone')} />
          {errors.phone && (
            <p className="text-sm text-red-600">{String(errors.phone.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="google_email">Google 이메일 *</Label>
          <Input
            id="google_email"
            type="email"
            placeholder="leader@example.com"
            {...register('google_email')}
          />
          {errors.google_email && (
            <p className="text-sm text-red-600">
              {String(errors.google_email.message)}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="assigned_meeting_id">담당 모임</Label>
          <Select
            value={assignedMeetingId ?? 'none'}
            onValueChange={(value) =>
              setValue('assigned_meeting_id', value === 'none' ? null : value)
            }
            disabled={meetingsLoading}
          >
            <SelectTrigger id="assigned_meeting_id">
              <SelectValue placeholder="모임을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">배정 안 함</SelectItem>
              {meetings.map((meeting) => (
                <SelectItem key={meeting.id} value={meeting.id}>
                  {meeting.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assigned_meeting_id && (
            <p className="text-sm text-red-600">
              {String(errors.assigned_meeting_id.message)}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  )
}
