<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="sidebar">
      <div class="sidebar-section">
        <h3>Comunități populare</h3>
        <div v-if="loading" class="loading">Se încarcă...</div>
        <ul v-else class="community-list">
          <li v-for="community in communities" :key="community.id">
            <router-link :to="`/c/${community.name}`">
              r/{{ community.name }}
              <span class="member-count">{{ community.member_count }} membri</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3>Acțiuni</h3>
        <div class="sidebar-buttons">
          <router-link to="/create-community" class="sidebar-btn">
            Creează o comunitate
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="post-actions">
        <router-link to="/submit" class="create-post-btn">
          Creează o postare
        </router-link>
      </div>
      
      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'new' }"
          @click="setFilter('new')"
        >
          Noi
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'hot' }"
          @click="setFilter('hot')"
        >
          Populare
        </button>
      </div>
      
      <div v-if="loading" class="loading-posts">
        <p>Se încarcă postările...</p>
        <!-- src/views/Home.vue (continuare) -->
      </div>
      
      <div v-else-if="posts.length === 0" class="no-posts">
        <p>Nu există postări încă. Fii primul care postează ceva!</p>
      </div>
      
      <div v-else class="posts-list">
        <PostCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
        
        <div class="load-more" v-if="hasMorePosts">
          <button @click="loadMorePosts" :disabled="loadingMore">
            {{ loadingMore ? 'Se încarcă...' : 'Încarcă mai multe' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import PostCard from '../components/post/PostCard.vue';
import postService from '../services/postService';
import communityService from '../services/communityService';

export default {
  name: 'Home',
  components: {
    PostCard
  },
  setup() {
    const store = useStore();
    const posts = ref([]);
    const communities = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const currentFilter = ref('new');
    const currentPage = ref(1);
    const postsPerPage = 10;
    const hasMorePosts = ref(true);
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    const loadPosts = async () => {
      try {
        loading.value = true;
        const offset = 0;
        const response = await postService.getAllPosts(postsPerPage, offset);
        posts.value = response;
        currentPage.value = 1;
        hasMorePosts.value = response.length === postsPerPage;
      } catch (error) {
        console.error('Eroare la încărcarea postărilor:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const loadMorePosts = async () => {
      try {
        loadingMore.value = true;
        const offset = currentPage.value * postsPerPage;
        const response = await postService.getAllPosts(postsPerPage, offset);
        posts.value = [...posts.value, ...response];
        currentPage.value++;
        hasMorePosts.value = response.length === postsPerPage;
      } catch (error) {
        console.error('Eroare la încărcarea mai multor postări:', error);
      } finally {
        loadingMore.value = false;
      }
    };
    
    const loadCommunities = async () => {
      try {
        const response = await communityService.getAllCommunities(5, 0);
        communities.value = response;
      } catch (error) {
        console.error('Eroare la încărcarea comunităților:', error);
      }
    };
    
    const setFilter = (filter) => {
      if (currentFilter.value !== filter) {
        currentFilter.value = filter;
        loadPosts();
      }
    };
    
    onMounted(() => {
      loadPosts();
      loadCommunities();
    });
    
    return {
      posts,
      communities,
      loading,
      loadingMore,
      currentFilter,
      hasMorePosts,
      isAuthenticated,
      loadMorePosts,
      setFilter
    };
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  gap: 24px;
}

.main-content {
  flex: 1;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
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
}

.community-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.community-list li {
  margin-bottom: 8px;
}

.community-list a {
  display: flex;
  justify-content: space-between;
  color: #1a1a1b;
  text-decoration: none;
  padding: 8px 0;
  font-weight: 500;
}

.community-list a:hover {
  color: #0079d3;
}

.member-count {
  color: #787c7e;
  font-size: 12px;
}

.sidebar-buttons {
  display: flex;
  flex-direction: column;
}

.sidebar-btn {
  display: block;
  background-color: #0079d3;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 8px;
}

.sidebar-btn:hover {
  background-color: #0064bd;
}

.post-actions {
  margin-bottom: 16px;
}

.create-post-btn {
  display: block;
  background-color: #0079d3;
  color: white;
  text-align: center;
  padding: 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.create-post-btn:hover {
  background-color: #0064bd;
}

.filter-tabs {
  display: flex;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.filter-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-tab:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.filter-tab.active {
  color: #0079d3;
  border-bottom: 2px solid #0079d3;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-posts, .no-posts {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  color: #787c7e;
}

.loading {
  color: #787c7e;
  text-align: center;
  padding: 10px 0;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more button {
  background-color: #f6f7f8;
  border: 1px solid #dae0e6;
  color: #1a1a1b;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.load-more button:hover:not(:disabled) {
  background-color: #dae0e6;
}

.load-more button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>