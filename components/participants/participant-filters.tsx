'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { participantFiltersAtom, resetFiltersAtom } from '@/lib/store/participant'
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
  onFilterChange?: () => void
}

export function ParticipantFilters({ onFilterChange }: ParticipantFiltersProps) {
  const [filters, setFilters] = useAtom(participantFiltersAtom)
  const [, resetFilters] = useAtom(resetFiltersAtom)

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
  })

  const handleNameChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, name: value }))
    setFilters((prev) => ({ ...prev, name: value || undefined }))
    onFilterChange?.()
  }

  const handlePhoneChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, phone: value }))
    setFilters((prev) => ({ ...prev, phone: value || undefined }))
    onFilterChange?.()
  }

  const handleGenderChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      gender: value === 'all' ? undefined : (value as 'male' | 'female'),
    }))
    onFilterChange?.()
  }

  const handleAgeMinChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, age_min: value }))
    const numValue = parseInt(value)
    setFilters((prev) => ({
      ...prev,
      age_min: isNaN(numValue) ? undefined : numValue,
    }))
    onFilterChange?.()
  }

  const handleAgeMaxChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, age_max: value }))
    const numValue = parseInt(value)
    setFilters((prev) => ({
      ...prev,
      age_max: isNaN(numValue) ? undefined : numValue,
    }))
    onFilterChange?.()
  }

  const handleFeeMinChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, fee_min: value }))
    const numValue = parseInt(value)
    setFilters((prev) => ({
      ...prev,
      fee_min: isNaN(numValue) ? undefined : numValue,
    }))
    onFilterChange?.()
  }

  const handleFeeMaxChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, fee_max: value }))
    const numValue = parseInt(value)
    setFilters((prev) => ({
      ...prev,
      fee_max: isNaN(numValue) ? undefined : numValue,
    }))
    onFilterChange?.()
  }

  const handleMonthsMinChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, months_min: value }))
    const numValue = parseInt(value)
    setFilters((prev) => ({
      ...prev,
      months_min: isNaN(numValue) ? undefined : numValue,
    }))
    onFilterChange?.()
  }

  const handleMonthsMaxChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, months_max: value }))
    const numValue = parseInt(value)
    setFilters((prev) => ({
      ...prev,
      months_max: isNaN(numValue) ? undefined : numValue,
    }))
    onFilterChange?.()
  }

  const handleFirstRegistrationMonthChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, first_registration_month: value }))
    setFilters((prev) => ({
      ...prev,
      first_registration_month: value || undefined,
    }))
    onFilterChange?.()
  }

  const handleLatestRegistrationChange = (value: string) => {
    setLocalFilters((prev) => ({ ...prev, latest_registration: value }))
    setFilters((prev) => ({
      ...prev,
      latest_registration: value || undefined,
    }))
    onFilterChange?.()
  }

  const handleReRegistrationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      re_registration: value === 'all' ? undefined : value === 'true',
    }))
    onFilterChange?.()
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
    })
    resetFilters()
    onFilterChange?.()
  }

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
              value={filters.gender || 'all'}
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
              value={
                filters.re_registration === undefined
                  ? 'all'
                  : filters.re_registration
                    ? 'true'
                    : 'false'
              }
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

        {/* Clear Button */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            필터 초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
