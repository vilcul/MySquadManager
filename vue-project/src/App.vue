<template>
  <header v-if="authStore.isAuthenticated" class="navbar">
    <div class="nav-container">
      
      <RouterLink to="/" class="logo">
        MySquadManager
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/" active-class="active">Home</RouterLink>
        <RouterLink to="/players" active-class="active">Players</RouterLink>
        <RouterLink to="/profile" active-class="active">Profile</RouterLink>
      </nav>

    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style>
body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; }
</style>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #7f8c8d;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #42b983;
}

.nav-links a.active {
  color: #42b983;
  font-weight: bold;
}

@media (max-width: 600px) {
  .navbar { padding: 0 1rem; }
  .logo { font-size: 1.2rem; }
  .nav-links { gap: 15px; font-size: 0.9rem; }
}
</style>