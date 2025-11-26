'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  ParticipantService,
  type ParticipantSortField,
  type SortParams,
} from '@/lib/services/participant'
import { participantFiltersAtom, paginationAtom } from '@/lib/store/participant'
import { type Participant } from '@/lib/validations/participant'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { ParticipantFilters } from '@/components/participants/participant-filters'
import { ParticipantForm } from '@/components/participants/participant-form'
import { ArrowUpDown, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'

export default function ParticipantsPage() {
  const [filters] = useAtom(participantFiltersAtom)
  const [pagination, setPagination] = useAtom(paginationAtom)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [sort, setSort] = useState<SortParams>({
    column: 'created_at',
    direction: 'desc',
  })
  const [searchVersion, setSearchVersion] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchParticipants = async () => {
    setLoading(true)
    try {
      const service = new ParticipantService()
      const result = await service.search(filters, pagination, sort)
      setParticipants(result.data)
      setTotalPages(result.totalPages)

      const currentPage = pagination.page || 1
      if (result.totalPages > 0 && currentPage > result.totalPages) {
        setPagination((prev) => ({ ...prev, page: result.totalPages }))
      }
    } catch (error) {
      console.error('Failed to fetch participants:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sort, searchVersion])

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    setSearchVersion((prev) => prev + 1)
  }

  const handleAddClick = () => {
    setSelectedParticipant(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (participant: Participant) => {
    setSelectedParticipant(participant)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant)
    setActionError(null)
    setIsDeleteDialogOpen(true)
  }

  const handleSuccess = () => {
    setSelectedParticipant(null)
    setIsDialogOpen(false)
    fetchParticipants()
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedParticipant(null)
    }
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleSort = (column: ParticipantSortField) => {
    setSort((prev) => {
      const isSameColumn = prev?.column === column
      const nextDirection =
        isSameColumn && prev?.direction === 'desc' ? 'asc' : 'desc'

      return { column, direction: nextDirection }
    })
    if ((pagination.page || 1) !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }))
    }
  }

  const confirmDelete = async () => {
    if (!participantToDelete?.id) return

    setDeleting(true)
    setActionError(null)

    try {
      const service = new ParticipantService()
      await service.delete(participantToDelete.id)
      setIsDeleteDialogOpen(false)
      setParticipantToDelete(null)
      fetchParticipants()
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다'
      )
    } finally {
      setDeleting(false)
    }
  }

  const renderSortableHead = (label: string, column: ParticipantSortField) => {
    const isActive = sort.column === column
    const directionIcon = isActive && sort.direction === 'asc' ? '↑' : '↓'

    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-auto px-2 py-1 font-semibold"
        onClick={() => handleSort(column)}
      >
        <span>{label}</span>
        <ArrowUpDown className="ml-1 h-4 w-4" />
        {isActive && (
          <span className="ml-1 text-xs text-stone-500">{directionIcon}</span>
        )}
      </Button>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">참여자 관리</h1>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            참여자 추가
          </Button>
        </div>

        <div className="mb-6">
          <ParticipantFilters onSearch={handleSearch} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{renderSortableHead('이름', 'name')}</TableHead>
                <TableHead>성별</TableHead>
                <TableHead className="whitespace-nowrap">
                  {renderSortableHead('나이', 'age')}
                </TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead className="whitespace-nowrap">
                  {renderSortableHead('개월수', 'months')}
                </TableHead>
                <TableHead>{renderSortableHead('회비', 'fee')}</TableHead>
                <TableHead>현재 모임</TableHead>
                <TableHead className="whitespace-nowrap">
                  {renderSortableHead('등록일', 'created_at')}
                </TableHead>
                <TableHead className="w-[140px] text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : participants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(participant)}
                        >
                          <Pencil className="h-4 w-4" />
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(participant)}
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

        {!loading && totalPages > 0 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      handlePageChange((pagination.page || 1) - 1)
                    }}
                    className="cursor-pointer"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pagination.page === pageNumber}
                        onClick={(event) => {
                          event.preventDefault()
                          handlePageChange(pageNumber)
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      handlePageChange((pagination.page || 1) + 1)
                    }}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-sm text-stone-500">
              페이지 {pagination.page} / {totalPages}
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedParticipant ? '참여자 수정' : '참여자 추가'}
              </DialogTitle>
            </DialogHeader>
            <ParticipantForm
              participant={selectedParticipant || undefined}
              onSuccess={handleSuccess}
              onCancel={() => handleDialogChange(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>참여자 삭제</DialogTitle>
              <DialogDescription>삭제된 참여자는 복구할 수 없습니다.</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-stone-700">
              {participantToDelete?.name
                ? `${participantToDelete.name} 참여자를 삭제하시겠습니까?`
                : '선택된 참여자가 없습니다.'}
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
