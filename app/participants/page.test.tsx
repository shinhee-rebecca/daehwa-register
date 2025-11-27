import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import { authInitializedAtom, userAtom } from '@/lib/store/auth'
import ParticipantsPage from './page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/participants',
}))

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
      current_meeting_id: 'meeting-1',
      notes: '테스트 노트',
      past_meetings: [],
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
const mockListMeetings = vi.fn().mockResolvedValue([
  { id: 'meeting-1', name: '독서 모임 A' },
])

vi.mock('@/lib/services/participant', () => ({
  ParticipantService: class {
    search = mockSearch
    delete = mockDelete
  },
}))

vi.mock('@/lib/services/meeting', () => ({
  MeetingService: class {
    listNames = mockListMeetings
  },
}))

const buildStore = () => {
  const store = createStore()
  store.set(authInitializedAtom, true)
  store.set(userAtom, {
    id: 'admin-1',
    email: 'admin@example.com',
    role: 'admin' as const,
  })
  return store
}

const renderWithProvider = () =>
  render(
    <Provider store={buildStore()}>
      <ParticipantsPage />
    </Provider>
  )

describe('ParticipantsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render participants list page title', async () => {
    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByText('참여자 관리')).toBeDefined()
    })
  })

  it('should display participant data in table', async () => {
    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeDefined()
      expect(screen.getByText('010-1234-5678')).toBeDefined()
      expect(screen.getByText('독서 모임 A')).toBeDefined()
    })
  })

  it('should have add participant button', async () => {
    renderWithProvider()

    await waitFor(() => {
      const addButton = screen.getByText('참여자 추가')
      expect(addButton).toBeDefined()
    })
  })

  it('should show pagination controls when total pages exist', async () => {
    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByText('페이지 1 / 2')).toBeDefined()
      expect(screen.getByText('2')).toBeDefined()
    })
  })

  it('should open delete dialog and call delete handler', async () => {
    renderWithProvider()

    const deleteButton = await screen.findByText('삭제')
    fireEvent.click(deleteButton)

    const confirmButton = await screen.findAllByText('삭제')
    fireEvent.click(confirmButton[confirmButton.length - 1])

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('1')
    })
  })

  it('should request sorting when clicking sortable header', async () => {
    renderWithProvider()

    const nameHeader = await screen.findByRole('button', { name: /이름/ })
    fireEvent.click(nameHeader)

    await waitFor(() => {
      const lastCall = mockSearch.mock.calls[mockSearch.mock.calls.length - 1]
      expect(lastCall[2]).toMatchObject({ column: 'name' })
    })
  })
})
