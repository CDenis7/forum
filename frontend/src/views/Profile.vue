<!-- src/views/Profile.vue -->
<template>
    <div class="profile-container">
      <div v-if="loading" class="loading">
        <p>Se încarcă profilul...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="content-container">
        <div class="main-content">
          <user-profile 
            :user="currentUser" 
            :stats="userStats"
            :is-current-user="isCurrentUser"
          />
          
          <div class="content-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'posts' }"
              @click="activeTab = 'posts'"
            >
              Postări
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'comments' }"
              @click="activeTab = 'comments'"
            >
              Comentarii
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'communities' }"
              @click="activeTab = 'communities'"
            >
              Comunități
            </button>
          </div>
          
          <div class="tab-content">
            <div v-if="activeTab === 'posts'">
              <div v-if="userPosts.length === 0" class="empty-state">
                <p>Nu există postări.</p>
              </div>
              <post-card 
                v-else
                v-for="post in userPosts" 
                :key="post.id" 
                :post="post"
                class="post-item" 
              />
            </div>
            
            <div v-if="activeTab === 'comments'">
              <div v-if="userComments.length === 0" class="empty-state">
                <p>Nu există comentarii.</p>
              </div>
              <div 
                v-else
                v-for="comment in userComments" 
                :key="comment.id" 
                class="comment-item"
              >
                <div class="comment-context">
                  <router-link :to="`/post/${comment.post_id}`" class="post-link">
                    {{ comment.post_title }}
                  </router-link>
                  <span class="in-community">în</span>
                  <router-link :to="`/c/${comment.community_name}`" class="community-link">
                    r/{{ comment.community_name }}
                  </router-link>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-meta">
                  <span>{{ formatTime(comment.created_at) }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'communities'">
              <div v-if="userCommunities.length === 0" class="empty-state">
                <p>Nu este membru în nicio comunitate.</p>
              </div>
              <div 
                v-else
                class="communities-grid"
              >
                <community-card 
                  v-for="community in userCommunities" 
                  :key="community.id" 
                  :community="community"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar">
          <div v-if="isCurrentUser" class="sidebar-section account">
            <h3>Contul meu</h3>
            <div class="account-item">
              <div class="account-label">Email</div>
              <div class="account-value">{{ currentUser.email }}</div>
            </div>
            <div class="account-item">
              <div class="account-label">Membru din</div>
              <div class="account-value">{{ formatDate(currentUser.created_at) }}</div>
            </div>
            <button class="edit-profile-btn">Editează profilul</button>
          </div>
          
          <div class="sidebar-section trophies">
            <h3>Trofee</h3>
            <div v-if="userTrophies.length === 0" class="empty-trophies">
              <p>Nu există trofee încă.</p>
            </div>
            <div v-else class="trophies-list">
              <div v-for="trophy in userTrophies" :key="trophy.id" class="trophy-item">
                <div class="trophy-icon">🏆</div>
                <div class="trophy-info">
                  <div class="trophy-name">{{ trophy.name }}</div>
                  <div class="trophy-date">{{ formatDate(trophy.awarded_at) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import moment from 'moment';
  import 'moment/dist/locale/ro';
  import PostCard from '../components/post/PostCard.vue';
  import CommunityCard from '../components/community/CommunityCard.vue';
  import UserProfile from '../components/user/UserProfile.vue';
  import userService from '../services/userService';
  
  export default {
    name: 'Profile',
    components: {
      PostCard,
      CommunityCard,
      UserProfile
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const store = useStore();
      
      const loading = ref(true);
      const error = ref(null);
      const activeTab = ref('posts');
      
      const username = computed(() => route.params.username || store.getters.currentUser?.username);
      const currentUser = ref(null);
      const userStats = ref({
        post_count: 0,
        comment_count: 0,
        karma: 0
      });
      const userPosts = ref([]);
      const userComments = ref([]);
      const userCommunities = ref([]);
      const userTrophies = ref([]);
      
      const isCurrentUser = computed(() => {
        return store.getters.isAuthenticated && 
               store.getters.currentUser?.username === currentUser.value?.username;
      });
      
      const fetchUserProfile = async () => {
        try {
          loading.value = true;
          error.value = null;
          
          const userData = await userService.getUserByUsername(username.value);
          currentUser.value = userData.user;
          userStats.value = userData.stats;
          userPosts.value = userData.posts;
          userComments.value = userData.comments;
          userCommunities.value = userData.communities;
          userTrophies.value = userData.trophies || [];
          
        } catch (err) {
          console.error('Error fetching user profile:', err);
          error.value = 'Nu s-a putut încărca profilul utilizatorului.';
          
          if (err.response && err.response.status === 404) {
            router.push('/404');
          }
        } finally {
          loading.value = false;
        }
      };
      
      const formatTime = (timestamp) => {
        moment.locale('ro');
        return moment(timestamp).fromNow();
      };
      
      const formatDate = (timestamp) => {
        moment.locale('ro');
        return moment(timestamp).format('D MMMM YYYY');
      };
      
      onMounted(fetchUserProfile);
      
      return {
        currentUser,
        userStats,
        userPosts,
        userComments,
        userCommunities,
        userTrophies,
        isCurrentUser,
        loading,
        error,
        activeTab,
        formatTime,
        formatDate
      };
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading, .error-message {
    text-align: center;
    padding: 40px 0;
    color: #787c7e;
  }
  
  .content-container {
    display: flex;
    gap: 20px;
  }
  
  .main-content {
    flex: 1;
  }
  
  .content-tabs {
    display: flex;
    margin: 20px 0;
    border-bottom: 1px solid #edeff1;
  }
  
  .tab-btn {
    background: none;
    border: none;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #787c7e;
    cursor: pointer;
    position: relative;
  }
  
  .tab-btn.active {
    color: #0079d3;
  }
  
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: #0079d3;
  }
  
  .tab-btn:hover:not(.active) {
    color: #1a1a1b;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .post-item {
    margin-bottom: 16px;
  }
  
  .comment-item {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .comment-context {
    font-size: 12px;
    color: #787c7e;
    margin-bottom: 8px;
  }
  
  .post-link, .community-link {
    color: #0079d3;
    text-decoration: none;
    font-weight: 600;
  }
  
  .post-link:hover, .community-link:hover {
    text-decoration: underline;
  }
  
  .in-community {
    margin: 0 4px;
  }
  
  .comment-content {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  
  .comment-meta {
    font-size: 12px;
    color: #787c7e;
  }
  
  .communities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 0;
    color: #787c7e;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  
  .account-item {
    margin-bottom: 12px;
  }
  
  .account-label {
    font-size: 12px;
    color: #787c7e;
    margin-bottom: 4px;
  }
  
  .account-value {
    font-size: 14px;
  }
  
  .edit-profile-btn {
    width: 100%;
    background-color: #0079d3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 12px;
  }
  
  .edit-profile-btn:hover {
    background-color: #0064bd;
  }
  
  .trophies-list {
    font-size: 14px;
  }
  
  .trophy-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #edeff1;
  }
  
  .trophy-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .trophy-icon {
    font-size: 24px;
    margin-right: 12px;
  }
  
  .trophy-name {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .trophy-date {
    font-size: 12px;
    color: #787c7e;
  }
  
  .empty-trophies {
    text-align: center;
    padding: 12px 0;
    color: #787c7e;
  }
  
  @media (max-width: 768px) {
    .content-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
    }
    
    .communities-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
  </style>