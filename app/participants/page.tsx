'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ParticipantService } from '@/lib/services/participant'
import { participantFiltersAtom, paginationAtom } from '@/lib/store/participant'
import { type Participant } from '@/lib/validations/participant'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ParticipantFilters } from '@/components/participants/participant-filters'
import { ParticipantForm } from '@/components/participants/participant-form'
import { Plus } from 'lucide-react'

export default function ParticipantsPage() {
  const [filters] = useAtom(participantFiltersAtom)
  const [pagination] = useAtom(paginationAtom)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>()

  const fetchParticipants = async () => {
    setLoading(true)
    try {
      const service = new ParticipantService()
      const result = await service.search(filters, pagination)
      setParticipants(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Failed to fetch participants:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination])

  const handleAddClick = () => {
    setSelectedParticipant(undefined)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchParticipants()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">참여자 관리</h1>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          참여자 추가
        </Button>
      </div>

      <div className="mb-6">
        <ParticipantFilters />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>성별</TableHead>
              <TableHead>나이</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>개월수</TableHead>
              <TableHead>회비</TableHead>
              <TableHead>현재 모임</TableHead>
              <TableHead>등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : participants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  참여자가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.gender === 'male' ? '남성' : '여성'}</TableCell>
                  <TableCell>{participant.age}세</TableCell>
                  <TableCell>{participant.phone}</TableCell>
                  <TableCell>{participant.months}개월</TableCell>
                  <TableCell>{participant.fee.toLocaleString()}원</TableCell>
                  <TableCell>{participant.current_meeting_id || '-'}</TableCell>
                  <TableCell>
                    {participant.created_at
                      ? new Date(participant.created_at).toLocaleDateString('ko-KR')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && totalPages > 0 && (
        <div className="mt-4 text-sm text-stone-500 text-center">
          페이지 {pagination.page} / {totalPages}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedParticipant ? '참여자 수정' : '참여자 추가'}
            </DialogTitle>
          </DialogHeader>
          <ParticipantForm
            participant={selectedParticipant}
            onSuccess={handleSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
