<!-- src/components/layout/Header.vue -->
<template>
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>ForumApp</h1>
        </router-link>
        
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Caută..."
            v-model="searchQuery"
            @keyup.enter="search"
          />
        </div>
        
        <div class="nav-links">
          <template v-if="isAuthenticated">
            <router-link to="/submit" class="btn btn-outline">Postează</router-link>
            <div class="dropdown">
              <button class="dropdown-btn">
                {{ username }}
                <span class="arrow-down">▼</span>
              </button>
              <div class="dropdown-content">
                <router-link to="/profile">Profil</router-link>
                <router-link to="/create-community">Creează comunitate</router-link>
                <a href="#" @click.prevent="logout">Deconectare</a>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline">Conectare</router-link>
            <router-link to="/register" class="btn btn-primary">Înregistrare</router-link>
          </template>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Header',
    setup() {
      const store = useStore();
      const router = useRouter();
      const searchQuery = ref('');
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      const user = computed(() => store.getters.currentUser);
      const username = computed(() => user.value ? user.value.username : '');
      
      const logout = () => {
        store.dispatch('logout');
        router.push('/');
      };
      
      const search = () => {
        if (searchQuery.value.trim()) {
          router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
        }
      };
      
      return {
        isAuthenticated,
        username,
        searchQuery,
        logout,
        search
      };
    }
  };
  </script>
  
  <style scoped>
  .header {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
  }
  
  .logo {
    text-decoration: none;
    margin-right: 20px;
  }
  
  .logo h1 {
    color: #ff4500;
    font-size: 24px;
    margin: 0;
  }
  
  .search-bar {
    flex: 1;
    margin: 0 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: #f6f7f8;
  }
  
  .search-bar input:focus {
    outline: none;
    border-color: #0079d3;
    background-color: white;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #0079d3;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #0064bd;
  }
  
  .btn-outline {
    background-color: transparent;
    color: #0079d3;
    border: 1px solid #0079d3;
  }
  
  .btn-outline:hover {
    background-color: rgba(0, 121, 211, 0.05);
  }
  
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px;
  }
  
  .arrow-down {
    font-size: 10px;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 1;
    right: 0;
  }
  
  .dropdown-content a {
    color: #1a1a1b;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    font-size: 14px;
  }
  
  .dropdown-content a:hover {
    background-color: #f6f7f8;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  </style>