import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/utils/constants'
import { useAuthStore } from './auth'

export const usePlayerStore = defineStore('players', () => {
  const players = ref([])
  const isLoading = ref(false)
  const error = ref(null)

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
    fetchPlayers,
    fetchPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
})