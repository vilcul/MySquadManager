<template>
  <div class="register-container">
    <h1>User Registration</h1>

    <div class="form-section">
      <form @submit.prevent="handleSubmit" class="register-form">
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="coach@exemple.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password (min 6 characters):</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            required
          />
          <div v-if="password" class="password-strength">
            Strength: <span :class="passwordStrength">{{ passwordStrength }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            required
          />
          <span v-if="confirmPassword && !passwordsMatch" class="error">
            Passwords do not match
          </span>

          <span v-if="confirmPassword && passwordsMatch" class="success">
            Passwords match
          </span>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="!formIsValid || isLoading" class="submit-btn">
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>

        <p class="switch-auth">
            Do you already have an account? <RouterLink to="/login">Login here</RouterLink>
        </p>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router' 

// ==================== STATE ====================
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// ==================== COMPUTED PROPERTIES ====================

const passwordStrength = computed(() => {
  const length = password.value.length
  if (length === 0) return ''
  if (length < 6) return 'weak'
  if (length < 10) return 'medium'
  return 'strong'
})

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return false
  return password.value === confirmPassword.value
})

const formIsValid = computed(() => {
  return (
    email.value.includes('@') && 
    password.value.length >= 6 && 
    passwordsMatch.value &&
    !isLoading.value
  )
})

// ==================== METHODS ====================

async function handleSubmit() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await authStore.register(email.value, password.value)

    console.log('Registration successful!');
    router.push('/'); 

  } catch (error) {
    if (error.message && error.message.includes('array')) {
      errorMessage.value = 'Invalid data. Please check the fields.'
    } else {
      errorMessage.value = error.message || 'Registration error.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 500px; 
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  color: #42b983;
  margin-bottom: 2rem;
  text-align: center;
}

.register-form {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}
.password-strength .weak { color: #e74c3c; font-weight: bold; }
.password-strength .medium { color: #f39c12; font-weight: bold; }
.password-strength .strong { color: #27ae60; font-weight: bold; }

.error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.success {
  color: #27ae60;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
}

.error-message {
  background: #ffe6e6;
  color: #c0392b;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #e74c3c;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  background: #42b983;
  color: white;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #359268;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.switch-auth {
  margin-top: 1.5rem;
  text-align: center;
}
</style>