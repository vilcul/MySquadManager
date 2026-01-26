<template>
  <div class="dashboard-container">
    
    <div class="hero-section">
      <div class="hero-content">
        <h1>Welcome back, {{ authStore.user?.name || 'Coach' }}!</h1>
        <p>Manage your squad, track statistics, and scout for new talent.</p>
      </div>
    </div>

    <div v-if="playerStore.isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading analytics...</p>
    </div>

    <div v-else class="content-grid">
      
      <div class="left-col">
        
        <section class="dashboard-section large-section">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            My Squad Overview
          </h2>
          
          <div class="stats-grid-quad">
            
            <div class="mini-stat-card">
              <span class="mini-label">Players</span>
              <span class="mini-value">{{ myTotalPlayers }}</span>
            </div>

            <div class="mini-stat-card">
              <span class="mini-label">Matches</span>
              <span class="mini-value">{{ myTotalMatches }}</span>
            </div>

            <div class="mini-stat-card">
              <span class="mini-label">Goals</span>
              <span class="mini-value text-green">{{ myTotalGoals }}</span>
            </div>

            <div class="mini-stat-card">
              <span class="mini-label">Assists</span>
              <span class="mini-value text-blue">{{ myTotalAssists }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="performers-grid">
            
            <div class="performer-card gold-border">
                <div class="p-header">
                    <div class="p-icon bg-gold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                    </div>
                    <span class="p-title">Top Scorer</span>
                </div>
                
                <div v-if="myTopScorer" class="p-details">
                    <span class="p-name">{{ myTopScorer.name }}</span>
                    <div class="p-stats-row">
                        <div class="p-stat-item">
                            <span class="lbl">Age</span>
                            <span class="val">{{ myTopScorer.age }}</span>
                        </div>
                        <div class="p-stat-item">
                            <span class="lbl">Matches</span>
                            <span class="val">{{ myTopScorer.stats?.matchesPlayed }}</span>
                        </div>
                        <div class="p-stat-item highlight">
                            <span class="lbl">Goals</span>
                            <span class="val">{{ myTopScorer.stats?.goalsScored }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state-text">No stats yet</div>
            </div>

            <div class="performer-card blue-border">
                <div class="p-header">
                    <div class="p-icon bg-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <span class="p-title">Top Assister</span>
                </div>

                <div v-if="myTopAssister" class="p-details">
                    <span class="p-name">{{ myTopAssister.name }}</span>
                    <div class="p-stats-row">
                        <div class="p-stat-item">
                            <span class="lbl">Age</span>
                            <span class="val">{{ myTopAssister.age }}</span>
                        </div>
                        <div class="p-stat-item">
                            <span class="lbl">Matches</span>
                            <span class="val">{{ myTopAssister.stats?.matchesPlayed }}</span>
                        </div>
                        <div class="p-stat-item highlight">
                            <span class="lbl">Assists</span>
                            <span class="val">{{ myTopAssister.stats?.assists }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state-text">No stats yet</div>
            </div>

          </div>

        </section>

        <section class="dashboard-section" v-if="myRecentPlayers.length > 0">
           <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            My Latest Signings
          </h2>
          <div class="recent-list">
             <div v-for="p in myRecentPlayers" :key="p.id" class="recent-item">
                <div class="recent-info">
                   <span class="r-name">{{ p.name }}</span>
                   <span class="r-team">{{ p.team }}</span>
                </div>
                <span :class="['badge', getPositionBadgeClass(p.position)]">{{ p.position }}</span>
             </div>
             <RouterLink to="/players" class="view-all-link">View Full Squad →</RouterLink>
          </div>
        </section>
        <div v-else class="empty-box">
            <p>You haven't added any players yet.</p>
            <RouterLink to="/players/create" class="add-link">+ Add First Player</RouterLink>
        </div>

      </div>

      <div class="right-col">
        
        <section class="dashboard-section global-section">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Global Competition
          </h2>

          <div class="global-stack">
            <div class="stat-card full-width">
              <div class="stat-content centered">
                <span class="value big">{{ globalTotalPlayers }}</span>
                <span class="label">Total Players in Database</span>
              </div>
            </div>

            <div class="stat-card full-width">
              <div class="stat-content">
                <span class="label text-gold">Top Scorer</span>
                <div class="player-highlight" v-if="globalTopScorer">
                  <span class="p-name">{{ globalTopScorer.name }}, </span>
                  <span class="p-team">{{ globalTopScorer.team }}, </span>
                  <span class="p-stat">{{ globalTopScorer.stats?.goalsScored }} Goals</span>
                </div>
                <div v-else class="player-highlight">No data</div>
              </div>
            </div>

            <div class="stat-card full-width">
              <div class="stat-content">
                <span class="label text-blue">Top Assister</span>
                <div class="player-highlight" v-if="globalTopAssister">
                  <span class="p-name">{{ globalTopAssister.name }}, </span>
                  <span class="p-team">{{ globalTopAssister.team }}, </span>
                  <span class="p-stat">{{ globalTopAssister.stats?.assists }} Assists</span>
                </div>
                <div v-else class="player-highlight">No data</div>
              </div>
            </div>
          </div>
        </section>

        <section class="dashboard-section">
           <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2.1l4 4-4 4"></path><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"></path><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"></path></svg>
            Recent Global Activity
          </h2>
          <div class="market-list">
             <div v-for="p in globalRecentActivity" :key="p.id" class="market-item">
                <div class="market-details">
                    <span class="m-name">{{ p.name }}</span>
                    <div class="m-sub">
                        <span class="m-team">{{ p.team }}</span>
                        <span class="m-pos">• {{ p.position }}</span>
                    </div>
                </div>
                <div class="m-arrow">New</div>
             </div>
             
             <div v-if="globalRecentActivity.length === 0" class="empty-text">No activity yet.</div>
          </div>

           <div class="actions-box">
             <RouterLink to="/players/create" class="action-btn primary full-btn">+ Scout New Player</RouterLink>
           </div>
        </section>

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

onMounted(() => {
  if (authStore.isAuthenticated) {
    playerStore.fetchPlayers()
  }
})

// LIST
const allPlayers = computed(() => playerStore.players)
const myPlayers = computed(() => {
  return playerStore.players.filter(p => p.createdBy === authStore.user?.id)
})

// STATISTICS
const myTotalPlayers = computed(() => myPlayers.value.length)

// TOTAL GAMES, GOALS, ASSISTS
const myTotalMatches = computed(() => myPlayers.value.reduce((sum, p) => sum + (p.stats?.matchesPlayed || 0), 0))
const myTotalGoals = computed(() => myPlayers.value.reduce((sum, p) => sum + (p.stats?.goalsScored || 0), 0))
const myTotalAssists = computed(() => myPlayers.value.reduce((sum, p) => sum + (p.stats?.assists || 0), 0))

// Top Scorer
const myTopScorer = computed(() => {
  if (myPlayers.value.length === 0) return null
  return [...myPlayers.value].sort((a, b) => (b.stats?.goalsScored || 0) - (a.stats?.goalsScored || 0))[0]
})

// Top Assister
const myTopAssister = computed(() => {
  if (myPlayers.value.length === 0) return null
  return [...myPlayers.value].sort((a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0))[0]
})

// NEW PLAYERS LIST
const myRecentPlayers = computed(() => {
  return [...myPlayers.value]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)
})

const globalRecentActivity = computed(() => {
  return [...allPlayers.value]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
})

// GLOBAL STATISTICS
const globalTotalPlayers = computed(() => allPlayers.value.length)
const globalTopScorer = computed(() => {
  if (allPlayers.value.length === 0) return null
  return [...allPlayers.value].sort((a, b) => (b.stats?.goalsScored || 0) - (a.stats?.goalsScored || 0))[0]
})
const globalTopAssister = computed(() => {
  if (allPlayers.value.length === 0) return null
  return [...allPlayers.value].sort((a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0))[0]
})

function getPositionBadgeClass(pos) {
    if (!pos) return ''
    if (pos === 'Goalkeeper') return 'badge-gk'
    if (pos.includes('Defender') || pos.includes('Back')) return 'badge-def'
    if (pos.includes('Midfielder')) return 'badge-mid'
    return 'badge-att'
}
</script>

<style scoped>
/* ===== PRINCIPAL LAYOUT ===== */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #2c3e50;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* ===== HERO SECTION ===== */
.hero-section {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
}

.hero-content h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}

.hero-content p {
  margin: 10px 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

/* ===== DASHBOARD SECTIONS ===== */
.dashboard-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 0.8rem;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1.5rem 0;
}

/* ===== STATS GRID ===== */
.stats-grid-quad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.mini-stat-card {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.mini-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.mini-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
}

/* ===== PERFORMERS CARDS ===== */
.performers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.performer-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.gold-border { border-top: 4px solid #f59e0b; }
.blue-border { border-top: 4px solid #3b82f6; }

.p-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.p-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.bg-gold { background: #f59e0b; }
.bg-blue { background: #3b82f6; }

.p-title {
  font-weight: 700;
  color: #475569;
  font-size: 0.95rem;
}

.p-details {
  display: flex;
  flex-direction: column;
}

.p-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 10px;
}

.p-stats-row {
  display: flex;
  justify-content: space-between;
}

.p-stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.p-stat-item.highlight .val {
  color: #3b82f6;
  font-weight: 900;
}

.gold-border .p-stat-item.highlight .val {
  color: #f59e0b;
}

/* ===== LABELS & VALUES ===== */
.lbl {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.val {
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
}

.label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  display: block;
}

.value.big {
  font-size: 2.2rem;
  display: block;
  font-weight: 800;
  color: #1a202c;
}

/* ===== RECENT LIST ===== */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.recent-info {
  display: flex;
  flex-direction: column;
}

.r-name {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.95rem;
}

.r-team {
  font-size: 0.8rem;
  color: #718096;
}

/* ===== MARKET LIST ===== */
.market-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.market-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.market-item:last-child {
  border-bottom: none;
}

.m-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #2d3748;
  display: block;
}

.m-sub {
  font-size: 0.8rem;
  color: #718096;
}

.m-team {
  color: #2c3e50;
  font-weight: 600;
}

.m-arrow {
  color: #10b981;
  font-weight: bold;
  font-size: 0.8rem;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 10px;
}

/* ===== BADGES ===== */
.badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-gk  { background: #fff3cd; color: #856404; }
.badge-def { background: #d1ecf1; color: #0c5460; }
.badge-mid { background: #d4edda; color: #155724; }
.badge-att { background: #f8d7da; color: #721c24; }

/* ===== GLOBAL SECTION ===== */
.global-section {
  background: #fdfdfd;
  border-color: #e2e8f0;
}

.global-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #edf2f7;
  transition: transform 0.2s;
}

.stat-content.centered {
  text-align: center;
}

.player-highlight {
  margin-top: 5px;
}

.p-name-global {
  font-weight: 700;
  display: block;
  color: #2d3748;
}

/* ===== UTILITY CLASSES ===== */
.text-green { color: #10b981; }
.text-blue  { color: #3b82f6; }
.text-gold  { color: #d97706; }

.full-width {
  width: 100%;
  display: block;
  box-sizing: border-box;
}

/* ===== LINKS & BUTTONS ===== */
.view-all-link,
.add-link {
  text-align: center;
  display: block;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.actions-box {
  margin-top: 1.5rem;
}

.full-btn {
  display: block;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}

.primary {
  background: #2c3e50;
  color: white;
}

.primary:hover {
  background: #1a202c;
}

/* ===== EMPTY STATES ===== */
.empty-state-text {
  color: #cbd5e0;
  font-style: italic;
  font-size: 0.9rem;
}

.empty-box {
  text-align: center;
  color: #999;
  padding: 1rem;
}

.empty-text {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 10px;
}

/* ===== LOADING STATE ===== */
.loading {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2c3e50;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid-quad {
    grid-template-columns: 1fr 1fr;
  }
  
  .performers-grid {
    grid-template-columns: 1fr;
  }
}
</style>