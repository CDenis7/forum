<!-- src/views/Community.vue -->
<template>
    <div class="community-container" v-if="community">
      <div class="community-banner">
        <div class="community-banner-content">
          <h1>r/{{ community.name }}</h1>
          <p>{{ community.description }}</p>
          <div class="community-stats">
            <span>{{ community.member_count }} membri</span>
            <span>{{ community.post_count }} postări</span>
          </div>
          <button 
            v-if="isAuthenticated" 
            class="join-btn" 
            :class="{ 'joined': isMember }"
            @click="toggleMembership"
          >
            {{ isMember ? 'Părăsește' : 'Alătură-te' }}
          </button>
        </div>
      </div>
  
      <div class="community-content">
        <div class="main-content">
          <div class="post-actions">
            <router-link :to="{ name: 'CreatePost', query: { community: community.name }}" class="create-post-btn">
              Creează o postare în r/{{ community.name }}
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
          </div>
          
          <div v-else-if="posts.length === 0" class="no-posts">
            <p>Nu există postări în această comunitate. Fii primul care postează ceva!</p>
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
        
        <SidebarCommunity :community="community" />
      </div>
    </div>
    <div v-else class="loading-community">
      <p>Se încarcă comunitatea...</p>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import PostCard from '../components/post/PostCard.vue';
  import SidebarCommunity from '../components/community/SidebarCommunity.vue';
  import communityService from '../services/communityService';
  import postService from '../services/postService';
  
  export default {
    name: 'Community',
    components: {
      PostCard,
      SidebarCommunity
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      const communityName = computed(() => route.params.name);
      
      const community = ref(null);
      const posts = ref([]);
      const loading = ref(true);
      const loadingMore = ref(false);
      const currentFilter = ref('new');
      const currentPage = ref(1);
      const postsPerPage = 10;
      const hasMorePosts = ref(true);
      const isMember = ref(false);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      const currentUser = computed(() => store.getters.currentUser);
      
      const loadCommunity = async () => {
        try {
          const data = await communityService.getCommunityByName(communityName.value);
          community.value = data;
          
          // Verifică dacă utilizatorul este membru
          if (isAuthenticated.value && data.members) {
            isMember.value = data.members.includes(currentUser.value.id);
          }
          
          loadPosts();
        } catch (error) {
          console.error('Eroare la încărcarea comunității:', error);
        }
      };
      
      const loadPosts = async () => {
        try {
          loading.value = true;
          const offset = 0;
          const response = await postService.getPostsByCommunity(community.value.id, postsPerPage, offset);
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
          const response = await postService.getPostsByCommunity(
            community.value.id, 
            postsPerPage, 
            offset
          );
          posts.value = [...posts.value, ...response];
          currentPage.value++;
          hasMorePosts.value = response.length === postsPerPage;
        } catch (error) {
          console.error('Eroare la încărcarea mai multor postări:', error);
        } finally {
          loadingMore.value = false;
        }
      };
      
      const setFilter = (filter) => {
        if (currentFilter.value !== filter) {
          currentFilter.value = filter;
          loadPosts();
        }
      };
      
      const toggleMembership = async () => {
        if (!isAuthenticated.value) return;
        
        try {
          if (isMember.value) {
            await communityService.leaveCommunity(community.value.id);
            community.value.member_count--;
          } else {
            await communityService.joinCommunity(community.value.id);
            community.value.member_count++;
          }
          isMember.value = !isMember.value;
        } catch (error) {
          console.error('Eroare la schimbarea statutului de membru:', error);
        }
      };
      
      onMounted(() => {
        loadCommunity();
      });
      
      return {
        community,
        posts,
        loading,
        loadingMore,
        currentFilter,
        hasMorePosts,
        isAuthenticated,
        isMember,
        loadMorePosts,
        setFilter,
        toggleMembership
      };
    }
  };
  </script>
  
  <style scoped>
  .community-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .community-banner {
    background-color: #0079d3;
    color: white;
    padding: 30px 0;
    margin-bottom: 20px;
  }
  
  .community-banner-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .community-banner h1 {
    margin: 0 0 10px;
    font-size: 28px;
  }
  
  .community-banner p {
    margin: 0 0 15px;
    font-size: 16px;
    opacity: 0.9;
  }
  
  .community-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    font-size: 14px;
  }
  
  .join-btn {
    background-color: white;
    color: #0079d3;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .join-btn:hover {
    opacity: 0.9;
  }
  
  .join-btn.joined {
    background-color: transparent;
    border: 1px solid white;
    color: white;
  }
  
  .community-content {
    display: flex;
    gap: 24px;
  }
  
  .main-content {
    flex: 1;
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
  
  .loading-posts, .no-posts, .loading-community {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 40px;
    text-align: center;
    color: #787c7e;
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
  
  @media (max-width: 768px) {
    .community-content {
      flex-direction: column;
    }
  }
  </style>