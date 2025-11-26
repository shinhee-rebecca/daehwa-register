import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'jotai'
import ParticipantsPage from './page'

// Mock the ParticipantService
const mockSearch = vi.fn().mockResolvedValue({
  data: [
    {
      id: '1',
      gender: 'male',
      age: 25,
      name: '홍길동',
      months: 3,
      first_registration_month: '2024-01',
      phone: '010-1234-5678',
      fee: 50000,
      re_registration: false,
      latest_registration: '2024-03',
      current_meeting: '독서 모임 A',
      notes: '테스트 노트',
      past_meetings: '독서 모임 B',
      created_at: '2024-01-01',
      updated_at: '2024-03-01',
    },
  ],
  total: 1,
  page: 1,
  limit: 15,
  totalPages: 2,
})

const mockDelete = vi.fn().mockResolvedValue(undefined)

vi.mock('@/lib/services/participant', () => ({
  ParticipantService: class {
    search = mockSearch
    delete = mockDelete
  },
}))

describe('ParticipantsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render participants list page title', async () => {
    render(
      <Provider>
        <ParticipantsPage />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('참여자 관리')).toBeDefined()
    })
  })

  it('should display participant data in table', async () => {
    render(
      <Provider>
        <ParticipantsPage />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeDefined()
      expect(screen.getByText('010-1234-5678')).toBeDefined()
    })
  })

  it('should have add participant button', async () => {
    render(
      <Provider>
        <ParticipantsPage />
      </Provider>
    )

    await waitFor(() => {
      const addButton = screen.getByText('참여자 추가')
      expect(addButton).toBeDefined()
    })
  })

  it('should show pagination controls when total pages exist', async () => {
    render(
      <Provider>
        <ParticipantsPage />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('페이지 1 / 2')).toBeDefined()
      expect(screen.getByText('2')).toBeDefined()
    })
  })

  it('should open delete dialog and call delete handler', async () => {
    render(
      <Provider>
        <ParticipantsPage />
      </Provider>
    )

    const deleteButton = await screen.findByText('삭제')
    fireEvent.click(deleteButton)

    const confirmButton = await screen.findAllByText('삭제')
    fireEvent.click(confirmButton[confirmButton.length - 1])

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('1')
    })
  })

  it('should request sorting when clicking sortable header', async () => {
    render(
      <Provider>
        <ParticipantsPage />
      </Provider>
    )

    const nameHeader = await screen.findByRole('button', { name: /이름/ })
    fireEvent.click(nameHeader)

    await waitFor(() => {
      const lastCall = mockSearch.mock.calls[mockSearch.mock.calls.length - 1]
      expect(lastCall[2]).toMatchObject({ column: 'name' })
    })
  })
})
