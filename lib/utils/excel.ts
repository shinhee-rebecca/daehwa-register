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
  participation_month: '참여월',
  current_meeting_id: '참여 모임',
  notes: '비고',
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
    [PARTICIPANT_HEADERS.age]: `${participant.age}년생`,
    [PARTICIPANT_HEADERS.phone]: participant.phone,
    [PARTICIPANT_HEADERS.months]: participant.months,
    [PARTICIPANT_HEADERS.first_registration_month]:
      participant.first_registration_month || '',
    [PARTICIPANT_HEADERS.fee]: participant.fee,
    [PARTICIPANT_HEADERS.re_registration]: participant.re_registration ? '예' : '아니오',
    [PARTICIPANT_HEADERS.latest_registration]: participant.latest_registration || '',
    [PARTICIPANT_HEADERS.participation_month]: participant.participation_month || '',
    [PARTICIPANT_HEADERS.current_meeting_id]:
      (meetingNameResolver?.(participant.current_meeting_id) ??
        participant.current_meeting_id) || '',
    [PARTICIPANT_HEADERS.notes]: participant.notes || '',
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

export interface ParsedParticipantData extends Partial<Participant> {
  meetingName?: string
}

/**
 * 파일명에서 참여월 추출 (예: 2512.xlsx -> 2512)
 */
function extractParticipationMonthFromFilename(filename: string): string {
  const match = filename.match(/^(\d{4})\.xlsx?$/i)
  return match ? match[1] : ''
}

/**
 * 모임 이름에서 날짜 제거 (예: "대화피디아 12/8" -> "대화피디아")
 */
function extractMeetingName(rawMeetingName: string): string {
  // 날짜 패턴 제거: "12/8", "12/4" 등
  return rawMeetingName.replace(/\s+\d{1,2}\/\d{1,2}$/, '').trim()
}

/**
 * 개월수 파싱 ("신규" -> 1, 숫자는 그대로, "전리더", "부리더" 등은 0)
 */
function parseMonths(value: unknown): number {
  if (value === '신규' || value === '신규') {
    return 1
  }

  const num = Number(value)
  if (!isNaN(num) && num > 0) {
    return num
  }

  // "전리더", "부리더" 등의 특수 케이스는 0으로
  return 0
}

/**
 * 회비 파싱 ("면제" -> 0, 숫자는 그대로, 음수도 허용)
 */
function parseFee(value: unknown): number {
  if (value === '면제') {
    return 0
  }

  const num = Number(value)
  if (!isNaN(num)) {
    // 음수도 그대로 허용 (부분환불 등의 케이스)
    return num
  }

  return 0
}

/**
 * 성별 파싱 ("남" -> "male", "여" -> "female")
 */
function parseGender(value: unknown): 'male' | 'female' {
  const str = String(value || '').trim()
  return str === '남' || str === '남성' ? 'male' : 'female'
}

/**
 * YYMM 형식을 YYYY-MM 형식으로 변환 (예: 2512 -> 2025-12)
 */
function convertYYMMtoYYYYMM(yymm: string): string {
  // 빈 문자열이거나 null이면 빈 문자열 반환
  if (!yymm) return ''

  // 숫자로 변환 (문자열에 숫자만 추출)
  const numStr = String(yymm).replace(/\D/g, '')

  // 4자리 숫자가 아니면 빈 문자열 반환
  if (numStr.length !== 4) return ''

  const yy = parseInt(numStr.substring(0, 2), 10)
  const mm = numStr.substring(2, 4)

  // 월이 1-12 범위가 아니면 빈 문자열 반환
  const monthNum = parseInt(mm, 10)
  if (monthNum < 1 || monthNum > 12) return ''

  // 25는 2025년, 24는 2024년 등 (20XX로 가정)
  const yyyy = 2000 + yy

  return `${yyyy}-${mm}`
}

/**
 * 재등록 여부 파싱 ("V" -> true, null/undefined -> false)
 */
function parseReRegistration(value: unknown): boolean {
  return value === 'V' || value === 'v'
}

/**
 * Excel 파일에서 참여자 데이터 가져오기
 *
 * @param file - 업로드된 Excel 파일
 * @returns 파싱된 참여자 데이터 배열 (모임 이름 포함)
 */
export async function importParticipantsFromExcel(
  file: File
): Promise<ParsedParticipantData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        // 파일명에서 참여월 추출
        const participationMonth = extractParticipationMonthFromFilename(file.name)

        // 첫 번째 시트 가져오기
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // 시트를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null }) as Record<
          string,
          unknown
        >[]

        const participants: ParsedParticipantData[] = []
        let currentMeetingName = ''

        for (const row of jsonData) {
          // 모임 이름 행인지 확인 (모임 컬럼에 "#숫자"로 시작하는 값이 있고, 모임 이름이 있음)
          const noValue = String(row['No'] || '')
          const meetingValue = String(row['모임'] || '')

          if (noValue.startsWith('#') && meetingValue) {
            // 모임 이름 추출 (날짜 제거)
            currentMeetingName = extractMeetingName(meetingValue)
            continue
          }

          // 헤더 행이나 빈 행 스킵
          if (
            !row['이름'] ||
            row['이름'] === '이름' ||
            typeof row['이름'] !== 'string' ||
            !row['전화번호']
          ) {
            continue
          }

          // 참여자 데이터 파싱
          const firstRegMonth = convertYYMMtoYYYYMM(String(row['첫 등록월'] || ''))
          const latestRegValue = row['최등록'] ? String(row['최등록']) : participationMonth
          const latestReg = convertYYMMtoYYYYMM(latestRegValue)

          // latest_registration이 빈 문자열이면 participation_month를 YYYY-MM 형식으로 변환
          const finalLatestReg =
            latestReg || convertYYMMtoYYYYMM(participationMonth)

          // first_registration_month도 빈 문자열이면 latest_registration과 같게
          const finalFirstRegMonth = firstRegMonth || finalLatestReg

          // 나이는 출생 년도 (YY 형식: 96 -> 1996, 03 -> 2003)
          const birthYearYY = Number(row['나이']) || 0
          // 50 이상이면 19XX년생, 50 미만이면 20XX년생으로 가정
          const birthYear = birthYearYY >= 50 ? 1900 + birthYearYY : 2000 + birthYearYY

          const participant: ParsedParticipantData = {
            name: String(row['이름']).trim(),
            gender: parseGender(row['성별']),
            age: birthYear,
            phone: String(row['전화번호'] || '').trim(),
            months: parseMonths(row['개월수']),
            first_registration_month: finalFirstRegMonth,
            fee: parseFee(row['회비']),
            re_registration: parseReRegistration(row['재등록']),
            latest_registration: finalLatestReg,
            participation_month: participationMonth,
            notes: row['비고'] ? String(row['비고']).trim() : null,
            meetingName: currentMeetingName,
          }

          participants.push(participant)
        }

        resolve(participants)
      } catch (error) {
        reject(new Error('Excel 파일 파싱 실패: ' + (error as Error).message))
      }
    }

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'))
    }

    reader.readAsBinaryString(file)
  })
}
