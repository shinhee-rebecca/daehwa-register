'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createParticipantSchema, type CreateParticipant, type Participant } from '@/lib/validations/participant'
import { ParticipantService } from '@/lib/services/participant'
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
import { Loader2 } from 'lucide-react'

interface ParticipantFormProps {
  participant?: Participant
  onSuccess: () => void
  onCancel: () => void
}

export function ParticipantForm({ participant, onSuccess, onCancel }: ParticipantFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!participant

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createParticipantSchema) as any,
    defaultValues: participant
      ? {
          gender: participant.gender,
          age: participant.age,
          name: participant.name,
          months: participant.months,
          first_registration_month: participant.first_registration_month,
          phone: participant.phone,
          fee: participant.fee,
          re_registration: participant.re_registration,
          latest_registration: participant.latest_registration,
          current_meeting_id: participant.current_meeting_id,
          notes: participant.notes || undefined,
          past_meetings: participant.past_meetings,
        }
      : {
          gender: 'male',
          age: 0,
          name: '',
          months: 0,
          first_registration_month: '',
          phone: '',
          fee: 0,
          re_registration: false,
          latest_registration: '',
          current_meeting_id: null,
          notes: undefined,
          past_meetings: [],
        },
  })

  const gender = watch('gender')

  const onSubmit = async (data: CreateParticipant) => {
    setLoading(true)
    setError(null)

    try {
      const service = new ParticipantService()

      if (isEdit && participant) {
        await service.update(participant.id!, data)
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-600">{String(errors.name.message)}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">성별 *</Label>
          <Select
            value={gender}
            onValueChange={(value) => setValue('gender', value as 'male' | 'female')}
          >
            <SelectTrigger id="gender">
              <SelectValue />
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

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">나이 *</Label>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age && (
            <p className="text-sm text-red-600">{String(errors.age.message)}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">전화번호 *</Label>
          <Input id="phone" placeholder="010-1234-5678" {...register('phone')} />
          {errors.phone && (
            <p className="text-sm text-red-600">{String(errors.phone.message)}</p>
          )}
        </div>

        {/* Months */}
        <div className="space-y-2">
          <Label htmlFor="months">개월수 *</Label>
          <Input
            id="months"
            type="number"
            {...register('months', { valueAsNumber: true })}
          />
          {errors.months && (
            <p className="text-sm text-red-600">{String(errors.months.message)}</p>
          )}
        </div>

        {/* Fee */}
        <div className="space-y-2">
          <Label htmlFor="fee">회비 *</Label>
          <Input
            id="fee"
            type="number"
            {...register('fee', { valueAsNumber: true })}
          />
          {errors.fee && (
            <p className="text-sm text-red-600">{String(errors.fee.message)}</p>
          )}
        </div>

        {/* First Registration Month */}
        <div className="space-y-2">
          <Label htmlFor="first_registration_month">첫 등록월 *</Label>
          <Input
            id="first_registration_month"
            type="month"
            {...register('first_registration_month')}
          />
          {errors.first_registration_month && (
            <p className="text-sm text-red-600">
              {String(errors.first_registration_month.message)}
            </p>
          )}
        </div>

        {/* Latest Registration */}
        <div className="space-y-2">
          <Label htmlFor="latest_registration">최근 등록월 *</Label>
          <Input
            id="latest_registration"
            type="month"
            {...register('latest_registration')}
          />
          {errors.latest_registration && (
            <p className="text-sm text-red-600">
              {String(errors.latest_registration.message)}
            </p>
          )}
        </div>

        {/* Re-registration */}
        <div className="space-y-2">
          <Label htmlFor="re_registration">재등록 여부</Label>
          <Select
            value={watch('re_registration') ? 'true' : 'false'}
            onValueChange={(value) => setValue('re_registration', value === 'true')}
          >
            <SelectTrigger id="re_registration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">신규</SelectItem>
              <SelectItem value="true">재등록</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">메모</Label>
          <Input id="notes" {...register('notes')} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          저장
        </Button>
      </div>
    </form>
  )
}
