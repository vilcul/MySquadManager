<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header>
    <div class="logo-text">MySquadManager</div>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/players">Players</RouterLink>
        
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/register">Register</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
        </template>
        
        <template v-else>
          <span class="user-email">{{ authStore.userEmail }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </template>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ccc; 
  background-color: white;      
}

.logo-text {
    font-weight: bold;
    font-size: 1.5rem;
    color: #2c3e50;
}

.wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

nav {
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #2c3e50; 
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #42b983; 
}

nav a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}

.user-email {
    margin-right: 10px;
    font-weight: bold;
    color: #555;
}

.logout-btn {
  background-color: #e74c3c; 
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}

.logout-btn:hover {
    background-color: #c0392b;
}
</style>