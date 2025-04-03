<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ElHeader, ElMain, ElContainer } from 'element-plus';

const { t } = useI18n();
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>{{ t('common.toolbox') }}</h1>
        </router-link>
      </div>
    </el-header>
    
    <el-main class="app-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.app-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
  margin: 0;
}

.app-main {
  padding: 20px 0;
}
</style>