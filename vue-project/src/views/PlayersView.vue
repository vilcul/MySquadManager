<template>
  <div class="players-container">
    <div class="header-actions">
      <h1>My Squad</h1>
      <RouterLink to="/players/create" class="add-btn">
        <span class="icon">+</span> Add New Player
      </RouterLink>
    </div>

    <div class="search-filter-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="playerStore.searchQuery" 
          placeholder="Search by name, team, or position..."
          class="search-input"
        />
      </div>

      <div class="filters-row">
        <div class="filter-group">
          <label>Position</label>
          <select v-model="playerStore.filterPosition" class="filter-select">
            <option value="">All Positions</option>
            <option v-for="pos in playerStore.availablePositions" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Team</label>
          <select v-model="playerStore.filterTeam" class="filter-select">
            <option value="">All Teams</option>
            <option v-for="team in playerStore.availableTeams" :key="team" :value="team">
              {{ team }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Sort By</label>
          <select v-model="playerStore.sortBy" class="filter-select">
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="goals">Goals</option>
            <option value="matches">Matches</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Order</label>
          <select v-model="playerStore.sortOrder" class="filter-select">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button 
          v-if="hasActiveFilters" 
          @click="playerStore.resetFilters()" 
          class="reset-btn"
        >
          ✕ Clear Filters
        </button>
      </div>

      <div class="results-info" v-if="!playerStore.isLoading">
        Showing {{ playerStore.filteredPlayers.length }} of {{ playerStore.players.length }} players
      </div>
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
          <tr v-for="player in playerStore.filteredPlayers" :key="player.id">
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

      <div v-else-if="playerStore.filteredPlayers.length === 0" class="empty-state">
        <h3>No matches found</h3>
        <p>Try adjusting your search or filters.</p>
        <button @click="playerStore.resetFilters()" class="reset-btn-large">Clear All Filters</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/players'
import { useAuthStore } from '@/stores/auth'

const playerStore = usePlayerStore()
const authStore = useAuthStore()

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return playerStore.searchQuery || 
         playerStore.filterPosition || 
         playerStore.filterTeam ||
         playerStore.sortBy !== 'name' ||
         playerStore.sortOrder !== 'asc'
})

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
.players-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 2rem; 
}

.header-actions { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 1.5rem; 
}

h1 { 
  color: #2c3e50; 
  font-size: 2.25rem; 
  margin: 0; 
  font-weight: 700;
}

.search-filter-section { 
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  padding: 1.75rem; 
  border-radius: 16px; 
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.07),
    0 2px 4px -1px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.02);
  margin-bottom: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.search-box { 
  position: relative; 
  margin-bottom: 1.25rem; 
}

.search-input { 
  width: 100%; 
  padding: 14px 18px; 
  border: 2px solid #e2e8f0; 
  border-radius: 12px; 
  font-size: 1rem; 
  transition: all 0.3s ease;
  background: #ffffff;
  color: #2d3748;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}

.search-input:focus { 
  outline: none; 
  border-color: #42b983; 
  box-shadow: 
    0 0 0 4px rgba(66, 185, 131, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.04);
  background: #ffffff;
}

.search-input::placeholder { 
  color: #a0aec0; 
  font-weight: 400;
}

.filters-row { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 1rem; 
  align-items: flex-end;
  padding: 1rem;
  background: rgba(248, 250, 252, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.filter-group { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
  min-width: 160px; 
  flex: 1; 
}

.filter-group label { 
  font-size: 0.75rem; 
  font-weight: 700; 
  color: #64748b; 
  text-transform: uppercase; 
  letter-spacing: 0.08em;
  margin-left: 4px;
}

.filter-select { 
  padding: 11px 14px; 
  border: 2px solid #e2e8f0; 
  border-radius: 10px; 
  font-size: 0.95rem; 
  background: #ffffff;
  color: #2d3748;
  cursor: pointer; 
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.filter-select:hover {
  border-color: #cbd5e0;
  background-color: #fafafa;
}

.filter-select:focus { 
  outline: none; 
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.reset-btn { 
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626; 
  border: 2px solid #fecaca;
  padding: 11px 18px; 
  border-radius: 10px; 
  font-size: 0.9rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.25s ease;
  white-space: nowrap; 
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 6px;
}

.reset-btn:hover { 
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #fca5a5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.reset-btn-large { 
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white; 
  border: none; 
  padding: 14px 28px; 
  border-radius: 10px; 
  font-size: 1rem; 
  font-weight: 600; 
  cursor: pointer; 
  margin-top: 1rem;
  transition: all 0.25s ease;
}

.reset-btn-large:hover { 
  background: linear-gradient(135deg, #3aa876 0%, #2d9a68 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.3);
}

.results-info { 
  margin-top: 1.25rem; 
  font-size: 0.9rem; 
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(66, 185, 131, 0.08);
  border-radius: 8px;
  border-left: 3px solid #42b983;
  font-weight: 500;
}

/* Buttons */
.add-btn { 
  background: #2c3e50;
  color: white; 
  padding: 12px 24px; 
  text-decoration: none; 
  border-radius: 10px; 
  font-weight: 600; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.25);
}

.add-btn:hover { 
  background: #17212c;
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.35);
}

.add-btn .icon { 
  font-size: 1.3rem; 
  font-weight: bold; 
}

/* Table Styling */
.table-responsive { 
  overflow-x: auto; 
  background: white; 
  border-radius: 16px; 
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.07),
    0 2px 4px -1px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.players-table { 
  width: 100%; 
  border-collapse: collapse; 
  min-width: 800px; 
}

th, td { 
  padding: 16px 18px; 
  text-align: left; 
  border-bottom: 1px solid #edf2f7; 
}

th { 
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569; 
  font-weight: 700; 
  font-size: 0.8rem; 
  text-transform: uppercase; 
  letter-spacing: 0.06em;
}

tr:last-child td { 
  border-bottom: none; 
}

tr:hover { 
  background-color: rgba(66, 185, 131, 0.04); 
}

.player-name { 
  color: #1a202c; 
  font-size: 1.05rem; 
}

.text-center { text-align: center; }
.text-right { text-align: right; }

/* Badges for Positions */
.badge { 
  padding: 7px 14px; 
  border-radius: 20px; 
  font-size: 0.75rem; 
  font-weight: 700; 
  display: inline-block;
  letter-spacing: 0.02em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pos-gk { 
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid rgba(251, 191, 36, 0.3);
} 

.pos-def { 
  background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);
  color: #155e75;
  border: 1px solid rgba(34, 211, 238, 0.3);
} 

.pos-mid { 
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.pos-att { 
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

/* Action Buttons */
.actions-cell { 
  display: flex; 
  justify-content: flex-end; 
  gap: 10px; 
}

.view-btn { 
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #334155; 
  padding: 8px 16px; 
  border-radius: 8px; 
  text-decoration: none; 
  font-size: 0.875rem; 
  font-weight: 600; 
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.view-btn:hover { 
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.delete-btn { 
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626; 
  border: 1px solid #fecaca;
  padding: 8px 16px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-size: 0.875rem; 
  font-weight: 600; 
  transition: all 0.2s ease;
}

.delete-btn:hover { 
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
}

/* States */
.loading-state, .error-state, .empty-state { 
  text-align: center; 
  padding: 4rem 2rem; 
  color: #64748b; 
}

.empty-state h3 {
  color: #334155;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
}

.retry-btn { 
  margin-top: 1rem; 
  padding: 10px 20px; 
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  color: white; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.25);
}

.add-btn-large { 
  display: inline-block; 
  margin-top: 1.5rem; 
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white; 
  padding: 14px 28px; 
  text-decoration: none; 
  border-radius: 10px; 
  font-weight: 700;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.25);
}

.add-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.35);
}

/* Simple CSS Spinner */
.spinner { 
  border: 3px solid #e2e8f0; 
  border-top: 3px solid #42b983; 
  border-radius: 50%; 
  width: 40px; 
  height: 40px; 
  animation: spin 0.8s linear infinite; 
  margin: 0 auto 1rem; 
}

@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .players-container {
    padding: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  h1 {
    font-size: 1.75rem;
    text-align: center;
  }
  
  .add-btn {
    justify-content: center;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: 100%;
  }
  
  .reset-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>