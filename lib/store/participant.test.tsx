import { describe, it, expect } from 'vitest'
import { useAtom, Provider } from 'jotai'
import { renderHook, act } from '@testing-library/react'
import { participantFiltersAtom, paginationAtom, resetFiltersAtom } from './participant'
import { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
)

describe('Participant Store Atoms', () => {
  describe('participantFiltersAtom', () => {
    it('should initialize with empty filters', () => {
      const { result } = renderHook(() => useAtom(participantFiltersAtom), { wrapper })
      expect(result.current[0]).toEqual({})
    })

    it('should update filter values', () => {
      const { result } = renderHook(() => useAtom(participantFiltersAtom), { wrapper })

      act(() => {
        result.current[1]({
          gender: 'male',
          age_min: 20,
          age_max: 30,
          name: '홍길동',
        })
      })

      expect(result.current[0]).toEqual({
        gender: 'male',
        age_min: 20,
        age_max: 30,
        name: '홍길동',
      })
    })

    it('should partially update filters', () => {
      const { result } = renderHook(() => useAtom(participantFiltersAtom), { wrapper })

      act(() => {
        result.current[1]({ gender: 'female' })
      })

      act(() => {
        result.current[1]((prev) => ({ ...prev, name: '김영희' }))
      })

      expect(result.current[0]).toEqual({
        gender: 'female',
        name: '김영희',
      })
    })
  })

  describe('paginationAtom', () => {
    it('should initialize with default pagination', () => {
      const { result } = renderHook(() => useAtom(paginationAtom), { wrapper })
      expect(result.current[0]).toEqual({
        page: 1,
        limit: 15,
      })
    })

    it('should update page number', () => {
      const { result } = renderHook(() => useAtom(paginationAtom), { wrapper })

      act(() => {
        result.current[1]({ page: 2, limit: 15 })
      })

      expect(result.current[0].page).toBe(2)
    })

    it('should update limit', () => {
      const { result } = renderHook(() => useAtom(paginationAtom), { wrapper })

      act(() => {
        result.current[1]({ page: 1, limit: 30 })
      })

      expect(result.current[0].limit).toBe(30)
    })
  })

  describe('resetFiltersAtom', () => {
    it('should reset filters and pagination', () => {
      const { result } = renderHook(
        () => ({
          filters: useAtom(participantFiltersAtom),
          pagination: useAtom(paginationAtom),
          reset: useAtom(resetFiltersAtom),
        }),
        { wrapper }
      )

      // Set some filters and pagination
      act(() => {
        result.current.filters[1]({ gender: 'male', name: '테스트' })
        result.current.pagination[1]({ page: 3, limit: 30 })
      })

      // Reset
      act(() => {
        result.current.reset[1]()
      })

      expect(result.current.filters[0]).toEqual({})
      expect(result.current.pagination[0]).toEqual({ page: 1, limit: 15 })
    })
  })
})
