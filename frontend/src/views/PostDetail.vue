<!-- src/views/PostDetail.vue -->
<template>
    <div class="post-detail-container" v-if="post">
      <div class="post-section">
        <PostCard :post="post" :detailed="true" />
        
        <div class="comments-section">
          <h3 class="comments-title">Comentarii ({{ post.comment_count || 0 }})</h3>
          
          <CommentForm v-if="isAuthenticated" @comment-added="handleCommentAdded" :postId="post.id" />
          
          <div v-if="!isAuthenticated" class="login-to-comment">
            <p>Trebuie să fii <router-link to="/login">conectat</router-link> pentru a adăuga un comentariu.</p>
          </div>
          
          <div v-if="loadingComments" class="loading-comments">
            <p>Se încarcă comentariile...</p>
          </div>
          
          <div v-else-if="comments.length === 0" class="no-comments">
            <p>Nu există comentarii încă. Fii primul care comentează!</p>
          </div>
          
          <div v-else class="comments-list">
            <Comment 
              v-for="comment in comments" 
              :key="comment.id" 
              :comment="comment" 
              @reply-added="handleCommentAdded"
            />
          </div>
        </div>
      </div>
      
      <div class="sidebar">
        <div class="sidebar-section community-info" v-if="post.community">
          <h3>r/{{ post.community_name }}</h3>
          <p class="community-description">{{ post.community.description }}</p>
          <router-link :to="`/c/${post.community_name}`" class="view-community-btn">
            Vezi comunitatea
          </router-link>
        </div>
        
        <div class="sidebar-section rules" v-if="post.community && post.community.rules">
          <h3>Reguli comunitate</h3>
          <div class="rules-list">
            <div 
              v-for="(rule, index) in post.community.rules" 
              :key="index" 
              class="rule-item"
            >
              <div class="rule-number">{{ index + 1 }}</div>
              <div class="rule-content">{{ rule }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-post">
      <p>Se încarcă postarea...</p>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import PostCard from '../components/post/PostCard.vue';
  import Comment from '../components/post/Comment.vue';
  import CommentForm from '../components/post/CommentForm.vue';
  import postService from '../services/postService';
  import commentService from '../services/commentService';
  
  export default {
    name: 'PostDetail',
    components: {
      PostCard,
      Comment,
      CommentForm
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      const postId = computed(() => route.params.id);
      
      const post = ref(null);
      const comments = ref([]);
      const loadingPost = ref(true);
      const loadingComments = ref(true);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      
      const loadPost = async () => {
        try {
          loadingPost.value = true;
          const data = await postService.getPostById(postId.value);
          post.value = data;
        } catch (error) {
          console.error('Eroare la încărcarea postării:', error);
        } finally {
          loadingPost.value = false;
        }
      };
      
      const loadComments = async () => {
        try {
          loadingComments.value = true;
          const data = await commentService.getCommentsByPostId(postId.value);
          comments.value = organizeComments(data);
        } catch (error) {
          console.error('Eroare la încărcarea comentariilor:', error);
        } finally {
          loadingComments.value = false;
        }
      };
      
      // Organizează comentariile în structură arborescentă
      const organizeComments = (flatComments) => {
        const commentMap = {};
        const rootComments = [];
        
        // Creează un map de comentarii
        flatComments.forEach(comment => {
          comment.replies = [];
          commentMap[comment.id] = comment;
        });
        
        // Organizează comentariile în arbore
        flatComments.forEach(comment => {
          if (comment.parent_id) {
            if (commentMap[comment.parent_id]) {
              commentMap[comment.parent_id].replies.push(comment);
            }
          } else {
            rootComments.push(comment);
          }
        });
        
        return rootComments;
      };
      
      const handleCommentAdded = (newComment) => {
        loadComments(); // Reîncarcă toate comentariile pentru a actualiza structura
        if (post.value) {
          post.value.comment_count = (post.value.comment_count || 0) + 1;
        }
      };
      
      onMounted(() => {
        loadPost();
        loadComments();
      });
      
      return {
        post,
        comments,
        loadingPost,
        loadingComments,
        isAuthenticated,
        handleCommentAdded
      };
    }
  };
  </script>
  
  <style scoped>
  .post-detail-container {
    display: flex;
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
    gap: 24px;
  }
  
  .post-section {
    flex: 1;
  }
  
  .sidebar {
    width: 300px;
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    .post-detail-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      order: 2;
    }
  }
  
  .comments-section {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 16px;
    padding: 16px;
  }
  
  .comments-title {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    color: #1a1a1b;
    padding-bottom: 8px;
    border-bottom: 1px solid #edeff1;
  }
  
  .comments-list {
    margin-top: 24px;
  }
  
  .loading-comments, .no-comments, .loading-post {
    padding: 30px;
    text-align: center;
    color: #787c7e;
  }
  
  .login-to-comment {
    background-color: #f6f7f8;
    padding: 16px;
    border-radius: 4px;
    text-align: center;
    margin-bottom: 16px;
  }
  
  .login-to-comment a {
    color: #0079d3;
    text-decoration: none;
    font-weight: 600;
  }
  
  .login-to-comment a:hover {
    text-decoration: underline;
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
  
  .community-description {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  .view-community-btn {
    display: block;
    background-color: #0079d3;
    color: white;
    text-align: center;
    padding: 10px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
  }
  
  .view-community-btn:hover {
    background-color: #0064bd;
  }
  
  .rules-list {
    font-size: 14px;
  }
  
  .rule-item {
    display: flex;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #edeff1;
  }
  
  .rule-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .rule-number {
    font-weight: 600;
    margin-right: 12px;
    color: #0079d3;
  }
  
  .rule-content {
    flex: 1;
    line-height: 1.4;
  }
  </style>