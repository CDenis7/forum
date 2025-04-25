// src/services/postService.js
import api from './api';

export default {
  async getAllPosts(limit = 10, offset = 0) {
    try {
      const response = await api.get(`/posts?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async getPostById(id) {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async createPost(postData) {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async votePost(postId, voteType) {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { voteType });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

// src/services/communityService.js
import api from './api';

export default {
  async getAllCommunities(limit = 10, offset = 0) {
    try {
      const response = await api.get(`/communities?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async getCommunityByName(name) {
    try {
      const response = await api.get(`/communities/name/${name}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async createCommunity(communityData) {
    try {
      const response = await api.post('/communities', communityData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async joinCommunity(communityId) {
    try {
      const response = await api.post(`/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async leaveCommunity(communityId) {
    try {
      const response = await api.delete(`/communities/${communityId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

// src/services/commentService.js
import api from './api';

export default {
  async getCommentsByPostId(postId) {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async createComment(commentData) {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async voteComment(commentId, voteType) {
    try {
      const response = await api.post(`/comments/${commentId}/vote`, { voteType });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};