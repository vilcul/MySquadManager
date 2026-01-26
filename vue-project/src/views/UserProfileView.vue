<template>
  <div class="profile-container">
    
    <div class="hero-section">
      <div class="hero-content">
        <h1>My Profile</h1>
        <p>Manage your account settings.</p>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>

    <div v-else class="profile-content">
      
      <div class="profile-card">
        <div v-if="message" class="alert success">{{ message }}</div>
        <div v-if="error" class="alert error">{{ error }}</div>

        <div v-if="!isEditing" class="info-view">
            <div class="avatar-circle">
                <span>{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</span>
            </div>
            
            <h2 class="user-name">{{ user.name }}</h2>
            <p class="user-email">{{ user.email }}</p>
            
            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Member ID</span>
                    <span class="value monospace">{{ user.id }}</span>
                </div>
            </div>

            <div class="main-actions">
                <button @click="isEditing = true" class="btn primary-btn">Edit Profile</button>
                <button @click="handleLogout" class="btn logout-btn">Log Out</button>
            </div>
        </div>

        <form v-else @submit.prevent="handleUpdate" class="edit-form">
            <h3>Edit Personal Details</h3>
            <div class="form-group">
                <label>Full Name</label>
                <input v-model="editForm.name" type="text" required />
            </div>
            <div class="form-group disabled">
                <label>Email (Cannot be changed)</label>
                <input :value="user.email" type="email" disabled />
            </div>
            <div class="actions">
                <button type="button" @click="isEditing = false" class="btn cancel-btn">Cancel</button>
                <button type="submit" class="btn save-btn">Save Changes</button>
            </div>
        </form>
      </div>

      <div class="danger-zone">
        <div class="danger-text">
            <h3>Delete Account</h3>
            <p>Once you delete your account, there is no going back.</p>
        </div>
        <button @click="handleDeleteAccount" class="btn delete-btn">Delete Account</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '@/utils/constants'

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(true)
const message = ref('')
const error = ref('')
const isEditing = ref(false)

const user = ref({ name: '', email: '', id: '' })
const editForm = reactive({ name: '' })

// 1. FETCH USER
onMounted(async () => {
  const userId = authStore.user?.id
  if (!userId) { router.push('/login'); return }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    
    if (response.ok) {
        const data = await response.json()
        user.value = data
        editForm.name = data.name 
    } else {
        error.value = "Failed to load profile."
    }
  } catch (e) {
    error.value = "Server connection error."
  } finally {
    isLoading.value = false
  }
})

// 2. UPDATE USER
async function handleUpdate() {
  error.value = ''; message.value = ''
  try {
    const response = await fetch(`${API_BASE_URL}/users/${user.value.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ name: editForm.name })
    })

    if (response.ok) {
        message.value = "Profile updated successfully!"
        user.value.name = editForm.name
        isEditing.value = false
        authStore.user.name = editForm.name 
    } else {
        const data = await response.json()
        error.value = data.error || "Update failed."
    }
  } catch (e) {
    error.value = "Error updating profile."
  }
}

// 3. LOGOUT
function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// 4. DELETE ACCOUNT
async function handleDeleteAccount() {
  if (!confirm("ARE YOU SURE?\nThis will permanently delete your account and players.")) return

  try {
    const response = await fetch(`${API_BASE_URL}/users/${user.value.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    if (response.ok) {
        alert("Account deleted."); authStore.logout(); router.push('/login')
    } else {
        error.value = "Failed to delete account."
    }
  } catch (e) {
    error.value = "Error deleting account."
  }
}
</script>

<style scoped>
/* ===== LAYOUT ===== */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #2c3e50;
}

/* ===== HERO ===== */
.hero-section {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
  text-align: center;
}

.hero-content h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}

.hero-content p {
  margin: 5px 0 0 0;
  opacity: 0.9;
}

/* ===== CARD ===== */
.profile-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid #e2e8f0;
}

/* ===== AVATAR ===== */
.avatar-circle {
  width: 80px;
  height: 80px;
  background: #e0f2fe;
  color: #0284c7;
  font-size: 2.5rem;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border: 2px solid #bae6fd;
}

.user-name {
  margin: 0;
  font-size: 1.8rem;
  color: #1e293b;
}

.user-email {
  color: #64748b;
  margin: 0.5rem 0 2rem;
  font-size: 1.1rem;
}

/* ===== DETAILS GRID ===== */
.details-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.detail-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.value {
  font-weight: 600;
  color: #334155;
}

.monospace {
  font-family: monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* ===== BUTTONS ===== */
.main-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 1rem;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.primary-btn {
  background: #2c3e50;
  color: white;
  min-width: 140px;
}

.primary-btn:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

.logout-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e0;
  min-width: 140px;
}

.logout-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  border-color: #94a3b8;
}

/* ===== FORMS ===== */
.edit-form {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.edit-form h3 {
  margin-bottom: 1.5rem;
  color: #334155;
  text-align: center;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group.disabled input {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 1.5rem;
}

.save-btn {
  background: #10b981;
  color: white;
  flex: 1;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  flex: 1;
}

/* ===== DANGER ZONE ===== */
.danger-zone {
  margin-top: 3rem;
  border: 1px solid #fecaca;
  background: #fef2f2;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.danger-text h3 {
  margin: 0 0 5px 0;
  color: #b91c1c;
  font-size: 1.1rem;
}

.danger-text p {
  margin: 0;
  color: #7f1d1d;
  font-size: 0.9rem;
}

.delete-btn {
  background: #dc2626;
  color: white;
  padding: 10px 20px;
  font-size: 0.9rem;
}

.delete-btn:hover {
  background: #b91c1c;
}

/* ===== ALERTS ===== */
.alert {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.error {
  background: #fee2e2;
  color: #991b1b;
}

/* ===== LOADING ===== */
.loading {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
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
@media (max-width: 600px) {
  .danger-zone {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .main-actions {
    flex-direction: column;
  }
}
</style>