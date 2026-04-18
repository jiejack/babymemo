# 技能库 - Skill Catalog

## 前端开发技能

### 1. React

**技能描述**：React 是一个用于构建用户界面的 JavaScript 库。

**应用场景**：
- 构建现代化的单页应用
- 组件化开发
- 状态管理

**相关文件**：
- [pages/_app.js](file:///workspace/babymemo/pages/_app.js)
- [pages/index.js](file:///workspace/babymemo/pages/index.js)

### 2. Next.js

**技能描述**：Next.js 是一个基于 React 的全栈框架，提供了服务器端渲染、路由管理等功能。

**应用场景**：
- 构建 SEO 友好的网站
- 实现服务器端渲染
- 管理应用路由
- 构建 API 路由

**相关文件**：
- [app/api/](file:///workspace/babymemo/app/api/)
- [pages/](file:///workspace/babymemo/pages/)
- [next.config.js](file:///workspace/babymemo/next.config.js)

### 3. Tailwind CSS

**技能描述**：Tailwind CSS 是一个实用优先的 CSS 框架，提供了大量的工具类。

**应用场景**：
- 快速构建响应式界面
- 自定义主题和样式
- 优化 CSS 体积

**相关文件**：
- [tailwind.config.js](file:///workspace/babymemo/tailwind.config.js)
- [styles/globals.css](file:///workspace/babymemo/styles/globals.css)

### 4. daisyUI

**技能描述**：daisyUI 是一个基于 Tailwind CSS 的组件库，提供了美观的 UI 组件。

**应用场景**：
- 快速构建现代化的用户界面
- 使用预设的组件样式
- 自定义组件外观

**相关文件**：
- [tailwind.config.js](file:///workspace/babymemo/tailwind.config.js)

## 后端开发技能

### 1. Node.js

**技能描述**：Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。

**应用场景**：
- 构建服务器端应用
- 处理 API 请求
- 操作数据库

**相关文件**：
- [backend/](file:///workspace/babymemo/backend/)
- [app/api/](file:///workspace/babymemo/app/api/)

### 2. SQLite

**技能描述**：SQLite 是一个轻量级的关系型数据库。

**应用场景**：
- 本地数据存储
- 小型应用的数据管理
- 快速原型开发

**相关文件**：
- [backend/database/connection.js](file:///workspace/babymemo/backend/database/connection.js)
- [init-db.js](file:///workspace/babymemo/init-db.js)
- [data.db](file:///workspace/babymemo/data.db)

### 3. JWT (JSON Web Token)

**技能描述**：JWT 是一种用于身份验证和信息交换的安全标准。

**应用场景**：
- 用户认证
- 保护 API 路由
- 无状态会话管理

**相关文件**：
- [app/api/users/login/route.js](file:///workspace/babymemo/app/api/users/login/route.js)
- [app/api/users/me/route.js](file:///workspace/babymemo/app/api/users/me/route.js)

### 4. bcryptjs

**技能描述**：bcryptjs 是一个用于密码哈希的 JavaScript 库。

**应用场景**：
- 安全存储用户密码
- 密码验证

**相关文件**：
- [app/api/users/route.js](file:///workspace/babymemo/app/api/users/route.js)
- [app/api/users/login/route.js](file:///workspace/babymemo/app/api/users/login/route.js)

## 开发工具技能

### 1. Bun

**技能描述**：Bun 是一个快速的 JavaScript 运行时和包管理器。

**应用场景**：
- 安装依赖
- 运行开发服务器
- 构建项目
- 执行测试

**相关文件**：
- [package.json](file:///workspace/babymemo/package.json)
- [bun.lock](file:///workspace/babymemo/bun.lock)

### 2. Git

**技能描述**：Git 是一个分布式版本控制系统。

**应用场景**：
- 代码版本管理
- 团队协作
- 代码备份

**相关文件**：
- [.gitignore](file:///workspace/babymemo/.gitignore)

### 3. Visual Studio Code

**技能描述**：Visual Studio Code 是一个轻量级的代码编辑器。

**应用场景**：
- 代码编辑
- 调试
- 扩展支持

### 4. 命令行工具

**技能描述**：命令行工具是开发过程中常用的工具。

**应用场景**：
- 文件管理
- 执行脚本
- 系统操作

**常用命令**：
- `bun install` - 安装依赖
- `bun run dev` - 启动开发服务器
- `bun run build` - 构建项目
- `git status` - 查看 Git 状态
- `git add .` - 添加所有修改
- `git commit -m "message"` - 提交修改

## 测试技能

### 1. 单元测试

**技能描述**：单元测试是测试代码中最小可测试单元的方法。

**应用场景**：
- 测试函数和方法
- 确保代码质量
- 减少回归错误

### 2. 集成测试

**技能描述**：集成测试是测试多个组件或模块之间交互的方法。

**应用场景**：
- 测试 API 端点
- 测试数据库操作
- 测试完整的功能流程

**相关文件**：
- [test_comprehensive_improved.js](file:///workspace/babymemo/test_comprehensive_improved.js)

### 3. 性能测试

**技能描述**：性能测试是测试系统性能的方法。

**应用场景**：
- 测试 API 响应时间
- 测试数据库查询性能
- 优化系统性能

**相关文件**：
- [test_api_connection.js](file:///workspace/babymemo/test_api_connection.js)

## UI/UX 设计技能

### 1. 响应式设计

**技能描述**：响应式设计是确保网站在不同设备上都能良好显示的设计方法。

**应用场景**：
- 适配不同屏幕尺寸
- 提高用户体验
- 满足现代 Web 标准

**相关文件**：
- [tailwind.config.js](file:///workspace/babymemo/tailwind.config.js)
- [styles/globals.css](file:///workspace/babymemo/styles/globals.css)

### 2. 色彩设计

**技能描述**：色彩设计是选择和组合颜色以创建美观界面的技能。

**应用场景**：
- 品牌识别
- 视觉层次
- 用户体验

**相关文件**：
- [tailwind.config.js](file:///workspace/babymemo/tailwind.config.js)

### 3. 交互设计

**技能描述**：交互设计是设计用户与系统之间交互方式的技能。

**应用场景**：
- 提高用户体验
- 简化用户操作
- 增加用户参与度

### 4. 原型设计

**技能描述**：原型设计是创建产品早期版本以测试和验证设计的技能。

**应用场景**：
- 验证设计概念
- 收集用户反馈
- 指导开发

## 项目管理技能

### 1. 敏捷开发

**技能描述**：敏捷开发是一种迭代、增量的软件开发方法。

**应用场景**：
- 快速响应需求变化
- 持续交付价值
- 团队协作

### 2. 文档管理

**技能描述**：文档管理是创建、组织和维护项目文档的技能。

**应用场景**：
- 知识传递
- 项目记录
- 团队协作

**相关文件**：
- [README.md](file:///workspace/babymemo/README.md)
- [docs/](file:///workspace/babymemo/docs/)

### 3. 问题解决

**技能描述**：问题解决是识别和解决项目中遇到的问题的技能。

**应用场景**：
- 调试代码
- 优化性能
- 解决技术难题

**相关文件**：
- [docs/errors/error_catalog.md](file:///workspace/babymemo/docs/errors/error_catalog.md)

### 4. 代码审查

**技能描述**：代码审查是检查代码质量和安全性的技能。

**应用场景**：
- 提高代码质量
- 发现潜在问题
- 知识共享

## 学习资源

### 1. 官方文档

- [React 官方文档](https://react.dev/)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [SQLite 官方文档](https://www.sqlite.org/docs.html)

### 2. 在线教程

- [React 教程](https://react.dev/learn)
- [Next.js 教程](https://nextjs.org/learn)
- [Tailwind CSS 教程](https://tailwindcss.com/docs/installation)

### 3. 社区资源

- [Stack Overflow](https://stackoverflow.com/)
- [GitHub](https://github.com/)
- [Dev.to](https://dev.to/)

## 更新记录

- **2026-04-18**：初始化技能库文档
