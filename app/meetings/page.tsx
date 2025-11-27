'use client'

import { useEffect, useState } from 'react'
import { MeetingService } from '@/lib/services/meeting'
import { type Meeting } from '@/lib/validations/meeting'
import { ProtectedRoute } from '@/components/auth/protected-route'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MeetingForm } from '@/components/meetings/meeting-form'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchMeetings = async () => {
    setLoading(true)
    try {
      const service = new MeetingService()
      const result = await service.list()
      setMeetings(result)
    } catch (error) {
      console.error('Failed to fetch meetings:', error)
      toast.error('모임 목록을 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  const handleAddClick = () => {
    setSelectedMeeting(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (meeting: Meeting) => {
    setMeetingToDelete(meeting)
    setActionError(null)
    setIsDeleteDialogOpen(true)
  }

  const handleSuccess = () => {
    setSelectedMeeting(null)
    setIsDialogOpen(false)
    fetchMeetings()
    toast.success(selectedMeeting ? '모임이 수정되었습니다' : '모임이 추가되었습니다')
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedMeeting(null)
    }
  }

  const confirmDelete = async () => {
    if (!meetingToDelete?.id) return

    setDeleting(true)
    setActionError(null)

    try {
      const service = new MeetingService()
      await service.delete(meetingToDelete.id)
      setIsDeleteDialogOpen(false)
      setMeetingToDelete(null)
      fetchMeetings()
      toast.success('모임이 삭제되었습니다')
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다'
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto py-4 px-4 md:py-8">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl font-bold md:text-3xl">모임 관리</h1>
          <Button onClick={handleAddClick} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            모임 추가
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>모임 이름</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead className="w-[140px] text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    모임이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.name}</TableCell>
                    <TableCell>{meeting.description || '-'}</TableCell>
                    <TableCell>
                      {meeting.created_at
                        ? new Date(meeting.created_at).toLocaleDateString('ko-KR')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(meeting)}
                        >
                          <Pencil className="h-4 w-4" />
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(meeting)}
                        >
                          <Trash2 className="h-4 w-4" />
                          삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedMeeting ? '모임 수정' : '모임 추가'}
              </DialogTitle>
            </DialogHeader>
            <MeetingForm
              meeting={selectedMeeting || undefined}
              onSuccess={handleSuccess}
              onCancel={() => handleDialogChange(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>모임 삭제</DialogTitle>
              <DialogDescription>삭제된 모임은 복구할 수 없습니다.</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-stone-700">
              {meetingToDelete?.name
                ? `"${meetingToDelete.name}" 모임을 삭제하시겠습니까?`
                : '선택된 모임이 없습니다.'}
            </p>
            {actionError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                삭제
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
