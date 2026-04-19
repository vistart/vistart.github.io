## 转换方案

采用的是 **"React-in-HTML"** 方案，即：

```
JSX 源码（不变）
    ↓
包裹在 HTML 的 <script type="text/babel"> 标签里
    ↓
由浏览器端 Babel standalone 实时编译执行
```

**改动只有三处：**

| 修改点 | 原 JSX | HTML 中替换为 |
|---|---|---|
| 模块导入 | `import { useState... } from "react"` | 删除，改为解构 `const { useState... } = React;` |
| 导出声明 | `export default function App()` | 改为普通 `function App()` |
| 挂载入口 | 无（由框架处理） | 添加 `ReactDOM.createRoot(...).render(<App />)` |

**额外注意事项：**

- 如果 JSX 使用 Tailwind CSS 类（如 `min-h-screen`, `flex`, `grid`, `px-6` 等），必须引入 Tailwind CDN：
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```

---

## 通用 JSX → HTML 转换规则

### 方案一：React-in-HTML（本次方案）✅ 推荐用于复杂组件

**适用场景：** 组件逻辑复杂、含大量 state/hooks/动画，追求零修改。

```html
<!-- 引入三个 CDN -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- 用 text/babel 包裹 JSX -->
<script type="text/babel" data-presets="react">
  const { useState, useEffect } = React; // hooks 从全局 React 取
  function App() { ... }
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>
```

**注意：** Babel standalone 在浏览器中实时编译，首次加载约慢 1-2 秒，适合工具/演示页面，不适合生产环境高流量站点。

---

### 方案二：预编译为纯 JS（生产环境推荐）

```bash
# 用 Vite 或 esbuild 打包成单文件
npx vite build --outDir dist
# 或
npx esbuild App.jsx --bundle --outfile=out.js
```

产物是纯 JS，不依赖运行时编译，性能最佳。

---

### 方案三：完全重写为原生 HTML/JS（无 React 依赖）

**适用场景：** 组件逻辑简单，想彻底去掉 React 依赖。

| React 概念 | 原生等价写法 |
|---|---|
| `useState(val)` | `let state = val; function setState(v){ state=v; render(); }` |
| `useEffect(() => {...}, [])` | `document.addEventListener('DOMContentLoaded', ...)` |
| JSX `<div style={{color:'red'}}>` | `el.style.color = 'red'` 或模板字符串 |
| 组件函数返回 JSX | 函数返回 HTML 字符串，用 `innerHTML` 挂载 |
| `key` prop | 手动管理 DOM 节点 |
| `onClick={handler}` | `onclick="handler()"` 或 `addEventListener` |

这种方案代码量会增加 2-4 倍，且动画/状态同步容易出错，本文件这种复杂度（1500 行、10+ 个有状态组件）不推荐。
