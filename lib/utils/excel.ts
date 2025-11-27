import * as XLSX from 'xlsx'
import { type Participant } from '@/lib/validations/participant'

/**
 * Excel 파일 내보내기를 위한 유틸리티 함수들
 */

/**
 * 한글 컬럼 헤더 매핑
 */
const PARTICIPANT_HEADERS: Record<string, string> = {
  name: '이름',
  gender: '성별',
  age: '나이',
  phone: '전화번호',
  months: '개월수',
  first_registration_month: '첫 등록월',
  fee: '회비',
  re_registration: '재등록',
  latest_registration: '최근 등록',
  current_meeting_id: '현재 모임',
  notes: '비고',
  past_meetings: '과거 모임',
  created_at: '등록일',
}

/**
 * 참여자 데이터를 Excel 행 데이터로 변환
 */
function participantToExcelRow(
  participant: Participant,
  meetingNameResolver?: (meetingId?: string | null) => string
): Record<string, unknown> {
  return {
    [PARTICIPANT_HEADERS.name]: participant.name,
    [PARTICIPANT_HEADERS.gender]: participant.gender === 'male' ? '남성' : '여성',
    [PARTICIPANT_HEADERS.age]: participant.age,
    [PARTICIPANT_HEADERS.phone]: participant.phone,
    [PARTICIPANT_HEADERS.months]: participant.months,
    [PARTICIPANT_HEADERS.first_registration_month]:
      participant.first_registration_month || '',
    [PARTICIPANT_HEADERS.fee]: participant.fee,
    [PARTICIPANT_HEADERS.re_registration]: participant.re_registration ? '예' : '아니오',
    [PARTICIPANT_HEADERS.latest_registration]: participant.latest_registration || '',
    [PARTICIPANT_HEADERS.current_meeting_id]:
      (meetingNameResolver?.(participant.current_meeting_id) ??
        participant.current_meeting_id) || '',
    [PARTICIPANT_HEADERS.notes]: participant.notes || '',
    [PARTICIPANT_HEADERS.past_meetings]: participant.past_meetings?.join(', ') || '',
    [PARTICIPANT_HEADERS.created_at]: participant.created_at
      ? new Date(participant.created_at).toLocaleDateString('ko-KR')
      : '',
  }
}

/**
 * 참여자 목록을 Excel 파일로 내보내기
 *
 * @param participants - 내보낼 참여자 목록
 * @param filename - 저장할 파일명 (기본값: participants_YYYYMMDD_HHmmss.xlsx)
 */
export function exportParticipantsToExcel(
  participants: Participant[],
  filename?: string,
  meetingNameResolver?: (meetingId?: string | null) => string
): void {
  if (participants.length === 0) {
    throw new Error('내보낼 데이터가 없습니다')
  }

  // 데이터를 Excel 행으로 변환
  const excelData = participants.map((participant) =>
    participantToExcelRow(participant, meetingNameResolver)
  )

  // 워크북 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '참여자 목록')

  // 컬럼 너비 자동 조정
  const maxWidths: Record<number, number> = {}
  const headers = Object.values(PARTICIPANT_HEADERS)

  // 헤더 너비 계산
  headers.forEach((header, index) => {
    maxWidths[index] = header.length * 2
  })

  // 데이터 너비 계산
  excelData.forEach((row) => {
    Object.values(row).forEach((value, index) => {
      const valueStr = String(value || '')
      const width = valueStr.length * 1.2
      if (!maxWidths[index] || width > maxWidths[index]) {
        maxWidths[index] = Math.min(width, 50) // 최대 50자로 제한
      }
    })
  })

  // 컬럼 너비 적용
  worksheet['!cols'] = Object.values(maxWidths).map((width) => ({ wch: width }))

  // 파일명 생성 (미지정 시 현재 날짜/시간 사용)
  const now = new Date()
  const dateString = now
    .toISOString()
    .slice(0, 19)
    .replace(/[-:]/g, '')
    .replace('T', '_')
  const finalFilename = filename || `participants_${dateString}.xlsx`

  // 파일 저장
  XLSX.writeFile(workbook, finalFilename)
}

/**
 * 브라우저 다운로드를 위한 Blob 생성
 *
 * @param participants - 내보낼 참여자 목록
 * @param meetingNameResolver - 모임 ID를 이름으로 변환하는 함수
 * @returns Excel 파일의 Blob 객체
 */
export function createParticipantsExcelBlob(
  participants: Participant[],
  meetingNameResolver?: (meetingId?: string | null) => string
): Blob {
  if (participants.length === 0) {
    throw new Error('내보낼 데이터가 없습니다')
  }

  // 데이터를 Excel 행으로 변환
  const excelData = participants.map((participant) =>
    participantToExcelRow(participant, meetingNameResolver)
  )

  // 워크북 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '참여자 목록')

  // 컬럼 너비 자동 조정
  const maxWidths: Record<number, number> = {}
  const headers = Object.values(PARTICIPANT_HEADERS)

  headers.forEach((header, index) => {
    maxWidths[index] = header.length * 2
  })

  excelData.forEach((row) => {
    Object.values(row).forEach((value, index) => {
      const valueStr = String(value || '')
      const width = valueStr.length * 1.2
      if (!maxWidths[index] || width > maxWidths[index]) {
        maxWidths[index] = Math.min(width, 50)
      }
    })
  })

  worksheet['!cols'] = Object.values(maxWidths).map((width) => ({ wch: width }))

  // Blob 생성
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * 브라우저에서 Excel 파일 다운로드 실행
 *
 * @param blob - Excel 파일 Blob
 * @param filename - 저장할 파일명
 */
export function downloadExcelFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
