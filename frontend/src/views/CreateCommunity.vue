<!-- src/views/CreateCommunity.vue -->
<template>
    <div class="create-community-page">
      <div class="page-container">
        <h1 class="page-title">Creează o comunitate nouă</h1>
        
        <div class="community-form-container">
          <div class="form-section">
            <label class="form-label">Nume comunitate</label>
            <div class="name-input-container">
              <span class="prefix">r/</span>
              <input 
                type="text"
                v-model="communityName"
                placeholder="nume_comunitate"
                class="form-input name-input"
                maxlength="50"
                @input="formatCommunityName"
              />
            </div>
            <div class="character-counter">{{ communityName.length }}/50</div>
            <div class="name-hint">
              Numele comunității trebuie să conțină doar litere, cifre sau underscore (_).
            </div>
          </div>
          
          <div class="form-section">
            <label class="form-label">Descriere</label>
            <textarea
              v-model="communityDescription"
              placeholder="Despre ce este comunitatea ta?"
              class="form-textarea"
              rows="4"
              maxlength="300"
            ></textarea>
            <div class="character-counter">{{ communityDescription.length }}/300</div>
          </div>
          
          <div class="form-section">
            <label class="form-label">Reguli comunitate (opțional)</label>
            <div v-for="(rule, index) in communityRules" :key="index" class="rule-input-container">
              <div class="rule-number">{{ index + 1 }}</div>
              <input 
                type="text"
                v-model="communityRules[index]"
                :placeholder="`Regula ${index + 1}`"
                class="form-input rule-input"
              />
              <button class="remove-rule-btn" @click="removeRule(index)" v-if="communityRules.length > 1">
                ✕
              </button>
            </div>
            
            <button 
              class="add-rule-btn" 
              @click="addRule" 
              v-if="communityRules.length < 10"
            >
              + Adaugă o regulă
            </button>
          </div>
          
          <div class="form-actions">
            <button 
              class="cancel-btn"
              @click="cancelCommunity"
            >
              Anulează
            </button>
            <button 
              class="submit-btn"
              :disabled="!isFormValid || isSubmitting"
              @click="submitCommunity"
            >
              Creează comunitate
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import communityService from '../services/communityService';
  
  export default {
    name: 'CreateCommunity',
    setup() {
      const router = useRouter();
      const store = useStore();
      
      const communityName = ref('');
      const communityDescription = ref('');
      const communityRules = ref(['']);
      const isSubmitting = ref(false);
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      
      const isFormValid = computed(() => {
        const namePattern = /^[a-zA-Z0-9_]+$/;
        return (
          communityName.value.trim() && 
          namePattern.test(communityName.value) &&
          communityDescription.value.trim()
        );
      });
      
      onMounted(() => {
        if (!isAuthenticated.value) {
          router.push('/login');
        }
      });
      
      const formatCommunityName = () => {
        // Remove spaces and special characters except underscore
        communityName.value = communityName.value.replace(/[^a-zA-Z0-9_]/g, '');
      };
      
      const addRule = () => {
        if (communityRules.value.length < 10) {
          communityRules.value.push('');
        }
      };
      
      const removeRule = (index) => {
        communityRules.value.splice(index, 1);
      };
      
      const submitCommunity = async () => {
        if (!isFormValid.value || isSubmitting.value) {
          return;
        }
        
        isSubmitting.value = true;
        
        try {
          // Filter out empty rules
          const filteredRules = communityRules.value.filter(rule => rule.trim());
          
          const communityData = {
            name: communityName.value.trim(),
            description: communityDescription.value.trim(),
            rules: filteredRules
          };
          
          const response = await communityService.createCommunity(communityData);
          
          // Redirect to the newly created community
          router.push(`/c/${response.community.name}`);
        } catch (error) {
          console.error('Error creating community:', error);
        } finally {
          isSubmitting.value = false;
        }
      };
      
      const cancelCommunity = () => {
        router.back();
      };
      
      return {
        communityName,
        communityDescription,
        communityRules,
        isSubmitting,
        isFormValid,
        formatCommunityName,
        addRule,
        removeRule,
        submitCommunity,
        cancelCommunity
      };
    }
  };
  </script>
  
  <style scoped>
  .create-community-page {
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
  
  .community-form-container {
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
  
  .name-input-container {
    display: flex;
    align-items: center;
  }
  
  .prefix {
    background-color: #f6f7f8;
    border: 1px solid #edeff1;
    border-right: none;
    border-radius: 4px 0 0 4px;
    padding: 10px;
    color: #1a1a1b;
    font-weight: 500;
  }
  
  .name-input {
    border-radius: 0 4px 4px 0;
    flex: 1;
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
    min-height: 80px;
  }
  
  .name-hint {
    font-size: 12px;
    color: #7c7c7c;
    margin-top: 4px;
  }
  
  .character-counter {
    text-align: right;
    font-size: 12px;
    color: #7c7c7c;
    margin-top: 4px;
  }
  
  .rule-input-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .rule-number {
    margin-right: 10px;
    font-weight: 600;
    color: #0079d3;
    width: 20px;
  }
  
  .rule-input {
    flex: 1;
  }
  
  .remove-rule-btn {
    background: none;
    border: none;
    color: #ff4500;
    cursor: pointer;
    font-size: 16px;
    padding: 0 8px;
  }
  
  .add-rule-btn {
    background: none;
    border: none;
    color: #0079d3;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 0;
    text-align: left;
  }
  
  .add-rule-btn:hover {
    text-decoration: underline;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
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
  </style>