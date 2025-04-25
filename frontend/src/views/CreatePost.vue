<!-- src/views/CreatePost.vue -->
<template>
    <div class="create-post-page">
      <div class="page-container">
        <h1 class="page-title">Creează o postare nouă</h1>
        
        <div class="post-form-container">
          <div class="form-section">
            <label class="form-label">Comunitate</label>
            <div class="community-select">
              <select v-model="selectedCommunity" required class="form-input">
                <option value="" disabled>Selectează o comunitate</option>
                <option 
                  v-for="community in communities" 
                  :key="community.id" 
                  :value="community.name"
                >
                  r/{{ community.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-section">
            <label class="form-label">Titlu</label>
            <input 
              type="text"
              v-model="postTitle"
              placeholder="Titlul postării tale"
              class="form-input"
              maxlength="300"
            />
            <div class="character-counter">{{ postTitle.length }}/300</div>
          </div>
          
          <div class="form-section">
            <label class="form-label">Conținut</label>
            <textarea
              v-model="postContent"
              placeholder="Text (opțional)"
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button 
              class="cancel-btn"
              @click="cancelPost"
            >
              Anulează
            </button>
            <button 
              class="submit-btn"
              :disabled="!isFormValid || isSubmitting"
              @click="submitPost"
            >
              Postează
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import postService from '../services/postService';
  import communityService from '../services/communityService';
  
  export default {
    name: 'CreatePost',
    setup() {
      const router = useRouter();
      const route = useRoute();
      const store = useStore();
      
      const communities = ref([]);
      const selectedCommunity = ref('');
      const postTitle = ref('');
      const postContent = ref('');
      const isSubmitting = ref(false);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      
      const isFormValid = computed(() => {
        return selectedCommunity.value && postTitle.value.trim();
      });
      
      onMounted(async () => {
        if (!isAuthenticated.value) {
          router.push('/login');
          return;
        }
        
        try {
          // Get pre-selected community from URL query parameter if exists
          if (route.query.community) {
            selectedCommunity.value = route.query.community;
          }
          
          // Load communities for select dropdown
          const response = await communityService.getAllCommunities();
          communities.value = response.communities || [];
        } catch (error) {
          console.error('Error loading communities:', error);
        }
      });
      
      const submitPost = async () => {
        if (!isFormValid.value || isSubmitting.value) {
          return;
        }
        
        isSubmitting.value = true;
        
        try {
          const postData = {
            community_name: selectedCommunity.value,
            title: postTitle.value.trim(),
            content: postContent.value.trim() || null
          };
          
          const response = await postService.createPost(postData);
          
          // Redirect to the newly created post
          router.push(`/post/${response.post.id}`);
        } catch (error) {
          console.error('Error creating post:', error);
        } finally {
          isSubmitting.value = false;
        }
      };
      
      const cancelPost = () => {
        router.back();
      };
      
      return {
        communities,
        selectedCommunity,
        postTitle,
        postContent,
        isSubmitting,
        isFormValid,
        submitPost,
        cancelPost
      };
    }
  };
  </script>
  
  <style scoped>
  .create-post-page {
    background-color: #dae0e6;
    min-height: calc(100vh - 60px);
    padding: 20px 0;
  }
  
  .page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .page-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 20px;
    color: #1a1a1b;
  }
  
  .post-form-container {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .form-section {
    margin-bottom: 20px;
  }
  
  .form-label {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #1a1a1b;
  }
  
  .form-input, .form-textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #edeff1;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
  }
  
  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #0079d3;
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .character-counter {
    text-align: right;
    font-size: 12px;
    color: #7c7c7c;
    margin-top: 4px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .cancel-btn {
    background-color: transparent;
    color: #0079d3;
    border: 1px solid #0079d3;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background-color: rgba(0, 121, 211, 0.05);
  }
  
  .submit-btn {
    background-color: #0079d3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
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
  
  .community-select select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231A1A1B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
  }
  </style>