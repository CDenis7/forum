<!-- src/components/community/SidebarCommunity.vue -->
<template>
    <div class="sidebar">
      <div class="sidebar-section about-community">
        <h3>Despre comunitate</h3>
        <p class="community-description">{{ community.description }}</p>
        
        <div class="community-info">
          <div class="info-item">
            <div class="info-value">{{ community.member_count }}</div>
            <div class="info-label">Membri</div>
          </div>
          <div class="info-item">
            <div class="info-value">{{ community.post_count }}</div>
            <div class="info-label">Postări</div>
          </div>
        </div>
        
        <div class="community-date">
          <div class="date-icon">📅</div>
          <div>Creat {{ formatDate(community.created_at) }}</div>
        </div>
        
        <router-link :to="{ name: 'CreatePost', query: { community: community.name }}" class="sidebar-btn">
          Creează postare
        </router-link>
      </div>
      
      <div class="sidebar-section rules" v-if="community.rules && community.rules.length > 0">
        <h3>Reguli comunitate</h3>
        <div class="rules-list">
          <div v-for="(rule, index) in community.rules" :key="index" class="rule-item">
            <div class="rule-number">{{ index + 1 }}</div>
            <div class="rule-content">{{ rule }}</div>
          </div>
        </div>
      </div>
      
      <div class="sidebar-section moderators" v-if="community.moderators && community.moderators.length > 0">
        <h3>Moderatori</h3>
        <ul class="moderators-list">
          <li v-for="mod in community.moderators" :key="mod.id">
            <router-link :to="`/user/${mod.username}`">
              u/{{ mod.username }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import moment from 'moment';
  import 'moment/dist/locale/ro';
  
  export default defineComponent({
    name: 'SidebarCommunity',
    props: {
      community: {
        type: Object,
        required: true
      }
    },
    setup() {
      const formatDate = (date) => {
        moment.locale('ro');
        return moment(date).format('D MMMM YYYY');
      };
      
      return {
        formatDate
      };
    }
  });
  </script>
  
  <style scoped>
  .sidebar {
    width: 300px;
    flex-shrink: 0;
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
    margin-bottom: 16px;
    font-size: 14px;
    line-height: 1.5;
    color: #1a1a1b;
  }
  
  .community-info {
    display: flex;
    margin-bottom: 16px;
    border-bottom: 1px solid #edeff1;
    padding-bottom: 12px;
  }
  
  .info-item {
    flex: 1;
  }
  
  .info-value {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1b;
  }
  
  .info-label {
    font-size: 12px;
    color: #7c7c7c;
  }
  
  .community-date {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #7c7c7c;
    margin-bottom: 16px;
  }
  
  .date-icon {
    margin-right: 8px;
    font-size: 16px;
  }
  
  .sidebar-btn {
    display: block;
    background-color: #0079d3;
    color: white;
    text-align: center;
    padding: 10px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 12px;
  }
  
  .sidebar-btn:hover {
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
  
  .moderators-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .moderators-list li {
    margin-bottom: 8px;
  }
  
  .moderators-list a {
    color: #0079d3;
    text-decoration: none;
    font-size: 14px;
  }
  
  .moderators-list a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
    }
  }
  </style>