# Spring_Ai_Iot_Agent_Web

基于 **React 18 + TypeScript + Vite 5** 构建的物联网智能体前端应用。采用 Tailwind CSS 实现现代响应式界面，支持与后端 Spring AI 智能体服务进行实时通信（SSE）。

---
<img width="1859" height="910" alt="Snipaste_2026-08-08_11-55-47" src="https://github.com/user-attachments/assets/f66d89d8-da50-4a9a-a511-440a26334600" />

<img width="1869" height="913" alt="Snipaste_2026-08-08_11-56-17" src="https://github.com/user-attachments/assets/beed4f1f-c413-4842-b668-c9d61945520f" />

<img width="1870" height="913" alt="Snipaste_2026-08-08_11-56-03" src="https://github.com/user-attachments/assets/c694e9d0-d58c-4b06-a4f6-9e95b33d9ad5" />
## Web UI 预览

配套后端代码仓库：[spring_ai_Iot_agent](https://github.com/2101952621/spring_ai_Iot_agent/)


## 运行环境要求

| 依赖 | 最低版本 | 推荐版本 |
|------|----------|----------|
| **Node.js** | `18.x` | `20.x LTS` |
| **npm** | `9.x`（随 Node 18 内置） | `10.x` |

> 项目使用 **Vite 5** 作为构建工具，要求 Node.js ≥ 18。

---

## 技术栈与依赖说明

### 核心框架

| 包名 | 版本 | 说明 |
|------|------|------|
| `react` | `^18.3.1` | 前端 UI 框架，采用函数组件 + Hooks 开发模式 |
| `react-dom` | `^18.3.1` | React 的 DOM 渲染器，提供 `createRoot` 等 API |
| `typescript` | `^5.2.2` | 为项目提供静态类型检查，提升代码质量 |

### 路由

| 包名 | 版本 | 说明 |
|------|------|------|
| `react-router-dom` | `^6.25.1` | 基于 V6 的声明式路由方案，支持嵌套路由和动态参数 |

### 样式方案

| 包名 | 版本 | 说明 |
|------|------|------|
| `tailwindcss` | `^3.4.7` | 原子化 CSS 框架，通过类名组合快速构建 UI |
| `clsx` | `^2.1.1` | 轻量级类名拼接工具，简化条件样式的编写 |
| `tailwind-merge` | `^2.4.0` | 智能合并冲突的 Tailwind 类名，避免样式覆盖问题 |

### 图标

| 包名 | 版本 | 说明 |
|------|------|------|
| `lucide-react` | `^0.417.0` | 开源的 React 图标库，提供丰富的 SVG 矢量图标组件 |

### Markdown 渲染

| 包名 | 版本 | 说明 |
|------|------|------|
| `react-markdown` | `^9.0.1` | 将 Markdown 文本渲染为 React 组件的通用组件 |
| `remark-gfm` | `^4.0.0` | react-markdown 的插件，支持表格、删除线等 GFM 语法 |

### 构建工具与开发依赖

| 包名 | 版本 | 说明 |
|------|------|------|
| `vite` | `^5.3.4` | 下一代前端构建工具，极速 HMR 和编译，开发体验极佳 |
| `@vitejs/plugin-react` | `^4.3.1` | Vite 官方 React 插件，支持 JSX 转换和 Fast Refresh |

### 代码规范

| 包名 | 版本 | 说明 |
|------|------|------|
| `eslint` | `^8.57.0` | 代码静态检查工具，发现并修复潜在问题 |
| `@typescript-eslint/eslint-plugin` | `^7.15.0` | 为 ESLint 提供 TypeScript 语法的规则集 |
| `@typescript-eslint/parser` | `^7.15.0` | ESLint 的 TypeScript 解析器 |
| `eslint-plugin-react-hooks` | `^4.6.2` | 检查和规范 React Hooks 的使用 |
| `eslint-plugin-react-refresh` | `^0.4.7` | 确保组件支持 React Fast Refresh（HMR） |

### PostCSS 相关

| 包名 | 版本 | 说明 |
|------|------|------|
| `postcss` | `^8.4.40` | CSS 后处理器，Tailwind CSS 的底层依赖 |
| `autoprefixer` | `^10.4.19` | PostCSS 插件，自动为 CSS 添加浏览器前缀 |

### TypeScript 类型声明

| 包名 | 版本 | 说明 |
|------|------|------|
| `@types/react` | `^18.3.3` | React 18 的 TypeScript 类型定义 |
| `@types/react-dom` | `^18.3.0` | ReactDOM 的 TypeScript 类型定义 |

---

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd Spring_Ai_Iot_Agent_Web
```

### 2. 检查 Node.js 版本

```bash
node -v   # 输出应 ≥ v18.0.0
npm -v    # 输出应 ≥ 9.0.0
```

如果 Node.js 版本过低，推荐使用 [nvm](https://github.com/nvm-sh/nvm)（Linux/macOS）或 [nvm-windows](https://github.com/coreybutler/nvm-windows)（Windows）进行版本管理：

```bash
# 使用 nvm 安装并使用 Node 20
nvm install 20
nvm use 20
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

启动后浏览器访问 **http://localhost:5173** 即可进入应用。

> 开发服务器配置了 `/api` 反向代理，默认转发至 `http://localhost:8080`。请确保后端 Spring AI 服务已在 8080 端口启动。

### 5. 构建生产版本

```bash
npm run build
```

构建产物输出至 `dist/` 目录，可直接部署至 Nginx、CDN 等静态资源服务。

### 6. 本地预览生产构建

```bash
npm run preview
```

---

## 可用脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（监听 `0.0.0.0:5173`，支持局域网访问） |
| `npm run build` | TypeScript 类型检查 + Vite 生产构建 |
| `npm run preview` | 本地预览生产构建产物 |
| `npm run lint` | 运行 ESLint 静态代码检查 |

---

## 项目结构

```
Spring_Ai_Iot_Agent_Web/
├── index.html                 # HTML 入口文件
├── package.json               # 项目配置与依赖声明
├── tsconfig.json              # TypeScript 编译配置
├── tsconfig.node.json         # Vite / Node 环境 TypeScript 配置
├── vite.config.ts             # Vite 构建配置（含代理设置）
├── tailwind.config.js         # Tailwind CSS 主题定制
├── postcss.config.js          # PostCSS 配置
└── src/
    ├── main.tsx               # React 应用入口
    ├── App.tsx                # 根组件，路由定义
    ├── vite-env.d.ts          # Vite 环境类型声明
    └── ...                    # 页面组件、公共组件、工具函数等
```

---

## 配置说明

### Vite 代理

开发环境下，`/api` 路径的请求会被代理转发到后端服务，配置位于 `vite.config.ts`：

```ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 后端端口，按需修改
      changeOrigin: true,
    },
  },
}
```

> 如果后端服务运行在其他端口或地址，请相应修改 `target` 字段。

### 路径别名

项目配置了 `@` 别名指向 `src/` 目录，方便在组件中引用：

```ts
import { SomeComponent } from '@/components/SomeComponent';
```

---

## 常见问题

**Q: 启动时提示 Node 版本过低？**  
A: 请将 Node.js 升级至 18.x 或更高版本，推荐使用 Node 20 LTS。

**Q: `npm install` 安装缓慢或失败？**  
A: 可使用国内镜像源加速：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

**Q: 页面请求 `/api` 接口报 404？**  
A: 请检查后端 Spring AI 服务是否已在 `8080` 端口启动，或修改 `vite.config.ts` 中的 `target` 地址。

**Q: 生产部署后刷新页面出现 404？**  
A: 这是 SPA 路由的典型问题，需在 Nginx 中配置 `try_files` 回退至 `index.html`：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
