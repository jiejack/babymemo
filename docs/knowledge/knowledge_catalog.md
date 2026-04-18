# 知识库 - Knowledge Catalog

## 项目核心知识

### 1. 技术栈概述

**技术栈**：React + Next.js + Tailwind CSS + daisyUI + Node.js + SQLite + JWT

**技术选型理由**：
- **前端**：React 提供组件化开发，Next.js 提供服务器端渲染和路由管理，Tailwind CSS 和 daisyUI 提供快速的 UI 开发能力
- **后端**：Node.js 提供高效的服务器端运行环境，SQLite 作为轻量级数据库适合小型应用
- **认证**：JWT 提供无状态的身份验证机制

**相关文档**：
- [README.md](file:///workspace/babymemo/README.md)

### 2. 项目架构

**架构设计**：
- **前端**：Next.js 页面路由 + 组件化开发
- **后端**：Next.js API 路由 + 数据模型
- **数据库**：SQLite 本地数据库
- **认证**：基于 JWT 的认证系统

**核心模块**：
- 用户认证模块
- 宝宝档案模块
- 照片管理模块
- 视频管理模块
- 成长日记模块
- 成长日历模块
- 成长指标模块

**相关文件**：
- [backend/models/](file:///workspace/babymemo/backend/models/)
- [app/api/](file:///workspace/babymemo/app/api/)
- [pages/](file:///workspace/babymemo/pages/)

### 3. 数据库设计

**数据库表结构**：
- `users`：用户信息表
- `babies`：宝宝信息表
- `photos`：照片表
- `videos`：视频表
- `diaries`：日记表
- `events`：事件表
- `milestones`：里程碑表
- `growth_indicators`：成长指标表
- `settings`：设置表

**数据关系**：
- 用户可以有多个宝宝
- 宝宝可以有多个照片、视频、日记、事件、里程碑和成长指标

**相关文件**：
- [init-db.js](file:///workspace/babymemo/init-db.js)
- [backend/database/connection.js](file:///workspace/babymemo/backend/database/connection.js)

### 4. API 设计

**API 端点**：
- `POST /api/users`：注册新用户
- `POST /api/users/login`：用户登录
- `GET /api/users/me`：获取当前用户信息

**API 设计原则**：
- 遵循 RESTful API 设计规范
- 使用 JSON 格式进行数据交换
- 实现统一的错误处理
- 使用 JWT 进行身份验证

**相关文件**：
- [app/api/users/route.js](file:///workspace/babymemo/app/api/users/route.js)
- [app/api/users/login/route.js](file:///workspace/babymemo/app/api/users/login/route.js)
- [app/api/users/me/route.js](file:///workspace/babymemo/app/api/users/me/route.js)

## 外部资源整合

### 1. Karpathy's llm-wiki.md

**核心概念**：
- 大型语言模型 (LLM) 的基本原理
- 模型训练和微调方法
- 模型评估和部署策略
- 提示工程和最佳实践

**应用场景**：
- 可以考虑在未来版本中集成 LLM 功能，如智能日记生成、成长建议等
- 利用 LLM 技术提高用户体验

### 2. Karpathy's AGENT.md

**核心概念**：
- 智能代理的设计和实现
- 代理的决策过程和行为模式
- 多代理系统的协作
- 代理的评估和优化

**应用场景**：
- 可以考虑在未来版本中实现智能助手功能
- 利用代理技术提供个性化的育儿建议
- 实现自动化的成长记录和分析

## 开发最佳实践

### 1. 代码规范

**命名规范**：
- 变量和函数：小驼峰命名法
- 类名：大驼峰命名法
- 常量：全大写，下划线分隔
- 文件名：小写，连字符分隔

**代码风格**：
- 使用 2 个空格进行缩进
- 每行代码不超过 80 个字符
- 适当使用空行和注释
- 遵循 ESLint 和 Prettier 规范

### 2. 安全最佳实践

**认证安全**：
- 使用 bcryptjs 对密码进行哈希处理
- 使用 JWT 进行身份验证
- 设置合理的 token 过期时间

**数据安全**：
- 验证用户输入
- 防止 SQL 注入
- 保护敏感数据

**API 安全**：
- 实现 CORS 配置
- 验证 API 请求的身份和权限
- 限制 API 请求频率

### 3. 性能优化

**前端优化**：
- 使用 Next.js 的静态生成和服务器端渲染
- 优化图片和资源加载
- 使用 Tailwind CSS 的 purge 功能减少 CSS 体积

**后端优化**：
- 优化数据库查询
- 实现 API 响应缓存
- 使用适当的索引

**数据库优化**：
- 合理设计表结构
- 使用事务处理复杂操作
- 定期备份数据库

## 部署与维护

### 1. 部署策略

**开发环境**：
- 使用 `bun run dev` 启动开发服务器
- 支持热重载

**生产环境**：
- 使用 `bun run build` 构建生产版本
- 使用 `bun start` 启动生产服务器
- 配置环境变量

**部署平台**：
- 可以部署到 Vercel、Netlify 等平台
- 也可以部署到自己的服务器

### 2. 维护策略

**日志管理**：
- 记录关键操作和错误
- 使用适当的日志级别
- 定期清理日志

**监控**：
- 监控服务器状态
- 监控 API 响应时间
- 监控数据库性能

**备份**：
- 定期备份数据库
- 备份重要配置文件
- 制定灾难恢复计划

## 学习资源

### 1. 技术文档

- [React 官方文档](https://react.dev/)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [JWT 官方文档](https://jwt.io/introduction)

### 2. 在线教程

- [React 教程](https://react.dev/learn)
- [Next.js 教程](https://nextjs.org/learn)
- [Tailwind CSS 教程](https://tailwindcss.com/docs/installation)
- [Node.js 教程](https://nodejs.org/en/docs/guides/)

### 3. 社区资源

- [Stack Overflow](https://stackoverflow.com/)
- [GitHub](https://github.com/)
- [Dev.to](https://dev.to/)
- [Medium](https://medium.com/)

### 4. 书籍推荐

- 《React 实战》
- 《Next.js 权威指南》
- 《Tailwind CSS 实战》
- 《Node.js 设计模式》
- 《SQLite 权威指南》

## 常见问题

### 1. 数据库连接问题

**问题**：无法连接到数据库
**解决方案**：
- 检查数据库路径是否正确
- 确保数据库文件存在且有写入权限
- 检查数据库初始化脚本是否运行

### 2. API 超时问题

**问题**：API 请求超时
**解决方案**：
- 检查服务器是否运行
- 检查数据库连接是否正常
- 优化 API 路由的业务逻辑

### 3. 前端样式问题

**问题**：Tailwind CSS 样式不生效
**解决方案**：
- 检查 Tailwind 配置是否正确
- 重新启动开发服务器
- 检查样式类名是否正确

### 4. 认证问题

**问题**：用户无法登录
**解决方案**：
- 检查用户名和密码是否正确
- 检查 JWT 配置是否正确
- 检查 API 路由是否正常

## 更新记录

- **2026-04-18**：初始化知识库文档
