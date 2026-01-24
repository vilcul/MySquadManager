<template>
  <div class="detail-container">

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading player profile...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <RouterLink to="/players" class="back-link">← Back to Squad</RouterLink>
    </div>

    <div v-else-if="player" class="profile-card">
      
      <div class="profile-header">
        <div class="header-left">
          <RouterLink to="/players" class="back-btn">← Back</RouterLink>
          <h1 class="player-name">{{ player.name }}</h1>
          <p class="player-team">{{ player.team }}</p>
        </div>
        <div class="header-right">
          <div class="position-badge">{{ player.position }}</div>
          <div class="age-badge">{{ player.age }} Years</div>
        </div>
      </div>

      <div class="grid-layout">
        
        <div class="card physical-card">
          <h3>Physical Attributes</h3>
          <div class="stats-row">
            <div class="stat-item">
              <span class="label">Height</span>
              <span class="value">{{ player.physical?.height || '-' }} cm</span>
            </div>
            <div class="stat-item">
              <span class="label">Weight</span>
              <span class="value">{{ player.physical?.weight || '-' }} kg</span>
            </div>
            <div class="stat-item">
              <span class="label">Foot</span>
              <span class="value">{{ player.physical?.preferredFoot || '-' }}</span>
            </div>
          </div>
        </div>

        <div class="card stats-card">
          <h3>Season Statistics</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span class="big-number">{{ player.stats?.matchesPlayed || 0 }}</span>
              <span class="label">Matches</span>
            </div>
            <div class="stat-box">
              <span class="big-number">{{ player.stats?.goalsScored || 0 }}</span>
              <span class="label">Goals</span>
            </div>
            <div class="stat-box">
              <span class="big-number">{{ player.stats?.assists || 0 }}</span>
              <span class="label">Assists</span>
            </div>
          </div>
        </div>

        <div class="card skills-card" v-if="hasSkills">
          <h3>Skill Ratings</h3>
          
          <div class="skill-bar" v-if="player.stats?.skillRatings?.technical">
            <div class="skill-info">
              <span>Technical</span>
              <span>{{ player.stats.skillRatings.technical }}/10</span>
            </div>
            <div class="progress-bg">
              <div class="progress-fill tech" :style="{ width: (player.stats.skillRatings.technical * 10) + '%' }"></div>
            </div>
          </div>

          <div class="skill-bar" v-if="player.stats?.skillRatings?.physical">
            <div class="skill-info">
              <span>Physical</span>
              <span>{{ player.stats.skillRatings.physical }}/10</span>
            </div>
            <div class="progress-bg">
              <div class="progress-fill phys" :style="{ width: (player.stats.skillRatings.physical * 10) + '%' }"></div>
            </div>
          </div>

          <div class="skill-bar" v-if="player.stats?.skillRatings?.tactical">
            <div class="skill-info">
              <span>Tactical</span>
              <span>{{ player.stats.skillRatings.tactical }}/10</span>
            </div>
            <div class="progress-bg">
              <div class="progress-fill tact" :style="{ width: (player.stats.skillRatings.tactical * 10) + '%' }"></div>
            </div>
          </div>

          <div class="skill-bar" v-if="player.stats?.skillRatings?.mental">
            <div class="skill-info">
              <span>Mental</span>
              <span>{{ player.stats.skillRatings.mental }}/10</span>
            </div>
            <div class="progress-bg">
              <div class="progress-fill ment" :style="{ width: (player.stats.skillRatings.mental * 10) + '%' }"></div>
            </div>
          </div>
        </div>

      </div>

      <div class="profile-footer" v-if="player.createdBy === authStore.user?.id">
        <RouterLink :to="`/players/${player.id}/edit`" class="edit-btn">Edit Player</RouterLink>
        <button @click="handleDelete" class="delete-btn">Delete Player</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/players'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const authStore = useAuthStore()

const player = ref(null)
const loading = ref(true)
const error = ref(null)

const hasSkills = computed(() => {
    const s = player.value?.stats?.skillRatings;
    return s && (s.technical || s.physical || s.tactical || s.mental);
})

onMounted(async () => {
  const playerId = route.params.id
  try {
    const data = await playerStore.fetchPlayer(playerId)
    if (data) {
        player.value = data
    } else {
        error.value = "Player not found."
    }
  } catch (err) {
    error.value = "Error loading player details."
  } finally {
    loading.value = false
  }
})

async function handleDelete() {
    if(confirm("Are you sure? This cannot be undone.")) {
        await playerStore.deletePlayer(player.value.id)
        router.push('/players')
    }
}
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.back-btn {
  text-decoration: none;
  color: #7f8c8d;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.player-name {
  margin: 0;
  color: #2c3e50;
  font-size: 2.5rem;
}

.player-team {
  margin: 0;
  color: #7f8c8d;
  font-size: 1.2rem;
}

.header-right {
  text-align: right;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: flex-end;
}

.position-badge {
  background: #42b983;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
}

.age-badge {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f1f1;
}

.card h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-item .label {
  font-size: 0.8rem;
  color: #95a5a6;
  text-transform: uppercase;
}

.stat-item .value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.stats-grid {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.stat-box {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  flex: 1;
  text-align: center;
}

.big-number {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #42b983;
}

.stat-box .label {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.skill-bar {
  margin-bottom: 1rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 4px;
  font-weight: bold;
  color: #555;
}

.progress-bg {
  background: #ecf0f1;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 1s ease-in-out;
}

.tech {
  background: #3498db;
}

.phys {
  background: #e74c3c;
}

.tact {
  background: #f1c40f;
}

.ment {
  background: #9b59b6;
}

.profile-footer {
  margin-top: 2rem;
  text-align: right;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.delete-btn:hover {
  background: #c0392b;
}

.edit-btn {
  background: #3498db;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  margin-right: 10px;
  display: inline-block;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #2980b9;
}

.loading-state,
.error-state {
  text-align: center;
  margin-top: 4rem;
  color: #7f8c8d;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>