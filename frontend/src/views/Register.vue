<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <div class="auth-form">
      <h1>Înregistrare</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Nume utilizator:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            placeholder="Alege un nume de utilizator"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Introdu email-ul tău"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Parolă:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Creează o parolă"
            minlength="6"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Se încarcă...' : 'Creează cont' }}
        </button>
      </form>
      
      <div class="auth-links">
        Ai deja cont? 
        <router-link to="/login">Conectează-te</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const username = ref('');
    const email = ref('');
    const password = ref('');
    
    const loading = computed(() => store.state.loading);
    const error = computed(() => store.state.error);
    
    const handleRegister = async () => {
      try {
        await store.dispatch('register', {
          username: username.value,
          email: email.value,
          password: password.value
        });
        router.push('/');
      } catch (err) {
        // Error este deja setat în store
      }
    };
    
    return {
      username,
      email,
      password,
      loading,
      error,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.auth-form {
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #1a1a1b;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #0079d3;
  color: white;
}

.btn-primary:hover {
  background-color: #0064bd;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #d93025;
  margin-bottom: 16px;
  font-size: 14px;
}

.auth-links {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.auth-links a {
  color: #0079d3;
  text-decoration: none;
  font-weight: 600;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>