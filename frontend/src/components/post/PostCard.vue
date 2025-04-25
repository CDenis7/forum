<!-- src/components/post/PostCard.vue -->
<template>
    <div class="post-card">
      <div class="vote-controls">
        <button 
          class="vote-btn upvote" 
          :class="{ active: userVote === 1 }"
          @click="handleVote(1)"
        >
          ▲
        </button>
        <span class="vote-count">{{ voteScore }}</span>
        <button 
          class="vote-btn downvote" 
          :class="{ active: userVote === -1 }"
          @click="handleVote(-1)"
        >
          ▼
        </button>
      </div>
      
      <div class="post-content">
        <div class="post-meta">
          <router-link :to="`/c/${post.community_name}`" class="community-link">
            r/{{ post.community_name }}
          </router-link>
          <span class="meta-dot">•</span>
          <span class="post-author">Postat de u/{{ post.username }}</span>
          <span class="meta-dot">•</span>
          <span class="post-time">{{ formatTime(post.created_at) }}</span>
        </div>
        
        <router-link :to="`/post/${post.id}`" class="post-title-link">
          <h2 class="post-title">{{ post.title }}</h2>
        </router-link>
        
        <div class="post-text" v-if="post.content">
          <p v-if="shouldTruncate" class="truncated">
            {{ truncatedContent }}
            <button @click="expandContent" class="read-more">Citește mai mult</button>
          </p>
          <p v-else>{{ post.content }}</p>
        </div>
        
        <div class="post-actions">
          <router-link :to="`/post/${post.id}`" class="action-btn">
            <i class="icon-comment"></i>
            {{ post.comment_count || 0 }} comentarii
          </router-link>
          <button class="action-btn">
            <i class="icon-share"></i>
            Distribuie
          </button>
          <button class="action-btn">
            <i class="icon-save"></i>
            Salvează
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import moment from 'moment';
  import 'moment/dist/locale/ro';
  import postService from '../../services/postService';
  
  export default {
    name: 'PostCard',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const store = useStore();
      const userVote = ref(0); // 0 = niciun vot, 1 = upvote, -1 = downvote
      const contentExpanded = ref(false);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      
      const voteScore = computed(() => {
        return props.post.upvotes - props.post.downvotes;
      });
      
      const truncatedContent = computed(() => {
        if (props.post.content && props.post.content.length > 250) {
          return props.post.content.substring(0, 250) + '...';
        }
        return props.post.content;
      });
      
      const shouldTruncate = computed(() => {
        return !contentExpanded.value && props.post.content && props.post.content.length > 250;
      });
      
      const expandContent = () => {
        contentExpanded.value = true;
      };
      
      const formatTime = (timestamp) => {
        moment.locale('ro');
        return moment(timestamp).fromNow();
      };
      
      const handleVote = async (voteType) => {
        if (!isAuthenticated.value) {
          // Redirecționează către login
          return;
        }
        
        try {
          // Dacă utilizatorul a dat același vot deja, anulăm votul
          const finalVoteType = userVote.value === voteType ? 0 : voteType;
          
          await postService.votePost(props.post.id, finalVoteType);
          userVote.value = finalVoteType;
        } catch (error) {
          console.error('Eroare la vot:', error);
        }
      };
      
      return {
        userVote,
        voteScore,
        truncatedContent,
        shouldTruncate,
        expandContent,
        formatTime,
        handleVote,
        isAuthenticated
      };
    }
  };
  </script>
  
  <style scoped>
  .post-card {
    display: flex;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .vote-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    background-color: #f8f9fa;
    min-width: 40px;
  }
  
  .vote-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #878a8c;
    padding: 4px;
  }
  
  .vote-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }
  
  .vote-btn.upvote.active {
    color: #ff4500;
  }
  
  .vote-btn.downvote.active {
    color: #7193ff;
  }
  
  .vote-count {
    font-weight: 600;
    font-size: 12px;
    color: #1a1a1b;
    margin: 4px 0;
  }
  
  .post-content {
    padding: 12px;
    flex-grow: 1;
  }
  
  .post-meta {
    font-size: 12px;
    color: #787c7e;
    margin-bottom: 8px;
  }
  
  .community-link {
    color: #1c1c1c;
    font-weight: 600;
    text-decoration: none;
  }
  
  .community-link:hover {
    text-decoration: underline;
  }
  
  .meta-dot {
    margin: 0 4px;
  }
  
  .post-title {
    margin: 0 0 8px;
    font-size: 18px;
    color: #222;
    line-height: 1.3;
  }
  
  .post-title-link {
    text-decoration: none;
    color: inherit;
  }
  
  .post-title-link:hover .post-title {
    color: #1a1a1b;
    text-decoration: underline;
  }
  
  .post-text {
    margin-bottom: 12px;
    color: #1a1a1b;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .truncated {
    position: relative;
  }
  
  .read-more {
    color: #0079d3;
    background: none;
    border: none;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-left: 5px;
  }
  
  .read-more:hover {
    text-decoration: underline;
  }
  
  .post-actions {
    display: flex;
    gap: 16px;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #878a8c;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 0;
    cursor: pointer;
    text-decoration: none;
  }
  
  .action-btn:hover {
    color: #1a1a1b;
  }
  
  .icon-comment, .icon-share, .icon-save {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  
  .icon-comment::before {
    content: "💬";
  }
  
  .icon-share::before {
    content: "↗️";
  }
  
  .icon-save::before {
    content: "🔖";
  }
  </style>