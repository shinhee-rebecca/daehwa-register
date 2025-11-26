import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'jotai'
import { ParticipantForm } from './participant-form'

describe('ParticipantForm', () => {
  it('should render all required form fields', () => {
    render(
      <Provider>
        <ParticipantForm onSuccess={() => {}} onCancel={() => {}} />
      </Provider>
    )

    expect(screen.getByLabelText(/이름/)).toBeDefined()
    expect(screen.getByLabelText(/성별/)).toBeDefined()
    expect(screen.getByLabelText(/나이/)).toBeDefined()
    expect(screen.getByLabelText(/전화번호/)).toBeDefined()
    expect(screen.getByLabelText(/개월수/)).toBeDefined()
    expect(screen.getByLabelText(/회비/)).toBeDefined()
  })

  it('should have submit and cancel buttons', () => {
    render(
      <Provider>
        <ParticipantForm onSuccess={() => {}} onCancel={() => {}} />
      </Provider>
    )

    expect(screen.getByText('저장')).toBeDefined()
    expect(screen.getByText('취소')).toBeDefined()
  })

  it('should call onCancel when cancel button is clicked', () => {
    const mockOnCancel = vi.fn()

    render(
      <Provider>
        <ParticipantForm onSuccess={() => {}} onCancel={mockOnCancel} />
      </Provider>
    )

    const cancelButton = screen.getByText('취소')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should show validation errors for empty required fields', async () => {
    render(
      <Provider>
        <ParticipantForm onSuccess={() => {}} onCancel={() => {}} />
      </Provider>
    )

    const submitButton = screen.getByText('저장')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/이름은 필수입니다/)).toBeDefined()
    })
  })

  it('should populate form fields in edit mode', () => {
    const participant = {
      id: '1',
      name: '홍길동',
      gender: 'male' as const,
      age: 25,
      phone: '010-1234-5678',
      months: 3,
      first_registration_month: '2024-01',
      fee: 50000,
      re_registration: false,
      latest_registration: '2024-03',
      current_meeting_id: null,
      notes: '테스트',
      past_meetings: [],
    }

    render(
      <Provider>
        <ParticipantForm
          participant={participant}
          onSuccess={() => {}}
          onCancel={() => {}}
        />
      </Provider>
    )

    const nameInput = screen.getByLabelText(/이름/) as HTMLInputElement
    expect(nameInput.value).toBe('홍길동')
  })
})
