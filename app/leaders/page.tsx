'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { LeaderForm } from '@/components/leaders/leader-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LeaderService, type LeaderWithMeeting } from '@/lib/services/leader'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<LeaderWithMeeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLeader, setSelectedLeader] = useState<LeaderWithMeeting | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [leaderToDelete, setLeaderToDelete] = useState<LeaderWithMeeting | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchLeaders = async () => {
    setLoading(true)
    setError(null)
    try {
      const service = new LeaderService()
      const data = await service.list()
      setLeaders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '리더 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaders()
  }, [])

  const handleAddClick = () => {
    setSelectedLeader(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (leader: LeaderWithMeeting) => {
    setSelectedLeader(leader)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (leader: LeaderWithMeeting) => {
    setLeaderToDelete(leader)
    setActionError(null)
    setIsDeleteDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedLeader(null)
  }

  const handleFormSuccess = () => {
    handleDialogClose()
    fetchLeaders()
  }

  const confirmDelete = async () => {
    if (!leaderToDelete?.id) return
    setDeleting(true)
    setActionError(null)

    try {
      const service = new LeaderService()
      await service.delete(leaderToDelete.id)
      setIsDeleteDialogOpen(false)
      setLeaderToDelete(null)
      fetchLeaders()
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : '리더 삭제 중 오류가 발생했습니다.'
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">리더 관리</h1>
            <p className="text-sm text-stone-500">
              Google 이메일을 등록하면 리더가 로그인할 수 있습니다.
            </p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            리더 추가
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>성별</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>Google 이메일</TableHead>
                <TableHead>담당 모임</TableHead>
                <TableHead className="w-[140px] text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex items-center justify-center gap-2 text-stone-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      불러오는 중...
                    </div>
                  </TableCell>
                </TableRow>
              ) : leaders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    등록된 리더가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                leaders.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell className="font-medium">{leader.name}</TableCell>
                    <TableCell>{leader.gender === 'male' ? '남성' : '여성'}</TableCell>
                    <TableCell>{leader.phone}</TableCell>
                    <TableCell>{leader.google_email}</TableCell>
                    <TableCell>{leader.meeting_name || '배정 안 됨'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(leader)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          수정
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(leader)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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

        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLeader ? '리더 수정' : '리더 추가'}</DialogTitle>
              <DialogDescription>
                Google 이메일은 로그인 인증에 사용됩니다.
              </DialogDescription>
            </DialogHeader>
            <LeaderForm
              leader={selectedLeader || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>리더 삭제</DialogTitle>
              <DialogDescription>삭제된 리더는 복구할 수 없습니다.</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-stone-700">
              {leaderToDelete
                ? `${leaderToDelete.name} 리더를 삭제하시겠습니까?`
                : '선택된 리더가 없습니다.'}
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
