import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'jotai'
import { ParticipantFilters } from './participant-filters'

vi.mock('@/lib/services/meeting', () => ({
  MeetingService: class {
    listNames = vi.fn().mockResolvedValue([])
  },
}))

describe('ParticipantFilters', () => {
  it('should render all filter inputs', () => {
    render(
      <Provider>
        <ParticipantFilters />
      </Provider>
    )

    expect(screen.getByPlaceholderText('이름 검색')).toBeDefined()
    expect(screen.getByText('성별')).toBeDefined()
    expect(screen.getByPlaceholderText('전화번호 검색')).toBeDefined()
  })

  it('should have a clear filters button', () => {
    render(
      <Provider>
        <ParticipantFilters />
      </Provider>
    )

    const clearButton = screen.getByText('필터 초기화')
    expect(clearButton).toBeDefined()
  })

  it('should call onSearch when clicking search button', async () => {
    const mockOnSearch = vi.fn()

    render(
      <Provider>
        <ParticipantFilters onSearch={mockOnSearch} />
      </Provider>
    )

    const searchButton = screen.getByRole('button', { name: '조회하기' })
    fireEvent.click(searchButton)

    expect(mockOnSearch).toHaveBeenCalled()
  })

  it('should render slider controls for ranges', () => {
    render(
      <Provider>
        <ParticipantFilters />
      </Provider>
    )

    expect(screen.getByText('나이 범위')).toBeDefined()
    expect(screen.getByText('회비 범위')).toBeDefined()
    expect(screen.getByText('개월수 범위')).toBeDefined()

    const sliders = screen.getAllByRole('slider')
    expect(sliders.length).toBeGreaterThanOrEqual(6)
  })

  it('should not show re-registration filter', () => {
    render(
      <Provider>
        <ParticipantFilters />
      </Provider>
    )

    expect(screen.queryByText('재등록 여부')).toBeNull()
  })
})
