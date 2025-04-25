<!-- src/views/SearchResults.vue -->
<template>
    <div class="search-results-container">
      <div class="search-header">
        <h1>Rezultate pentru "{{ searchQuery }}"</h1>
        <p v-if="posts.length === 0 && !loading">Nu au fost găsite rezultate pentru această căutare.</p>
      </div>
  
      <div class="content-container">
        <div class="posts-container">
          <div v-if="loading" class="loading">
            <p>Se încarcă rezultatele...</p>
          </div>
          <div v-else-if="error" class="error-message">
            <p>{{ error }}</p>
          </div>
          <div v-else>
            <post-card 
              v-for="post in posts" 
              :key="post.id" 
              :post="post"
              class="post-item" 
            />
            
            <div v-if="posts.length > 0 && hasMorePosts" class="load-more">
              <button @click="loadMorePosts" :disabled="loadingMore" class="load-more-btn">
                {{ loadingMore ? 'Se încarcă...' : 'Încarcă mai multe' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="sidebar">
          <div class="sidebar-section search-tips">
            <h3>Sfaturi pentru căutare</h3>
            <ul>
              <li>Folosește cuvinte cheie specifice</li>
              <li>Încearcă termeni alternativi dacă nu găsești rezultate</li>
              <li>Poți căuta după numele comunității folosind prefixul "r/"</li>
              <li>Poți căuta după numele utilizatorului folosind prefixul "u/"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import PostCard from '../components/post/PostCard.vue';
  import searchService from '../services/searchService';
  
  export default {
    name: 'SearchResults',
    components: {
      PostCard
    },
    setup() {
      const route = useRoute();
      const store = useStore();
      
      const searchQuery = computed(() => route.query.q || '');
      const posts = ref([]);
      const loading = ref(true);
      const error = ref(null);
      const offset = ref(0);
      const limit = ref(10);
      const hasMorePosts = ref(true);
      const loadingMore = ref(false);
      
      const fetchSearchResults = async () => {
        try {
          loading.value = true;
          error.value = null;
          posts.value = [];
          offset.value = 0;
          
          const response = await searchService.search(searchQuery.value, limit.value, offset.value);
          posts.value = response.posts;
          hasMorePosts.value = response.posts.length === limit.value;
          
        } catch (err) {
          error.value = 'A apărut o eroare la căutare. Vă rugăm încercați din nou.';
          console.error('Search error:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const loadMorePosts = async () => {
        if (loadingMore.value || !hasMorePosts.value) return;
        
        try {
          loadingMore.value = true;
          offset.value += limit.value;
          
          const response = await searchService.search(searchQuery.value, limit.value, offset.value);
          posts.value = [...posts.value, ...response.posts];
          hasMorePosts.value = response.posts.length === limit.value;
          
        } catch (err) {
          console.error('Error loading more posts:', err);
        } finally {
          loadingMore.value = false;
        }
      };
      
      onMounted(fetchSearchResults);
      
      watch(() => route.query.q, () => {
        if (searchQuery.value) {
          fetchSearchResults();
        }
      });
      
      return {
        searchQuery,
        posts,
        loading,
        error,
        hasMorePosts,
        loadingMore,
        loadMorePosts
      };
    }
  };
  </script>
  
  <style scoped>
  .search-results-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .search-header {
    margin-bottom: 20px;
  }
  
  .search-header h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .content-container {
    display: flex;
    gap: 20px;
  }
  
  .posts-container {
    flex: 1;
  }
  
  .post-item {
    margin-bottom: 16px;
  }
  
  .loading, .error-message {
    text-align: center;
    padding: 40px 0;
    color: #787c7e;
  }
  
  .load-more {
    text-align: center;
    margin: 20px 0;
  }
  
  .load-more-btn {
    background-color: #0079d3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .load-more-btn:hover {
    background-color: #0064bd;
  }
  
  .load-more-btn:disabled {
    background-color: #7fbce9;
    cursor: not-allowed;
  }
  
  .sidebar {
    width: 300px;
    flex-shrink: 0;
  }
  
  .sidebar-section {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .sidebar-section h3 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 16px;
    color: #1a1a1b;
    padding-bottom: 8px;
    border-bottom: 1px solid #edeff1;
  }
  
  .search-tips ul {
    list-style-type: disc;
    padding-left: 20px;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .search-tips li {
    margin-bottom: 8px;
  }
  
  @media (max-width: 768px) {
    .content-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
    }
  }
  </style>