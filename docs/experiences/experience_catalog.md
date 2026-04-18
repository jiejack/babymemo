# 经验库 - Experience Catalog

## 项目初始化与配置

### 1. 技术栈选择

**经验**：选择 React + Next.js + Tailwind CSS + daisyUI 的技术栈

**原因**：
- Next.js 提供了优秀的服务器端渲染和路由管理
- Tailwind CSS 简化了样式开发，提高了开发效率
- daisyUI 提供了美观的组件库，加速 UI 开发
- SQLite 作为本地数据库，适合小型应用和原型开发

**最佳实践**：
- 优先选择成熟稳定的技术栈
- 考虑项目规模和团队熟悉程度
- 确保技术栈之间的兼容性

### 2. 项目结构设计

**经验**：采用模块化的项目结构

**原因**：
- 清晰的项目结构便于团队协作
- 模块化设计提高了代码的可维护性
- 分离前端和后端逻辑，便于单独测试和部署

**最佳实践**：
- 按功能模块组织代码
- 保持目录结构的一致性
- 遵循框架的最佳实践

**相关文件**：
- [项目结构](file:///workspace/babymemo/README.md#项目结构)

## 数据库设计与管理

### 1. 数据库初始化

**经验**：使用初始化脚本创建数据库表结构

**原因**：
- 确保数据库表结构的一致性
- 便于项目的快速部署和迁移
- 减少手动操作的错误

**最佳实践**：
- 编写清晰的数据库初始化脚本
- 包含所有必要的表和索引
- 处理表已存在的情况

**相关文件**：
- [init-db.js](file:///workspace/babymemo/init-db.js)

### 2. 数据库连接管理

**经验**：使用绝对路径连接数据库

**原因**：
- 避免不同环境下的路径解析问题
- 确保数据库连接的稳定性
- 减少因路径问题导致的错误

**最佳实践**：
- 使用 `path.resolve()` 生成绝对路径
- 考虑不同环境的配置
- 实现错误处理和重连机制

**相关文件**：
- [backend/database/connection.js](file:///workspace/babymemo/backend/database/connection.js)

## API 开发

### 1. API 路由设计

**经验**：使用 Next.js App Router 实现 API 路由

**原因**：
- App Router 提供了更现代化的 API 路由管理
- 支持自动生成 API 文档
- 便于实现 RESTful API 设计

**最佳实践**：
- 遵循 RESTful API 设计原则
- 实现统一的错误处理
- 为所有 API 端点添加适当的文档

**相关文件**：
- [app/api/users/route.js](file:///workspace/babymemo/app/api/users/route.js)
- [app/api/users/login/route.js](file:///workspace/babymemo/app/api/users/login/route.js)
- [app/api/users/me/route.js](file:///workspace/babymemo/app/api/users/me/route.js)

### 2. 模块系统兼容性

**经验**：处理 ES 模块和 CommonJS 模块的兼容性

**原因**：
- Next.js 13+ 默认使用 ES 模块语法
- 许多 Node.js 库仍然使用 CommonJS 语法
- 模块系统不兼容会导致导入错误

**最佳实践**：
- 对于 API 路由文件，使用 ES 模块语法
- 对于需要导入的 CommonJS 模块，使用动态导入
- 确保所有导入语句符合 ES 模块规范

**相关文件**：
- [app/api/users/route.js](file:///workspace/babymemo/app/api/users/route.js)

## 前端开发

### 1. UI 设计与实现

**经验**：使用 Tailwind CSS 和 daisyUI 实现现代化 UI

**原因**：
- Tailwind CSS 提供了灵活的样式系统
- daisyUI 提供了美观的组件库
- 两者结合可以快速构建现代化的用户界面

**最佳实践**：
- 设计一致的颜色主题
- 使用响应式设计确保在不同设备上的良好体验
- 优化 UI 交互，提高用户体验

**相关文件**：
- [tailwind.config.js](file:///workspace/babymemo/tailwind.config.js)
- [styles/globals.css](file:///workspace/babymemo/styles/globals.css)

### 2. 路由保护

**经验**：实现基于 JWT 的路由保护

**原因**：
- 保护敏感路由，防止未授权访问
- 提供更好的用户体验
- 确保系统的安全性

**最佳实践**：
- 在 `_app.js` 中实现路由保护逻辑
- 使用 Next.js 的中间件进行路由保护
- 确保认证状态的正确管理

**相关文件**：
- [pages/_app.js](file:///workspace/babymemo/pages/_app.js)

## 测试与调试

### 1. 测试策略

**经验**：编写综合测试脚本

**原因**：
- 确保系统的稳定性和可靠性
- 及早发现和修复问题
- 提高代码质量

**最佳实践**：
- 为关键功能编写测试用例
- 实现数据库连接测试
- 实现 API 连接测试
- 设置合理的超时时间

**相关文件**：
- [test_db_connection.js](file:///workspace/babymemo/test_db_connection.js)
- [test_api_connection.js](file:///workspace/babymemo/test_api_connection.js)
- [test_comprehensive_improved.js](file:///workspace/babymemo/test_comprehensive_improved.js)

### 2. 调试技巧

**经验**：使用日志和错误处理进行调试

**原因**：
- 快速定位和解决问题
- 提高开发效率
- 改善代码质量

**最佳实践**：
- 在关键位置添加日志
- 实现统一的错误处理
- 使用浏览器开发者工具进行前端调试
- 使用 Node.js 调试工具进行后端调试

## 部署与维护

### 1. 构建与部署

**经验**：使用 Bun 构建和部署项目

**原因**：
- Bun 提供了快速的构建速度
- 简化了依赖管理和部署流程
- 支持现代化的 JavaScript 特性

**最佳实践**：
- 配置合理的构建参数
- 实现自动化部署流程
- 监控部署过程中的错误

**相关文件**：
- [package.json](file:///workspace/babymemo/package.json)

### 2. 性能优化

**经验**：优化数据库查询和 API 响应时间

**原因**：
- 提高用户体验
- 减少服务器负载
- 降低系统故障率

**最佳实践**：
- 优化数据库查询，添加适当的索引
- 实现 API 响应缓存
- 减少不必要的网络请求
- 优化前端代码，减少渲染时间

## 团队协作

### 1. 代码规范

**经验**：制定统一的代码规范

**原因**：
- 提高代码的可读性和可维护性
- 减少团队成员之间的代码风格差异
- 便于代码审查和团队协作

**最佳实践**：
- 使用 ESLint 和 Prettier 进行代码检查和格式化
- 制定团队代码规范文档
- 定期进行代码审查

### 2. 文档管理

**经验**：维护完整的项目文档

**原因**：
- 便于新成员快速了解项目
- 减少知识传递的成本
- 提高团队协作效率

**最佳实践**：
- 及时更新 README.md
- 维护错误库和经验库
- 记录项目的重要决策和变更

**相关文件**：
- [README.md](file:///workspace/babymemo/README.md)
- [docs/errors/error_catalog.md](file:///workspace/babymemo/docs/errors/error_catalog.md)
- [docs/experiences/experience_catalog.md](file:///workspace/babymemo/docs/experiences/experience_catalog.md)

## 更新记录

- **2026-04-18**：初始化经验库文档
