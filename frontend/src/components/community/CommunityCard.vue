<!-- src/components/community/CommunityCard.vue -->
<template>
    <router-link :to="`/c/${community.name}`" class="community-card">
      <div class="community-header">
        <div class="community-icon">r/</div>
        <h3 class="community-name">{{ community.name }}</h3>
      </div>
      
      <div class="community-stats">
        <div class="stat-item">
          <div class="stat-value">{{ community.member_count }}</div>
          <div class="stat-label">membri</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ community.post_count }}</div>
          <div class="stat-label">postări</div>
        </div>
      </div>
      
      <div class="community-description">
        {{ truncatedDescription }}
      </div>
      
      <div v-if="isJoined !== null" class="community-action">
        <button 
          class="join-btn" 
          :class="{ 'joined': isJoined }" 
          @click.prevent="toggleJoin"
        >
          {{ isJoined ? 'Membru' : 'Alătură-te' }}
        </button>
      </div>
    </router-link>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import communityService from '../../services/communityService';
  
  export default {
    name: 'CommunityCard',
    props: {
      community: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const store = useStore();
      const isJoined = ref(props.community.is_member || null);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      
      const truncatedDescription = computed(() => {
        if (props.community.description && props.community.description.length > 100) {
          return props.community.description.substring(0, 100) + '...';
        }
        return props.community.description;
      });
      
      const toggleJoin = async () => {
        if (!isAuthenticated.value) {
          // Redirect to login
          return;
        }
        
        try {
          if (isJoined.value) {
            await communityService.leaveCommunity(props.community.id);
            isJoined.value = false;
          } else {
            await communityService.joinCommunity(props.community.id);
            isJoined.value = true;
          }
        } catch (error) {
          console.error('Error toggling community membership:', error);
        }
      };
      
      return {
        isJoined,
        truncatedDescription,
        toggleJoin,
        isAuthenticated
      };
    }
  };
  </script>
  
  <style scoped>
  .community-card {
    display: block;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s ease-in-out;
  }
  
  .community-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .community-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .community-icon {
    width: 30px;
    height: 30px;
    background-color: #0079d3;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 8px;
    font-size: 16px;
  }
  
  .community-name {
    font-size: 16px;
    color: #1a1a1b;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .community-stats {
    display: flex;
    margin-bottom: 12px;
    border-bottom: 1px solid #edeff1;
    padding-bottom: 12px;
  }
  
  .stat-item {
    flex: 1;
  }
  
  .stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1b;
  }
  
  .stat-label {
    font-size: 12px;
    color: #7c7c7c;
  }
  
  .community-description {
    font-size: 12px;
    line-height: 1.4;
    color: #1a1a1b;
    margin-bottom: 12px;
    height: 50px;
    overflow: hidden;
  }
  
  .community-action {
    text-align: center;
  }
  
  .join-btn {
    width: 100%;
    background-color: #0079d3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 0;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .join-btn.joined {
    background-color: transparent;
    color: #0079d3;
    border: 1px solid #0079d3;
  }
  
  .join-btn:hover {
    opacity: 0.9;
  }
  </style>