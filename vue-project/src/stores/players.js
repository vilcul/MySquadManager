import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/utils/constants'
import { useAuthStore } from './auth'

export const usePlayerStore = defineStore('players', () => {
  const players = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Search & Filter State
  const searchQuery = ref('')
  const filterPosition = ref('')
  const filterTeam = ref('')
  const sortBy = ref('name')
  const sortOrder = ref('asc')

  // Get unique positions from players
  const availablePositions = computed(() => {
    const positions = [...new Set(players.value.map(p => p.position).filter(Boolean))]
    return positions.sort()
  })

  // Get unique teams from players
  const availableTeams = computed(() => {
    const teams = [...new Set(players.value.map(p => p.team).filter(Boolean))]
    return teams.sort()
  })

  // Filtered and sorted players
  const filteredPlayers = computed(() => {
    let result = [...players.value]

    // Apply search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter(player => 
        player.name?.toLowerCase().includes(query) ||
        player.team?.toLowerCase().includes(query) ||
        player.position?.toLowerCase().includes(query)
      )
    }

    // Apply position filter
    if (filterPosition.value) {
      result = result.filter(player => player.position === filterPosition.value)
    }

    // Apply team filter
    if (filterTeam.value) {
      result = result.filter(player => player.team === filterTeam.value)
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB

      switch (sortBy.value) {
        case 'name':
          valueA = a.name?.toLowerCase() || ''
          valueB = b.name?.toLowerCase() || ''
          break
        case 'age':
          valueA = a.age || 0
          valueB = b.age || 0
          break
        case 'goals':
          valueA = a.stats?.goalsScored || 0
          valueB = b.stats?.goalsScored || 0
          break
        case 'matches':
          valueA = a.stats?.matchesPlayed || 0
          valueB = b.stats?.matchesPlayed || 0
          break
        default:
          valueA = a.name?.toLowerCase() || ''
          valueB = b.name?.toLowerCase() || ''
      }

      if (sortOrder.value === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
      }
    })

    return result
  })

  // Reset all filters
  function resetFilters() {
    searchQuery.value = ''
    filterPosition.value = ''
    filterTeam.value = ''
    sortBy.value = 'name'
    sortOrder.value = 'asc'
  }

  // 1. FETCH ALL PLAYERS
  async function fetchPlayers() {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`, 
        }
      })
      if (!response.ok) throw new Error('Failed to fetch players.')
      players.value = await response.json()
    } catch (e) {
      error.value = e.message
      players.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 2. FETCH SINGLE PLAYER
  async function fetchPlayer(id) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        headers: {
            'Authorization': `Bearer ${authStore.token}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch player.')
      return await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // 3. CREATE PLAYER
  async function createPlayer(player) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(player),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (data.error && Array.isArray(data.error)) {
             throw new Error(data.error.map(e => e.msg).join(', '))
        }
        throw new Error(data.error || 'Failed to create player.')
      }

      await fetchPlayers()
    } catch (e) {
      error.value = e.message
      throw e 
    } finally {
      isLoading.value = false
    }
  }

  // 4. UPDATE PLAYER
  async function updatePlayer(id, player) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(player),
      })
      
      const data = await response.json()

      if (!response.ok) {
         if (data.error && Array.isArray(data.error)) {
             throw new Error(data.error.map(e => e.msg).join(', '))
        }
        throw new Error(data.error || 'Failed to update player.')
      }

      await fetchPlayers()
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // 5. DELETE PLAYER
  async function deletePlayer(id) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      })
      
      if (!response.ok) {
         const data = await response.json().catch(() => ({}))
         throw new Error(data.error || 'Failed to delete player.')
      }

      await fetchPlayers()
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    players,
    isLoading,
    error,
    // Search & Filter
    searchQuery,
    filterPosition,
    filterTeam,
    sortBy,
    sortOrder,
    availablePositions,
    availableTeams,
    filteredPlayers,
    resetFilters,
    // Actions
    fetchPlayers,
    fetchPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
})