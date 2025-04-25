<!-- src/components/post/Comment.vue -->
<template>
    <div class="comment" :class="{ 'nested-comment': isReply }">
      <div class="comment-vote-controls">
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
      
      <div class="comment-content">
        <div class="comment-meta">
          <span class="comment-author">u/{{ comment.username }}</span>
          <span class="meta-dot">•</span>
          <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
        </div>
        
        <div class="comment-text">
          <p>{{ comment.content }}</p>
        </div>
        
        <div class="comment-actions">
          <button class="action-btn reply-btn" @click="toggleReplyForm">
            Răspunde
          </button>
        </div>
        
        <div v-if="showReplyForm" class="reply-form-container">
          <comment-form 
            :post-id="comment.post_id" 
            :parent-id="comment.id"
            @comment-added="handleCommentAdded"
          />
        </div>
        
        <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
          <comment 
            v-for="reply in comment.replies" 
            :key="reply.id" 
            :comment="reply"
            :is-reply="true"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import moment from 'moment';
  import 'moment/dist/locale/ro';
  import CommentForm from './CommentForm.vue';
  import commentService from '../../services/commentService';
  
  export default {
    name: 'Comment',
    components: {
      CommentForm
    },
    props: {
      comment: {
        type: Object,
        required: true
      },
      isReply: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const store = useStore();
      const userVote = ref(props.comment.user_vote || 0);
      const showReplyForm = ref(false);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      
      const voteScore = computed(() => {
        return (props.comment.upvotes || 0) - (props.comment.downvotes || 0);
      });
      
      const formatTime = (timestamp) => {
        moment.locale('ro');
        return moment(timestamp).fromNow();
      };
      
      const toggleReplyForm = () => {
        if (!isAuthenticated.value) {
          // Redirect to login or show login modal
          return;
        }
        showReplyForm.value = !showReplyForm.value;
      };
      
      const handleCommentAdded = () => {
        showReplyForm.value = false;
        // You might want to emit an event to refresh comments
      };
      
      const handleVote = async (voteType) => {
        if (!isAuthenticated.value) {
          // Redirect to login or show login modal
          return;
        }
        
        try {
          // If user already voted the same way, cancel the vote
          const finalVoteType = userVote.value === voteType ? 0 : voteType;
          
          await commentService.voteComment(props.comment.id, finalVoteType);
          userVote.value = finalVoteType;
        } catch (error) {
          console.error('Error voting on comment:', error);
        }
      };
      
      return {
        userVote,
        voteScore,
        formatTime,
        showReplyForm,
        toggleReplyForm,
        handleCommentAdded,
        handleVote,
        isAuthenticated
      };
    }
  };
  </script>
  
  <style scoped>
  .comment {
    display: flex;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #edeff1;
  }
  
  .nested-comment {
    margin-left: 24px;
    padding-left: 16px;
    border-left: 2px solid #edeff1;
    border-bottom: none;
  }
  
  .comment-vote-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 12px;
    min-width: 30px;
  }
  
  .vote-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #878a8c;
    padding: 2px;
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
    margin: 2px 0;
  }
  
  .comment-content {
    flex-grow: 1;
  }
  
  .comment-meta {
    font-size: 12px;
    color: #787c7e;
    margin-bottom: 4px;
  }
  
  .comment-author {
    font-weight: 600;
    color: #1a1a1b;
  }
  
  .meta-dot {
    margin: 0 4px;
  }
  
  .comment-text {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  
  .comment-text p {
    margin: 0;
  }
  
  .comment-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .action-btn {
    background: none;
    border: none;
    color: #878a8c;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 0;
    cursor: pointer;
  }
  
  .action-btn:hover {
    color: #1a1a1b;
  }
  
  .reply-form-container {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  
  .comment-replies {
    margin-top: 12px;
  }
  </style>