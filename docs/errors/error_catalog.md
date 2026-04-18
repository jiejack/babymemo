# 错误库 - Error Catalog

## 数据库连接错误

### 1. SQLITE_CANTOPEN 错误

**错误信息**：`SQLITE_CANTOPEN: unable to open database file`

**原因**：数据库路径不正确，特别是在不同环境下的路径解析问题。

**解决方案**：
- 使用绝对路径：`path.resolve(process.cwd(), 'data.db')`
- 确保数据库文件所在目录存在且有写入权限
- 检查环境变量中的路径配置

**相关文件**：
- [backend/database/connection.js](file:///workspace/babymemo/backend/database/connection.js)

### 2. 数据库表不存在错误

**错误信息**：`SQLITE_ERROR: no such table: users`

**原因**：数据库表未初始化或初始化失败。

**解决方案**：
- 运行数据库初始化脚本：`bun run init-db.js`
- 检查数据库初始化代码中的表创建语句
- 确保数据库连接成功后再执行初始化操作

**相关文件**：
- [init-db.js](file:///workspace/babymemo/init-db.js)

## API 错误

### 1. 模块导入错误

**错误信息**：`Cannot use import statement outside a module` 或 `require is not defined in ES module scope`

**原因**：Next.js 13+ 使用 ES 模块语法，而传统 Node.js 代码使用 CommonJS 语法。

**解决方案**：
- 对于 API 路由文件，使用 ES 模块语法
- 对于需要导入的 CommonJS 模块，使用动态导入：`await import()`
- 确保所有导入语句符合 ES 模块规范

**相关文件**：
- [app/api/users/route.js](file:///workspace/babymemo/app/api/users/route.js)
- [app/api/users/login/route.js](file:///workspace/babymemo/app/api/users/login/route.js)
- [app/api/users/me/route.js](file:///workspace/babymemo/app/api/users/me/route.js)

### 2. API 超时错误

**错误信息**：`Request timeout`

**原因**：API 请求超过设定的超时时间（20秒）。

**解决方案**：
- 检查数据库连接是否正常
- 优化数据库查询性能
- 检查 API 路由中的业务逻辑是否有阻塞操作
- 确保服务器运行正常

**相关文件**：
- [test_api_connection.js](file:///workspace/babymemo/test_api_connection.js)
- [test_comprehensive.js](file:///workspace/babymemo/test_comprehensive.js)

## 前端错误

### 1. 路由保护错误

**错误信息**：未登录用户可以访问受保护的路由。

**原因**：路由保护逻辑不完整或实现错误。

**解决方案**：
- 在 `_app.js` 中实现完整的路由保护逻辑
- 使用 Next.js 的中间件进行路由保护
- 确保认证状态的正确管理

**相关文件**：
- [pages/_app.js](file:///workspace/babymemo/pages/_app.js)

### 2. 样式错误

**错误信息**：Tailwind CSS 自定义颜色不生效。

**原因**：tailwind.config.js 配置错误。

**解决方案**：
- 确保颜色配置格式正确
- 重新启动开发服务器
- 检查 Tailwind CSS 版本兼容性

**相关文件**：
- [tailwind.config.js](file:///workspace/babymemo/tailwind.config.js)

## 服务器错误

### 1. 端口占用错误

**错误信息**：`Port 3000 is in use by an unknown process`

**原因**：端口 3000 已被其他进程占用。

**解决方案**：
- 停止占用端口的进程：`kill <PID>`
- 使用其他可用端口
- 检查是否有其他开发服务器在运行

### 2. 依赖缺失错误

**错误信息**：`Cannot find module 'bcryptjs'`

**原因**：项目依赖未安装或安装不完整。

**解决方案**：
- 运行 `bun install` 安装所有依赖
- 检查 package.json 中的依赖配置
- 清除 node_modules 并重新安装

**相关文件**：
- [package.json](file:///workspace/babymemo/package.json)

## 测试错误

### 1. 测试超时错误

**错误信息**：`Request timeout (20 seconds)`

**原因**：测试请求超过设定的超时时间。

**解决方案**：
- 确保开发服务器正在运行
- 检查 API 端点是否正确
- 优化测试脚本中的超时处理

**相关文件**：
- [test_comprehensive_improved.js](file:///workspace/babymemo/test_comprehensive_improved.js)

### 2. 测试数据错误

**错误信息**：`Invalid credentials`

**原因**：测试使用的用户不存在或密码错误。

**解决方案**：
- 先注册用户再进行登录测试
- 确保测试数据的一致性
- 使用动态生成的测试数据

**相关文件**：
- [test_comprehensive_improved.js](file:///workspace/babymemo/test_comprehensive_improved.js)

## 最佳实践

1. **错误处理**：在所有 API 路由中实现统一的错误处理
2. **日志记录**：记录详细的错误信息，便于调试
3. **测试覆盖**：为关键功能编写测试用例
4. **监控**：实现基本的错误监控机制
5. **文档**：及时更新错误库文档，记录新发现的错误和解决方案

## 更新记录

- **2026-04-18**：初始化错误库文档
