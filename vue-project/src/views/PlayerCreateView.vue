<template>
  <div class="create-container">
    <h1>Add New Player</h1>

    <form @submit.prevent="handleSubmit" class="player-form">
      
      <div class="section">
        <h3>Basic Information</h3>
        
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input id="name" v-model="form.name" type="text" required placeholder="e.g. Cristiano Ronaldo" />
        </div>

        <div class="row">
          <div class="form-group half">
            <label for="team">Team *</label>
            <input id="team" v-model="form.team" type="text" required placeholder="e.g. Al Nassr" />
          </div>
          <div class="form-group half">
            <label for="age">Age *</label>
            <input id="age" v-model="form.age" type="number" min="8" max="20" required />
          </div>
        </div>

        <div class="form-group">
          <label for="position">Position *</label>
          <select id="position" v-model="form.position" required>
            <option disabled value="">Select Position</option>
            <option v-for="pos in positions" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>
        </div>
      </div>

      <div class="section">
        <h3>Physical Attributes</h3>
        <div class="row">
          <div class="form-group third">
            <label for="height">Height (cm) *</label>
            <input id="height" v-model="form.physical.height" type="number" min="150" max="230" required placeholder="185" />
          </div>
          <div class="form-group third">
            <label for="weight">Weight (kg) *</label>
            <input id="weight" v-model="form.physical.weight" type="number" min="50" max="130" required placeholder="80" />
          </div>
          <div class="form-group third">
            <label for="foot">Preferred Foot *</label>
            <select id="foot" v-model="form.physical.preferredFoot" required>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Season Stats & Skills</h3>
        
        <div class="row">
          <div class="form-group third">
            <label for="matches">Matches *</label>
            <input id="matches" v-model="form.stats.matchesPlayed" type="number" min="0" required />
          </div>
          <div class="form-group third">
            <label for="goals">Goals *</label>
            <input id="goals" v-model="form.stats.goalsScored" type="number" min="0" required />
          </div>
          <div class="form-group third">
            <label for="assists">Assists *</label>
            <input id="assists" v-model="form.stats.assists" type="number" min="0" required />
          </div>
        </div>

        <h4 class="sub-title">Skill Ratings (1-10) <span class="opt">(Optional)</span></h4>
        <div class="row">
          <div class="form-group quarter">
            <label for="tech">Technical</label>
            <input id="tech" v-model="form.stats.skillRatings.technical" type="number" min="1" max="10" placeholder="-" />
          </div>
          <div class="form-group quarter">
            <label for="phys-rate">Physical</label>
            <input id="phys-rate" v-model="form.stats.skillRatings.physical" type="number" min="1" max="10" placeholder="-" />
          </div>
          <div class="form-group quarter">
            <label for="tact">Tactical</label>
            <input id="tact" v-model="form.stats.skillRatings.tactical" type="number" min="1" max="10" placeholder="-" />
          </div>
          <div class="form-group quarter">
            <label for="mental">Mental</label>
            <input id="mental" v-model="form.stats.skillRatings.mental" type="number" min="1" max="10" placeholder="-" />
          </div>
        </div>
      </div>

      <div class="form-group error-container" v-if="errorMessage">
        <div class="error-message">
            {{ errorMessage }}
        </div>
      </div>

      <div class="actions">
        <button type="button" @click="router.push('/players')" class="cancel-btn">Cancel</button>
        
        <button type="submit" :disabled="playerStore.isLoading" class="save-btn">
            {{ playerStore.isLoading ? 'Creating...' : 'Create Player' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { usePlayerStore } from '@/stores/players'
import { useRouter } from 'vue-router'

const playerStore = usePlayerStore()
const router = useRouter()
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
    preferredFoot: 'Right'
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

async function handleSubmit() {
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

    await playerStore.createPlayer(payload)
    
    router.push('/players')
    
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

.section:last-child {
  border-bottom: none;
}

h3 {
  color: #42b983;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  margin-top: 0;
}

.sub-title {
  font-size: 1rem;
  color: #555;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.opt {
  font-size: 0.8rem;
  color: #999;
  font-weight: normal;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
  color: #34495e;
  font-size: 0.9rem;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
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
  background: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #3aa876;
}

.save-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #ecf0f1;
  color: #7f8c8d;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn:hover {
  background: #bdc3c7;
  color: #2c3e50;
}

.error-message {
  background: #ffe6e6;
  color: #c0392b;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  border-left: 4px solid #e74c3c;
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