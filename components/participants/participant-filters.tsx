'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  paginationAtom,
  participantFiltersAtom,
  resetFiltersAtom,
} from '@/lib/store/participant'
import { MeetingService, type MeetingOption } from '@/lib/services/meeting'
import type { ParticipantFilters } from '@/lib/services/participant'
import { cn } from '@/lib/utils'
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
import { Slider } from '@/components/ui/slider'
import { Search, X } from 'lucide-react'

interface ParticipantFiltersProps {
  onSearch?: () => void
}

type GenderFilter = 'all' | 'male' | 'female'
type RangeValue = [number, number]

interface RangeLimits {
  min: number
  max: number
}

interface FilterState {
  name: string
  phone: string
  ageRange: RangeValue
  feeRange: RangeValue
  monthsRange: RangeValue
  first_registration_month: string
  latest_registration: string
  gender: GenderFilter
  current_meeting_id: string
}

const AGE_LIMITS: RangeLimits = { min: 15, max: 55 }
const FEE_LIMITS: RangeLimits = { min: 0, max: 200_000 }
const MONTHS_LIMITS: RangeLimits = { min: 0, max: 50 }

const formatNumber = (value: number) => value.toLocaleString()

const clampRange = (value: number[], limits: RangeLimits): RangeValue => {
  const [start = limits.min, end = limits.max] = value
  const clampedStart = Math.min(Math.max(start, limits.min), limits.max)
  const clampedEnd = Math.min(Math.max(end, clampedStart), limits.max)
  return [clampedStart, clampedEnd]
}

const isFullRange = (value: RangeValue, limits: RangeLimits) =>
  value[0] === limits.min && value[1] === limits.max

const buildLocalFilters = (filters: ParticipantFilters): FilterState => ({
  name: filters.name || '',
  phone: filters.phone || '',
  ageRange: [
    filters.age_min ?? AGE_LIMITS.min,
    filters.age_max ?? AGE_LIMITS.max,
  ],
  feeRange: [
    filters.fee_min ?? FEE_LIMITS.min,
    filters.fee_max ?? FEE_LIMITS.max,
  ],
  monthsRange: [
    filters.months_min ?? MONTHS_LIMITS.min,
    filters.months_max ?? MONTHS_LIMITS.max,
  ],
  first_registration_month: filters.first_registration_month || '',
  latest_registration: filters.latest_registration || '',
  gender: filters.gender ?? 'all',
  current_meeting_id: filters.current_meeting_id || 'all',
})

interface RangeFieldProps {
  label: string
  limits: RangeLimits
  value: RangeValue
  onChange: (value: RangeValue) => void
  step?: number
  formatter?: (value: number) => string
  className?: string
}

function RangeField({
  label,
  limits,
  value,
  onChange,
  step = 1,
  formatter = formatNumber,
  className,
}: RangeFieldProps) {
  return (
    <div className={cn('space-y-3 sm:col-span-2 max-w-xl', className)}>
      <div className="flex items-center justify-between text-sm">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {formatter(value[0])} ~ {formatter(value[1])}
        </span>
      </div>
      <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-3">
        <Slider
          value={value}
          min={limits.min}
          max={limits.max}
          step={step}
          onValueChange={(next) => onChange(clampRange(next, limits))}
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{formatter(limits.min)}</span>
          <span>{formatter(limits.max)}</span>
        </div>
      </div>
    </div>
  )
}

export function ParticipantFilters({ onSearch }: ParticipantFiltersProps) {
  const [filters, setFilters] = useAtom(participantFiltersAtom)
  const [, resetFilters] = useAtom(resetFiltersAtom)
  const [, setPagination] = useAtom(paginationAtom)
  const [meetings, setMeetings] = useState<MeetingOption[]>([])
  const [meetingsLoading, setMeetingsLoading] = useState(false)
  const [meetingsError, setMeetingsError] = useState<string | null>(null)

  const [localFilters, setLocalFilters] = useState<FilterState>(() =>
    buildLocalFilters(filters)
  )

  const buildFilters = (): ParticipantFilters => {
    const nextFilters: ParticipantFilters = {
      name: localFilters.name || undefined,
      phone: localFilters.phone || undefined,
      first_registration_month:
        localFilters.first_registration_month || undefined,
      latest_registration: localFilters.latest_registration || undefined,
      gender:
        localFilters.gender === 'all'
          ? undefined
          : (localFilters.gender as 'male' | 'female'),
      current_meeting_id:
        localFilters.current_meeting_id === 'all'
          ? undefined
          : localFilters.current_meeting_id,
    }

    if (!isFullRange(localFilters.ageRange, AGE_LIMITS)) {
      nextFilters.age_min = localFilters.ageRange[0]
      nextFilters.age_max = localFilters.ageRange[1]
    }
    if (!isFullRange(localFilters.feeRange, FEE_LIMITS)) {
      nextFilters.fee_min = localFilters.feeRange[0]
      nextFilters.fee_max = localFilters.feeRange[1]
    }
    if (!isFullRange(localFilters.monthsRange, MONTHS_LIMITS)) {
      nextFilters.months_min = localFilters.monthsRange[0]
      nextFilters.months_max = localFilters.monthsRange[1]
    }

    return nextFilters
  }

  const handleNameChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, name: value }))
  }

  const handlePhoneChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, phone: value }))
  }

  const handleGenderChange = (value: GenderFilter) => {
    setLocalFilters((prev) => ({ ...prev, gender: value }))
  }

  const handleCurrentMeetingChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, current_meeting_id: value }))
  }

  const handleFirstRegistrationMonthChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, first_registration_month: value }))
  }

  const handleLatestRegistrationChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, latest_registration: value }))
  }

  const handleAgeRangeChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      ageRange: clampRange(value, AGE_LIMITS),
    }))
  }

  const handleFeeRangeChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      feeRange: clampRange(value, FEE_LIMITS),
    }))
  }

  const handleMonthsRangeChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      monthsRange: clampRange(value, MONTHS_LIMITS),
    }))
  }

  const handleSearch = () => {
    const nextFilters = buildFilters()
    setFilters(nextFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
    onSearch?.()
  }

  const handleReset = () => {
    setLocalFilters(buildLocalFilters({}))
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          검색 및 필터
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
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
            <Label>성별</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: '전체' },
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={
                    localFilters.gender === option.value ? 'default' : 'outline'
                  }
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleGenderChange(option.value as GenderFilter)}
                  aria-pressed={localFilters.gender === option.value}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Meeting */}
          <div className="space-y-2">
            <Label htmlFor="current_meeting_id">참여 모임</Label>
            <Select
              value={localFilters.current_meeting_id}
              onValueChange={handleCurrentMeetingChange}
              disabled={meetingsLoading}
            >
              <SelectTrigger id="current_meeting_id" className="w-full">
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
          <div className="space-y-2 max-w-[12rem]">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              placeholder="전화번호 검색"
              value={localFilters.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
          </div>

          {/* Age Range */}
          <RangeField
            label="나이 범위"
            limits={AGE_LIMITS}
            value={localFilters.ageRange}
            onChange={handleAgeRangeChange}
            className="lg:col-span-2"
          />

          {/* Fee Range */}
          <RangeField
            label="회비 범위"
            limits={FEE_LIMITS}
            value={localFilters.feeRange}
            onChange={handleFeeRangeChange}
            step={1000}
            formatter={(value) => `${formatNumber(value)}원`}
            className="lg:col-span-2"
          />

          {/* Months Range */}
          <RangeField
            label="개월수 범위"
            limits={MONTHS_LIMITS}
            value={localFilters.monthsRange}
            onChange={handleMonthsRangeChange}
            className="lg:col-span-2"
          />

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
        </div>

        <div className="flex flex-col gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            조건을 입력하고 <span className="font-semibold text-foreground">조회하기</span>를 눌러 검색하세요.
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
