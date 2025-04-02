<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getToolById } from '../tools';
import { ElButton, ElIcon, ElAlert } from 'element-plus';
import { ArrowLeft, Loading } from '@element-plus/icons-vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 获取工具ID
const toolId = computed(() => route.params.id as string);

// 获取工具配置
const tool = computed(() => getToolById(toolId.value));

// 动态组件
const ToolComponent = ref(null);
const isLoading = ref(true);
const loadError = ref(false);

// 监听工具变化并加载组件
watchEffect(async () => {
  if (!tool.value) {
    ToolComponent.value = null;
    isLoading.value = false;
    return;
  }
  
  try {
    isLoading.value = true;
    loadError.value = false;
    // 等待异步组件加载完成
    const module = await tool.value.component();
    ToolComponent.value = module.default;
  } catch (error) {
    console.error('Failed to load tool component:', error);
    loadError.value = true;
  } finally {
    isLoading.value = false;
  }
});

// 返回首页
const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="tool-detail">
    <div class="tool-header">
      <el-button @click="goBack" class="back-button" text>
        <el-icon><ArrowLeft /></el-icon>
        {{ t('common.back') }}
      </el-button>
      <h1 v-if="tool">{{ t(tool.nameKey) }}</h1>
    </div>
    
    <div class="tool-container">
      <!-- 加载中状态 -->
      <div v-if="isLoading" class="tool-loading">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <p>{{ t('common.loading') }}</p>
      </div>
      
      <!-- 加载错误 -->
      <div v-else-if="loadError" class="tool-error">
        <el-alert
          type="error"
          :title="t('common.loadError')"
          :description="t('common.tryAgainLater')"
          show-icon
        />
        <el-button class="retry-button" type="primary" @click="goBack">
          {{ t('common.back') }}
        </el-button>
      </div>
      
      <!-- 工具组件 -->
      <component v-else-if="ToolComponent" :is="ToolComponent" />
      
      <!-- 未找到工具 -->
      <div v-else class="tool-not-found">
        <h2>{{ t('pages.notFound.title') }}</h2>
        <p>{{ t('pages.notFound.message') }}</p>
        <el-button type="primary" @click="goBack">{{ t('pages.notFound.backHome') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-button {
  margin-right: 16px;
  display: flex;
  align-items: center;
}

.back-button .el-icon {
  margin-right: 4px;
}

.tool-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.tool-container {
  background-color: #fff;
  border-radius: 8px;
  min-height: 400px;
}

.tool-loading,
.tool-error,
.tool-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-icon {
  font-size: 32px;
  color: #409EFF;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.tool-loading p {
  margin-top: 16px;
  font-size: 16px;
  color: #606266;
}

.tool-error {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.retry-button {
  margin-top: 24px;
}

.tool-not-found h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #303133;
}

.tool-not-found p {
  font-size: 16px;
  margin-bottom: 24px;
  color: #606266;
}
</style>