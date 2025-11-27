'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  paginationAtom,
  participantFiltersAtom,
  resetFiltersAtom,
} from '@/lib/store/participant'
import { MeetingService, type MeetingOption } from '@/lib/services/meeting'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, X } from 'lucide-react'

interface ParticipantFiltersProps {
  onSearch?: () => void
}

export function ParticipantFilters({ onSearch }: ParticipantFiltersProps) {
  const [filters, setFilters] = useAtom(participantFiltersAtom)
  const [, resetFilters] = useAtom(resetFiltersAtom)
  const [, setPagination] = useAtom(paginationAtom)
  const [meetings, setMeetings] = useState<MeetingOption[]>([])
  const [meetingsLoading, setMeetingsLoading] = useState(false)
  const [meetingsError, setMeetingsError] = useState<string | null>(null)

  const [localFilters, setLocalFilters] = useState({
    name: filters.name || '',
    phone: filters.phone || '',
    age_min: filters.age_min?.toString() || '',
    age_max: filters.age_max?.toString() || '',
    fee_min: filters.fee_min?.toString() || '',
    fee_max: filters.fee_max?.toString() || '',
    months_min: filters.months_min?.toString() || '',
    months_max: filters.months_max?.toString() || '',
    first_registration_month: filters.first_registration_month || '',
    latest_registration: filters.latest_registration || '',
    gender: filters.gender || 'all',
    current_meeting_id: filters.current_meeting_id || 'all',
    re_registration:
      filters.re_registration === undefined
        ? 'all'
        : filters.re_registration
          ? 'true'
          : 'false',
  })

  const parseNumber = (value: string) => {
    const numValue = parseInt(value, 10)
    return Number.isNaN(numValue) ? undefined : numValue
  }

  const buildFilters = () => ({
    name: localFilters.name || undefined,
    phone: localFilters.phone || undefined,
    age_min: parseNumber(localFilters.age_min),
    age_max: parseNumber(localFilters.age_max),
    fee_min: parseNumber(localFilters.fee_min),
    fee_max: parseNumber(localFilters.fee_max),
    months_min: parseNumber(localFilters.months_min),
    months_max: parseNumber(localFilters.months_max),
    first_registration_month: localFilters.first_registration_month || undefined,
    latest_registration: localFilters.latest_registration || undefined,
    gender:
      localFilters.gender === 'all'
        ? undefined
        : (localFilters.gender as 'male' | 'female'),
    current_meeting_id:
      localFilters.current_meeting_id === 'all'
        ? undefined
        : localFilters.current_meeting_id,
    re_registration:
      localFilters.re_registration === 'all'
        ? undefined
        : localFilters.re_registration === 'true',
  })

  const handleNameChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, name: value }))
  }

  const handlePhoneChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, phone: value }))
  }

  const handleGenderChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, gender: value }))
  }

  const handleCurrentMeetingChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, current_meeting_id: value }))
  }

  const handleAgeMinChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, age_min: value }))
  }

  const handleAgeMaxChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, age_max: value }))
  }

  const handleFeeMinChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, fee_min: value }))
  }

  const handleFeeMaxChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, fee_max: value }))
  }

  const handleMonthsMinChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, months_min: value }))
  }

  const handleMonthsMaxChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, months_max: value }))
  }

  const handleFirstRegistrationMonthChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, first_registration_month: value }))
  }

  const handleLatestRegistrationChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, latest_registration: value }))
  }

  const handleReRegistrationChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, re_registration: value }))
  }

  const handleSearch = () => {
    const nextFilters = buildFilters()
    setFilters(nextFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
    onSearch?.()
  }

  const handleReset = () => {
    setLocalFilters({
      name: '',
      phone: '',
      age_min: '',
      age_max: '',
      fee_min: '',
      fee_max: '',
      months_min: '',
      months_max: '',
      first_registration_month: '',
      latest_registration: '',
      gender: 'all',
      current_meeting_id: 'all',
      re_registration: 'all',
    })
    resetFilters()
    setPagination((prev) => ({ ...prev, page: 1 }))
    onSearch?.()
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      setMeetingsLoading(true)
      setMeetingsError(null)
      try {
        const service = new MeetingService()
        const options = await service.listNames()
        setMeetings(options)
      } catch (error) {
        console.error(error)
        setMeetingsError('모임 목록을 불러오지 못했습니다.')
      } finally {
        setMeetingsLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          검색 및 필터
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name Search */}
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="이름 검색"
              value={localFilters.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <Label htmlFor="gender">성별</Label>
            <Select
              value={localFilters.gender}
              onValueChange={handleGenderChange}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="male">남성</SelectItem>
                <SelectItem value="female">여성</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Meeting */}
          <div className="space-y-2">
            <Label htmlFor="current_meeting_id">참여 모임</Label>
            <Select
              value={localFilters.current_meeting_id}
              onValueChange={handleCurrentMeetingChange}
              disabled={meetingsLoading}
            >
              <SelectTrigger id="current_meeting_id">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {meetings.map((meeting) => (
                  <SelectItem key={meeting.id} value={meeting.id}>
                    {meeting.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {meetingsError && (
              <p className="text-xs text-red-600">{meetingsError}</p>
            )}
          </div>

          {/* Phone Search */}
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              placeholder="전화번호 검색"
              value={localFilters.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <Label>나이 범위</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="최소"
                value={localFilters.age_min}
                onChange={(e) => handleAgeMinChange(e.target.value)}
              />
              <Input
                type="number"
                placeholder="최대"
                value={localFilters.age_max}
                onChange={(e) => handleAgeMaxChange(e.target.value)}
              />
            </div>
          </div>

          {/* Fee Range */}
          <div className="space-y-2">
            <Label>회비 범위</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="최소"
                value={localFilters.fee_min}
                onChange={(e) => handleFeeMinChange(e.target.value)}
              />
              <Input
                type="number"
                placeholder="최대"
                value={localFilters.fee_max}
                onChange={(e) => handleFeeMaxChange(e.target.value)}
              />
            </div>
          </div>

          {/* Months Range */}
          <div className="space-y-2">
            <Label>개월수 범위</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="최소"
                value={localFilters.months_min}
                onChange={(e) => handleMonthsMinChange(e.target.value)}
              />
              <Input
                type="number"
                placeholder="최대"
                value={localFilters.months_max}
                onChange={(e) => handleMonthsMaxChange(e.target.value)}
              />
            </div>
          </div>

          {/* First Registration Month */}
          <div className="space-y-2">
            <Label htmlFor="first_registration_month">첫 등록월</Label>
            <Input
              id="first_registration_month"
              type="month"
              value={localFilters.first_registration_month}
              onChange={(e) => handleFirstRegistrationMonthChange(e.target.value)}
            />
          </div>

          {/* Latest Registration */}
          <div className="space-y-2">
            <Label htmlFor="latest_registration">최근 등록월</Label>
            <Input
              id="latest_registration"
              type="month"
              value={localFilters.latest_registration}
              onChange={(e) => handleLatestRegistrationChange(e.target.value)}
            />
          </div>

          {/* Re-registration Filter */}
          <div className="space-y-2">
            <Label htmlFor="re_registration">재등록 여부</Label>
            <Select
              value={localFilters.re_registration}
              onValueChange={handleReRegistrationChange}
            >
              <SelectTrigger id="re_registration">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="true">재등록</SelectItem>
                <SelectItem value="false">신규</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">
            조건을 모두 입력한 뒤 <span className="font-semibold text-stone-700">조회하기</span>를 누르면 검색합니다.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              <X className="mr-2 h-4 w-4" />
              필터 초기화
            </Button>
            <Button onClick={handleSearch}>조회하기</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
