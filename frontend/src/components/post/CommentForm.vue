<!-- src/components/post/CommentForm.vue -->
<template>
    <div class="comment-form">
      <div class="form-header" v-if="parentId">
        <span>Răspunde la comentariu</span>
        <button class="cancel-btn" @click="$emit('cancel')">Anulează</button>
      </div>
      
      <textarea 
        v-model="commentContent" 
        placeholder="Ce părere ai?" 
        rows="4"
        class="comment-textarea"
        @input="resizeTextarea"
        ref="textarea"
      ></textarea>
      
      <div class="form-actions">
        <button 
          class="submit-btn" 
          :disabled="!commentContent.trim() || isSubmitting"
          @click="submitComment"
        >
          {{ parentId ? 'Răspunde' : 'Comentează' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import commentService from '../../services/commentService';
  
  export default {
    name: 'CommentForm',
    props: {
      postId: {
        type: [Number, String],
        required: true
      },
      parentId: {
        type: [Number, String],
        default: null
      }
    },
    emits: ['comment-added', 'cancel'],
    setup(props, { emit }) {
      const store = useStore();
      const commentContent = ref('');
      const isSubmitting = ref(false);
      const textarea = ref(null);
      
      const resizeTextarea = () => {
        if (textarea.value) {
          textarea.value.style.height = 'auto';
          textarea.value.style.height = `${textarea.value.scrollHeight}px`;
        }
      };
      
      const submitComment = async () => {
        if (!commentContent.value.trim() || isSubmitting.value) {
          return;
        }
        
        isSubmitting.value = true;
        
        try {
          const commentData = {
            post_id: props.postId,
            parent_id: props.parentId,
            content: commentContent.value.trim()
          };
          
          await commentService.createComment(commentData);
          commentContent.value = '';
          
          if (textarea.value) {
            textarea.value.style.height = 'auto';
          }
          
          emit('comment-added');
        } catch (error) {
          console.error('Error adding comment:', error);
        } finally {
          isSubmitting.value = false;
        }
      };
      
      return {
        commentContent,
        isSubmitting,
        textarea,
        resizeTextarea,
        submitComment
      };
    }
  };
  </script>
  
  <style scoped>
  .comment-form {
    background-color: white;
    border: 1px solid #edeff1;
    border-radius: 4px;
    padding: 12px;
  }
  
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #1a1a1b;
  }
  
  .cancel-btn {
    background: none;
    border: none;
    color: #0079d3;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    text-decoration: underline;
  }
  
  .comment-textarea {
    width: 100%;
    min-height: 80px;
    padding: 8px;
    border: 1px solid #edeff1;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  
  .comment-textarea:focus {
    outline: none;
    border-color: #0079d3;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .submit-btn {
    background-color: #0079d3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background-color: #0064bd;
  }
  
  .submit-btn:disabled {
    background-color: #7fbce9;
    cursor: not-allowed;
  }
  </style>