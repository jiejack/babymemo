# BabyMemo 技术架构文档

## 🏗️ 架构概述

BabyMemo 采用现代化的前端架构，基于 React + Next.js 框架构建，使用 Tailwind CSS 进行样式设计，实现了一个功能完整的宝宝成长记录系统。

## 📁 项目结构

### 核心目录结构

```
babymemo/
├── components/          # 组件目录
│   └── common/          # 通用组件
├── pages/              # 页面目录（Pages Router）
│   ├── _app.js         # 应用入口（全局状态管理）
│   ├── index.js        # 登录/注册页面
│   ├── dashboard.js    # 仪表盘页面
│   ├── photos.js       # 照片墙页面
│   ├── diaries.js      # 创意日记页面
│   ├── calendar.js     # 创意日历页面
│   ├── timeline.js     # 时光轴页面
│   ├── babies.js       # 宝宝管理页面
│   ├── growth.js       # 成长指标页面
│   ├── videos.js       # 视频管理页面
│   └── settings.js     # 设置页面
├── services/           # 服务目录
│   ├── api.js          # API服务（模拟实现）
│   └── auth.js         # 认证服务
├── public/             # 静态资源
├── docs/               # 文档目录
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 🔧 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | React | 18.0+ | UI 构建 |
| 框架 | Next.js | 14.0+ | 服务端渲染、路由 |
| 样式 | Tailwind CSS | 3.0+ | 响应式样式设计 |
| 状态管理 | React Context API | 内置 | 全局状态管理 |
| 数据存储 | LocalStorage / SessionStorage | 浏览器内置 | 本地数据存储 |
| 构建工具 | Next.js Build | 内置 | 项目构建 |

## 🔍 核心功能模块

### 1. 认证系统

**文件**：[pages/_app.js](file:///workspace/babymemo/pages/_app.js)、[services/auth.js](file:///workspace/babymemo/services/auth.js)

**功能**：
- 登录/注册功能（模拟实现）
- 登录状态管理
- 路由保护（未登录用户自动重定向到登录页）
- 登录状态持久化（刷新后保持）

**实现原理**：
- 使用 React Context API 管理全局认证状态
- 登录状态存储在 LocalStorage / SessionStorage 中
- 路由保护通过 Next.js 的 getServerSideProps 或客户端路由拦截实现

### 2. 仪表盘

**文件**：[pages/dashboard.js](file:///workspace/babymemo/pages/dashboard.js)

**功能**：
- 欢迎信息显示
- 快速操作按钮
- 最近记忆展示
- 最近照片展示
- 最近日记展示
- 最近里程碑展示
- 成长指标概览

**特点**：
- 集成了所有功能模块的概览
- 提供快速访问各个功能的入口
- 展示最近的宝宝成长记录

### 3. 照片墙

**文件**：[pages/photos.js](file:///workspace/babymemo/pages/photos.js)

**功能**：
- 照片展示
- 添加演示照片功能
- 照片管理（编辑、删除）

**实现**：
- 使用模拟数据展示照片
- 支持添加新照片（模拟）
- 响应式布局，适应不同设备

### 4. 创意日记

**文件**：[pages/diaries.js](file:///workspace/babymemo/pages/diaries.js)

**功能**：
- 日记列表展示
- 添加演示日记功能
- 日记管理（编辑、删除）

**实现**：
- 使用模拟数据展示日记
- 支持添加新日记（模拟）
- 响应式设计

### 5. 创意日历

**文件**：[pages/calendar.js](file:///workspace/babymemo/pages/calendar.js)

**功能**：
- 月份切换
- 日历视图
- 添加演示事件功能

**实现**：
- 实现了简单的日历逻辑
- 支持月份导航
- 响应式设计

### 6. 时光轴

**文件**：[pages/timeline.js](file:///workspace/babymemo/pages/timeline.js)

**功能**：
- 时间线展示
- 添加演示里程碑功能
- 里程碑管理

**实现**：
- 垂直时间线布局
- 按时间顺序展示里程碑
- 响应式设计

### 7. 宝宝管理

**文件**：[pages/babies.js](file:///workspace/babymemo/pages/babies.js)

**功能**：
- 宝宝列表展示
- 添加演示宝宝功能
- 宝宝信息管理

**实现**：
- 表格形式展示宝宝信息
- 支持添加新宝宝（模拟）
- 响应式设计

### 8. 成长指标

**文件**：[pages/growth.js](file:///workspace/babymemo/pages/growth.js)

**功能**：
- 成长数据表格
- 成长曲线查看
- 添加成长记录功能
- 数据管理（编辑、删除）

**实现**：
- 表格形式展示成长数据
- 支持添加新记录（模拟）
- 响应式设计

### 9. 视频管理

**文件**：[pages/videos.js](file:///workspace/babymemo/pages/videos.js)

**功能**：
- 视频列表展示
- 视频上传功能
- 视频管理（编辑、删除）

**实现**：
- 列表形式展示视频
- 支持上传新视频（模拟）
- 响应式设计

### 10. 设置中心

**文件**：[pages/settings.js](file:///workspace/babymemo/pages/settings.js)

**功能**：
- 主题设置（浅色/深色）
- 语言设置（中文/English）
- 自动备份设置
- 数据导出/导入
- 关于信息

**实现**：
- 表单形式展示设置选项
- 实时更新设置效果
- 响应式设计

## 📊 数据流

### 认证数据流

1. 用户访问应用 → 检查 LocalStorage/SessionStorage 中的登录状态
2. 未登录 → 重定向到登录页
3. 登录 → 存储用户信息和token到 LocalStorage/SessionStorage
4. 登录后 → 重定向到仪表盘
5. 刷新页面 → 从 LocalStorage/SessionStorage 恢复登录状态

### 功能数据流

1. 访问功能页面 → 检查登录状态
2. 加载页面 → 显示模拟数据
3. 操作数据 → 更新本地状态（模拟）
4. 保存数据 → 存储到 LocalStorage（模拟）

## 🛡️ 安全性

### 前端安全措施

1. **输入验证**：对用户输入进行基本验证
2. **XSS 防护**：使用 React 的安全渲染机制
3. **CSRF 防护**：使用 SameSite cookies
4. **数据存储**：敏感信息存储在 LocalStorage 中（仅用于演示）
5. **路由保护**：未登录用户无法访问受保护页面

### 注意事项

- 本项目为前端演示项目，使用模拟数据和本地存储
- 生产环境中应使用真实的后端服务和安全的认证机制
- 敏感数据应存储在服务器端，而不是客户端

## 🚀 性能优化

1. **代码分割**：Next.js 自动进行代码分割
2. **静态生成**：部分页面使用静态生成
3. **缓存策略**：合理使用浏览器缓存
4. **图片优化**：使用适当的图片格式和大小
5. **减少重渲染**：使用 React.memo 和 useCallback 优化组件性能

## 🔮 未来扩展

1. **后端服务**：添加真实的后端 API 和数据库
2. **用户系统**：实现完整的用户注册、登录、密码重置功能
3. **数据同步**：实现多设备数据同步
4. **云存储**：集成云存储服务，存储照片和视频
5. **社交分享**：添加分享功能，分享宝宝成长记录
6. **数据分析**：添加成长数据的分析和可视化
7. **通知系统**：添加重要事件的通知功能
8. **多语言支持**：完善多语言国际化

## 📝 开发指南

### 开发环境设置

1. **安装依赖**：`npm install`
2. **启动开发服务器**：`npm run dev`
3. **构建生产版本**：`npm run build`
4. **启动生产服务器**：`npm start`

### 代码规范

- 使用 ES6+ 语法
- 使用 React Hooks
- 遵循 Tailwind CSS 最佳实践
- 代码注释清晰
- 组件命名规范

### 测试

- 使用 Jest 进行单元测试
- 使用 Cypress 进行端到端测试
- 测试覆盖主要功能模块

## 🤝 贡献指南

1. **Fork 项目**
2. **创建分支**：`git checkout -b feature/your-feature`
3. **提交更改**：`git commit -m "feat: add your feature"`
4. **推送到分支**：`git push origin feature/your-feature`
5. **创建 Pull Request**

## 📄 许可证

MIT License

---

**BabyMemo 技术架构文档** - 记录系统的技术实现和设计思路