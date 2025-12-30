import React from 'react';
import { createRoot } from 'react-dom/client';
import '/src/style.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);

// 使用 Vite 的 import.meta.glob 预加载 examples/articles 目录下的组件（eager=true）
// eager 模式下 modules[path] 是模块对象；非 eager 时是一个加载函数
const modules = import.meta.glob('../articles/*.tsx', { eager: true });

function getPageKey() {
  const params = new URLSearchParams(location.search);
  return params.get('page') || 'debt_risk_analysis';
}

async function mount() {
  const page = getPageKey();
  const modulePath = `../articles/${page}.tsx`;
  const loader = modules[modulePath];
  if (!loader) {
    root.render(
      React.createElement('div', { className: 'p-6' }, [`未找到页面: ${page}`, React.createElement('div', { key: 'hint', className: 'mt-4 text-sm text-gray-600' }, '可用名称示例: debt_risk_analysis, cn_us_contribution_chart')])
    );
    return;
  }
  // loader 可能是模块对象（eager）或返回模块的函数（lazy）
  let mod;
  if (typeof loader === 'function') {
    mod = await loader();
  } else {
    mod = loader;
  }
  const Component = mod.default;
  root.render(
    React.createElement(React.StrictMode, null, React.createElement(Component))
  );
}

mount();
