import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'jotai'
import { ParticipantFilters } from './participant-filters'

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

  it('should call onFilterChange when name input changes', async () => {
    const mockOnFilterChange = vi.fn()

    render(
      <Provider>
        <ParticipantFilters onFilterChange={mockOnFilterChange} />
      </Provider>
    )

    const nameInput = screen.getByPlaceholderText('이름 검색') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: '홍길동' } })

    expect(nameInput.value).toBe('홍길동')
  })

  it('should have age range inputs', () => {
    render(
      <Provider>
        <ParticipantFilters />
      </Provider>
    )

    expect(screen.getByText('나이 범위')).toBeDefined()
    const minMaxInputs = screen.getAllByPlaceholderText(/최소|최대/)
    expect(minMaxInputs.length).toBeGreaterThanOrEqual(2)
  })

  it('should have fee range inputs', () => {
    render(
      <Provider>
        <ParticipantFilters />
      </Provider>
    )

    const feeInputs = screen.getAllByPlaceholderText(/최소|최대/)
    expect(feeInputs.length).toBeGreaterThanOrEqual(4) // age min/max + fee min/max
  })
})
