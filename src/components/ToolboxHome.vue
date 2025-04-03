<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getAllTools } from '../tools';
import { ElCard, ElRow, ElCol, ElIcon } from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const { t } = useI18n();
const tools = getAllTools();

// 动态获取Element Plus图标
const getIcon = (iconName: string) => {
  return ElementPlusIconsVue[iconName as keyof typeof ElementPlusIconsVue];
};
</script>

<template>
  <div class="toolbox-home">
    <div class="header">
      <h1>{{ t('pages.home.title') }}</h1>
      <p>{{ t('pages.home.subtitle') }}</p>
    </div>
    
    <el-row :gutter="20">
      <el-col 
        v-for="tool in tools" 
        :key="tool.id" 
        :xs="24" 
        :sm="12" 
        :md="8" 
        :lg="6"
      >
        <router-link :to="`/tool/${tool.id}`" class="tool-link">
          <el-card class="tool-card" shadow="hover">
            <div class="tool-icon">
              <el-icon>
                <component :is="getIcon(tool.icon)" />
              </el-icon>
            </div>
            <div class="tool-info">
              <h3>{{ t(tool.nameKey) }}</h3>
              <p>{{ t(tool.descriptionKey) }}</p>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.toolbox-home {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.header p {
  font-size: 16px;
  color: #606266;
}

.tool-link {
  text-decoration: none;
  display: block;
  margin-bottom: 20px;
}

.tool-card {
  height: 100%;
  transition: transform 0.3s;
  border-radius: 8px;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.tool-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.tool-icon .el-icon {
  font-size: 48px;
  color: #409EFF;
}

.tool-info {
  text-align: center;
}

.tool-info h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #303133;
}

.tool-info p {
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>