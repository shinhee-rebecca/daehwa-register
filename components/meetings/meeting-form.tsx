'use client'

import { useState } from 'react'
import { MeetingService } from '@/lib/services/meeting'
import { type Meeting } from '@/lib/validations/meeting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface MeetingFormProps {
  meeting?: Meeting
  onSuccess: () => void
  onCancel: () => void
}

export function MeetingForm({ meeting, onSuccess, onCancel }: MeetingFormProps) {
  const [name, setName] = useState(meeting?.name || '')
  const [description, setDescription] = useState(meeting?.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const service = new MeetingService()
      const data = {
        name,
        description: description.trim() || null,
      }

      if (meeting?.id) {
        await service.update(meeting.id, data)
      } else {
        await service.create(data)
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">모임 이름 *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 독서 모임"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="모임에 대한 설명을 입력하세요"
          rows={4}
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {meeting ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  )
}
