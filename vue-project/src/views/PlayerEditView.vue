<template>
  <div class="create-container">
    <h1>Edit Player</h1>

    <div v-if="isLoading" class="loading">Loading data...</div>

    <form v-else @submit.prevent="handleUpdate" class="player-form">
      
      <div class="section">
        <h3>Basic Information</h3>
        <div class="form-group"><label>Full Name</label><input v-model="form.name" type="text" required /></div>
        <div class="row">
          <div class="form-group half"><label>Team</label><input v-model="form.team" type="text" required /></div>
          <div class="form-group half"><label>Age</label><input v-model="form.age" type="number" min="8" max="20" required /></div>
        </div>
        <div class="form-group">
            <label>Position</label>
            <select v-model="form.position" required>
                <option v-for="pos in positions" :key="pos" :value="pos">{{ pos }}</option>
            </select>
        </div>
      </div>

      <div class="section">
        <h3>Physical Attributes</h3>
        <div class="row">
          <div class="form-group third"><label>Height (cm)</label><input v-model="form.physical.height" type="number" required /></div>
          <div class="form-group third"><label>Weight (kg)</label><input v-model="form.physical.weight" type="number" required /></div>
          <div class="form-group third">
            <label>Foot</label>
            <select v-model="form.physical.preferredFoot" required>
                <option value="Right">Right</option><option value="Left">Left</option><option value="Both">Both</option>
            </select>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Stats & Skills</h3>
        <div class="row">
          <div class="form-group third"><label>Matches</label><input v-model="form.stats.matchesPlayed" type="number" required /></div>
          <div class="form-group third"><label>Goals</label><input v-model="form.stats.goalsScored" type="number" required /></div>
          <div class="form-group third"><label>Assists</label><input v-model="form.stats.assists" type="number" required /></div>
        </div>

        <h4 class="sub-title">Skill Ratings (1-10)</h4>
        <div class="row">
          <div class="form-group quarter"><label>Technical</label><input v-model="form.stats.skillRatings.technical" type="number" min="1" max="10" /></div>
          <div class="form-group quarter"><label>Physical</label><input v-model="form.stats.skillRatings.physical" type="number" min="1" max="10" /></div>
          <div class="form-group quarter"><label>Tactical</label><input v-model="form.stats.skillRatings.tactical" type="number" min="1" max="10" /></div>
          <div class="form-group quarter"><label>Mental</label><input v-model="form.stats.skillRatings.mental" type="number" min="1" max="10" /></div>
        </div>
      </div>

      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

      <div class="actions">
        <button type="button" @click="router.back()" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/players'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const playerStore = usePlayerStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const errorMessage = ref('')

const positions = [
  'Goalkeeper', 'Center Back', 'Full Back', 
  'Defensive Midfielder', 'Central Midfielder', 
  'Winger', 'Striker'
]

const form = reactive({
  name: '',
  age: '',
  position: '',
  team: '',
  physical: { 
    height: '',
    weight: '',
    preferredFoot: ''
 },
  stats: {
    matchesPlayed: 0,
    goalsScored: 0,
    assists: 0,
    skillRatings: {
        technical: '',
        physical: '',
        tactical: '',
        mental: '' 
    }
  }
})

onMounted(async () => {
  try {
    const data = await playerStore.fetchPlayer(route.params.id)
    
    if (data.createdBy !== authStore.user?.id) {
        alert("You are not allowed to edit this player.")
        router.push('/players')
        return;
    }

    form.name = data.name
    form.age = data.age
    form.position = data.position
    form.team = data.team
    
    if (data.physical) {
        form.physical.height = data.physical.height
        form.physical.weight = data.physical.weight
        form.physical.preferredFoot = data.physical.preferredFoot
    }

    if (data.stats) {
        form.stats.matchesPlayed = data.stats.matchesPlayed
        form.stats.goalsScored = data.stats.goalsScored
        form.stats.assists = data.stats.assists
        
        const skills = data.stats.skillRatings || {}
        form.stats.skillRatings.technical = skills.technical || ''
        form.stats.skillRatings.physical = skills.physical || ''
        form.stats.skillRatings.tactical = skills.tactical || ''
        form.stats.skillRatings.mental = skills.mental || ''
    }

    isLoading.value = false
  } catch (err) {
    errorMessage.value = "Failed to load player data."
    isLoading.value = false
  }
})

async function handleUpdate() {
  errorMessage.value = ''
  
  try {
    const payload = {
      name: form.name,
      team: form.team,
      position: form.position,
      age: parseInt(form.age),
      physical: {
        height: parseInt(form.physical.height),
        weight: parseInt(form.physical.weight),
        preferredFoot: form.physical.preferredFoot
      },
      stats: {
        matchesPlayed: parseInt(form.stats.matchesPlayed),
        goalsScored: parseInt(form.stats.goalsScored),
        assists: parseInt(form.stats.assists),
        skillRatings: {
          technical: form.stats.skillRatings.technical ? parseInt(form.stats.skillRatings.technical) : null,
          physical: form.stats.skillRatings.physical ? parseInt(form.stats.skillRatings.physical) : null,
          tactical: form.stats.skillRatings.tactical ? parseInt(form.stats.skillRatings.tactical) : null,
          mental: form.stats.skillRatings.mental ? parseInt(form.stats.skillRatings.mental) : null,
        }
      }
    }

    await playerStore.updatePlayer(route.params.id, payload)
    
    router.push(`/players/${route.params.id}`)
    
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

<style scoped>
.create-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
  color: #34495e;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 0 0 48%;
}

.third {
  flex: 1;
}

.quarter {
  flex: 1;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn:hover {
  background: #2980b9;
}

.cancel-btn {
  background: #ecf0f1;
  color: #7f8c8d;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    gap: 0;
  }

  .half,
  .third,
  .quarter {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>