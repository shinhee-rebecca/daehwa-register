import { atom } from 'jotai'
import type { ParticipantFilters, PaginationParams } from '../services/participant'

// Participant filter state
export const participantFiltersAtom = atom<ParticipantFilters>({})

// Pagination state
export const paginationAtom = atom<PaginationParams>({
  page: 1,
  limit: 15,
})

// Reset filters action
export const resetFiltersAtom = atom(null, (get, set) => {
  set(participantFiltersAtom, {})
  set(paginationAtom, { page: 1, limit: 15 })
})
