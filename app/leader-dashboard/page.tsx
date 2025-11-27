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
import { ParticipantFilters } from '@/components/participants/participant-filters'
import { ArrowUpDown, Download, Loader2 } from 'lucide-react'
import {
  createParticipantsExcelBlob,
  downloadExcelFile,
} from '@/lib/utils/excel'
import { toast } from 'sonner'
import { userAtom } from '@/lib/store/auth'

export default function LeaderDashboardPage() {
  const [user] = useAtom(userAtom)
  const [filters] = useAtom(participantFiltersAtom)
  const [pagination, setPagination] = useAtom(paginationAtom)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [sort, setSort] = useState<SortParams>({
    column: 'created_at',
    direction: 'desc',
  })
  const [searchVersion, setSearchVersion] = useState(1)
  const [exporting, setExporting] = useState(false)

  const fetchParticipants = async () => {
    setLoading(true)
    try {
      const service = new ParticipantService()

      // TODO: 리더의 assigned_meeting_id를 가져와서 필터에 추가
      // 현재는 모든 데이터를 보여주지만, 추후 리더의 meeting만 필터링
      const result = await service.search(filters, pagination, sort)
      setParticipants(result.data)
      setTotalPages(result.totalPages)

      const currentPage = pagination.page || 1
      if (result.totalPages > 0 && currentPage > result.totalPages) {
        setPagination((prev) => ({ ...prev, page: result.totalPages }))
      }
    } catch (error) {
      console.error('Failed to fetch participants:', error)
      toast.error('참여자 목록을 불러오는 데 실패했습니다')
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

  const handleExportCurrentPage = async () => {
    if (participants.length === 0) {
      toast.error('내보낼 데이터가 없습니다')
      return
    }

    setExporting(true)
    try {
      const blob = createParticipantsExcelBlob(participants)
      const now = new Date()
      const dateString = now
        .toISOString()
        .slice(0, 19)
        .replace(/[-:]/g, '')
        .replace('T', '_')
      const filename = `participants_page${pagination.page}_${dateString}.xlsx`
      downloadExcelFile(blob, filename)
      toast.success('현재 페이지가 Excel로 내보내졌습니다')
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Excel 내보내기 실패'
      )
    } finally {
      setExporting(false)
    }
  }

  const handleExportAll = async () => {
    setExporting(true)
    try {
      const service = new ParticipantService()
      const allParticipants = await service.searchAll(filters, sort)

      if (allParticipants.length === 0) {
        toast.error('내보낼 데이터가 없습니다')
        return
      }

      const blob = createParticipantsExcelBlob(allParticipants)
      const now = new Date()
      const dateString = now
        .toISOString()
        .slice(0, 19)
        .replace(/[-:]/g, '')
        .replace('T', '_')
      const filename = `participants_all_${dateString}.xlsx`
      downloadExcelFile(blob, filename)
      toast.success(`전체 ${allParticipants.length}개의 데이터가 Excel로 내보내졌습니다`)
    } catch (error) {
      console.error('Excel export error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Excel 내보내기 실패'
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['leader', 'admin']}>
      <div className="container mx-auto py-4 px-4 md:py-8">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">참여자 조회</h1>
            <p className="text-sm text-stone-500 mt-2">
              {user?.email ? `${user.email}님의 담당 모임` : '리더 대시보드'}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleExportCurrentPage}
              disabled={exporting || participants.length === 0}
            >
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              <span className="hidden sm:inline">현재 페이지 내보내기</span>
              <span className="sm:hidden">현재 페이지</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleExportAll}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              <span className="hidden sm:inline">전체 내보내기</span>
              <span className="sm:hidden">전체</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <ParticipantFilters onSearch={handleSearch} />
        </div>

        <div className="rounded-md border overflow-x-auto">
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
      </div>
    </ProtectedRoute>
  )
}
