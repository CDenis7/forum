// src/store/index.js
import { createStore } from 'vuex';
import authService from '../services/authService';

export default createStore({
  state: {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    posts: [],
    communities: [],
    currentPost: null,
    currentCommunity: null,
    loading: false,
    error: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_COMMUNITIES(state, communities) {
      state.communities = communities;
    },
    SET_CURRENT_POST(state, post) {
      state.currentPost = post;
    },
    SET_CURRENT_COMMUNITY(state, community) {
      state.currentCommunity = community;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        commit('SET_LOADING', true);
        const data = await authService.login(email, password);
        commit('SET_USER', data.user);
        commit('SET_ERROR', null);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Eroare la autentificare');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async register({ commit }, { username, email, password }) {
      try {
        commit('SET_LOADING', true);
        const data = await authService.register(username, email, password);
        commit('SET_USER', data.user);
        commit('SET_ERROR', null);
        return data;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Eroare la înregistrare');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    logout({ commit }) {
      authService.logout();
      commit('SET_USER', null);
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  }
});