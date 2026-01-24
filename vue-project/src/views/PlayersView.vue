<template>
  <div class="players-container">
    <div class="header-actions">
      <h1>My Squad</h1>
      <RouterLink to="/players/create" class="add-btn">
        <span class="icon">+</span> Add New Player
      </RouterLink>
    </div>

    <div v-if="playerStore.isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Scouting players...</p>
    </div>
    
    <div v-else-if="playerStore.error" class="error-state">
      <p>Error: {{ playerStore.error }}</p>
      <button @click="playerStore.fetchPlayers()" class="retry-btn">Retry</button>
    </div>

    <div v-else class="table-responsive">
      <table class="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Age</th>
            <th>Team</th>
            <th class="text-center">Matches</th>
            <th class="text-center">Goals/Assists</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in playerStore.players" :key="player.id">
            <td class="player-name">
              <strong>{{ player.name }}</strong>
            </td>
            <td>
              <span :class="['badge', getPositionClass(player.position)]">
                {{ player.position }}
              </span>
            </td>
            <td>{{ player.age }}</td>
            <td>{{ player.team }}</td>
            
            <td class="text-center">{{ player.stats?.matchesPlayed || 0 }}</td>
            <td class="text-center">
              {{ player.stats?.goalsScored || 0 }} / {{ player.stats?.assists || 0 }}
            </td>
            
            <td class="actions-cell">
              <RouterLink :to="`/players/${player.id}`" class="view-btn">
                View
              </RouterLink>

              <button 
                v-if="player.createdBy === authStore.user?.id"
                @click="handleDelete(player.id)" 
                class="delete-btn"
                title="Delete Player"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="playerStore.players.length === 0" class="empty-state">
        <h3>No players found</h3>
        <p>Your squad is empty. Start building your dream team!</p>
        <RouterLink to="/players/create" class="add-btn-large">Create First Player</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePlayerStore } from '@/stores/players'
import { useAuthStore } from '@/stores/auth'

const playerStore = usePlayerStore()
const authStore = useAuthStore()

onMounted(() => {
  playerStore.fetchPlayers()
})

async function handleDelete(id) {
  if (confirm("Are you sure you want to release this player? This action cannot be undone.")) {
    await playerStore.deletePlayer(id)
  }
}

function getPositionClass(position) {
  if (!position) return ''
  if (position.includes('Goalkeeper')) return 'pos-gk'
  if (position.includes('Defender') || position.includes('Back')) return 'pos-def'
  if (position.includes('Midfielder')) return 'pos-mid'
  if (position.includes('Striker') || position.includes('Winger')) return 'pos-att'
  return ''
}
</script>

<style scoped>
.players-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
h1 { color: #2c3e50; font-size: 2rem; margin: 0; }

/* Buttons */
.add-btn { background: #42b983; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.add-btn:hover { background: #3aa876; transform: translateY(-1px); }
.add-btn .icon { font-size: 1.2rem; font-weight: bold; }

/* Table Styling */
.table-responsive { overflow-x: auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.players-table { width: 100%; border-collapse: collapse; min-width: 800px; }
th, td { padding: 16px; text-align: left; border-bottom: 1px solid #edf2f7; }
th { background-color: #f8fafc; color: #64748b; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
tr:last-child td { border-bottom: none; }
tr:hover { background-color: #f8fafc; }

.player-name { color: #2c3e50; font-size: 1.05rem; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Badges for Positions */
.badge { padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
.pos-gk { background: #fff3cd; color: #856404; } 
.pos-def { background: #d1ecf1; color: #0c5460; } 
.pos-mid { background: #d4edda; color: #155724; }
.pos-att { background: #f8d7da; color: #721c24; }

/* Action Buttons */
.actions-cell { display: flex; justify-content: flex-end; gap: 10px; }
.view-btn { background: #edf2f7; color: #2d3748; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: background 0.2s; }
.view-btn:hover { background: #e2e8f0; }
.delete-btn { background: #fee2e2; color: #ef4444; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: background 0.2s; }
.delete-btn:hover { background: #fecaca; }

/* States */
.loading-state, .error-state, .empty-state { text-align: center; padding: 4rem 2rem; color: #718096; }
.retry-btn { margin-top: 1rem; padding: 8px 16px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; }
.add-btn-large { display: inline-block; margin-top: 1.5rem; background: #42b983; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }

/* Simple CSS Spinner */
.spinner { border: 3px solid #f3f3f3; border-top: 3px solid #42b983; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>