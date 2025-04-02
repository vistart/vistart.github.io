# 工具集合开发文档

本文档描述了如何在此工具集合中添加、修改工具，以及工具间的通信机制。

## 目录

1. [项目结构](#项目结构)
2. [添加新工具](#添加新工具)
3. [修改现有工具](#修改现有工具)
4. [工具间通信](#工具间通信)
5. [国际化支持](#国际化支持)

## 项目结构

项目采用Vue3 + TypeScript开发，使用Element Plus作为UI组件库，Vue I18n处理国际化。主要目录结构如下：

```
src/
├── assets/         # 静态资源
├── components/     # 通用组件
├── locales/        # 国际化文件
├── router/         # 路由配置
├── tools/          # 工具集合
│   ├── common/     # 工具公共组件和类型
│   ├── credit-card-apr/  # 信用卡年化利率计算器
│   └── ... (其他工具)
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 添加新工具

要添加新工具，请按照以下步骤操作：

1. 在`src/tools/`目录下创建新的工具目录，例如`src/tools/new-tool/`
2. 创建工具的主组件，例如`src/tools/new-tool/NewTool.vue`
3. 创建工具的配置文件`src/tools/new-tool/config.ts`，包含工具的元数据
4. 在`src/tools/index.ts`中注册新工具
5. 为工具添加国际化支持，在`src/locales/`下的语言文件中添加相应翻译

### 工具配置示例

```typescript
// src/tools/new-tool/config.ts
import { ToolConfig } from '../types';

const config: ToolConfig = {
  id: 'new-tool',
  nameKey: 'tools.newTool.name',
  descriptionKey: 'tools.newTool.description',
  icon: 'Calculator', // Element Plus图标名称
  component: () => import('./NewTool.vue'),
};

export default config;
```

## 修改现有工具

修改现有工具时，请注意以下几点：

1. 保持工具的ID不变，以确保路由和国际化正常工作
2. 更新工具的版本号（如果适用）
3. 更新相关的国际化文本
4. 如果修改了工具的API或事件，请更新相关文档

## 工具间通信

工具间通信可以通过以下几种方式实现：

### 1. 通过Vuex/Pinia状态管理

对于需要在多个工具间共享的状态，可以使用Vuex或Pinia进行状态管理。

### 2. 通过事件总线

可以使用Vue的事件总线机制进行工具间的通信：

```typescript
// 在发送方工具中
import { eventBus } from '@/utils/eventBus';

// 发送事件
eventBus.emit('tool-event', { data: 'some data' });

// 在接收方工具中
import { eventBus } from '@/utils/eventBus';

// 监听事件
eventBus.on('tool-event', (data) => {
  console.log(data);
});
```

### 3. 通过URL参数

对于需要通过URL分享的工具状态，可以使用URL参数：

```typescript
// 设置URL参数
const setUrlParams = (params: Record<string, string>) => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.pushState({}, '', url.toString());
};

// 获取URL参数
const getUrlParam = (key: string) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
};
```

## 国际化支持

项目使用Vue I18n进行国际化支持。添加新工具时，需要在各语言文件中添加相应的翻译：

```typescript
// src/locales/zh-CN.ts
export default {
  tools: {
    newTool: {
      name: '新工具名称',
      description: '新工具描述',
      // 工具特定的文本...
    },
  },
};
```

工具内部使用翻译的方式：

```vue
<template>
  <div>
    <h1>{{ $t('tools.newTool.name') }}</h1>
    <p>{{ $t('tools.newTool.description') }}</p>
  </div>
</template>
```