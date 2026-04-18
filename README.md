# BabyMemo - 宝宝成长记录系统

## 项目简介

BabyMemo是一个专为父母设计的宝宝成长记录系统，帮助记录宝宝的成长历程、照片、视频、日记、里程碑等重要时刻。

## 技术栈

- **前端**：React + Next.js + Tailwind CSS + daisyUI
- **后端**：Node.js + SQLite
- **认证**：JWT
- **构建工具**：Bun
- **测试**：自定义测试脚本

## 核心功能

- 📸 照片管理：上传、分类、标签管理
- 🎥 视频管理：上传、预览、分类
- 📝 成长日记：记录宝宝的日常趣事
- 📅 成长日历：重要事件和里程碑
- 📊 成长指标：身高、体重等数据跟踪
- 👶 宝宝档案：基本信息管理
- 🔐 用户认证：安全的登录和注册

## 快速开始

### 环境要求

- Node.js 18+
- Bun 1.2+

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <仓库地址>
   cd babymemo
   ```

2. **安装依赖**
   ```bash
   bun install
   ```

3. **初始化数据库**
   ```bash
   bun run init-db.js
   ```

4. **启动开发服务器**
   ```bash
   bun run dev
   ```

5. **访问应用**
   打开浏览器访问：http://localhost:3000

## 项目结构

```
babymemo/
├── app/             # Next.js App Router API路由
├── pages/           # Next.js Pages Router页面
├── components/      # 前端组件
├── backend/         # 后端代码
│   ├── api/         # API接口
│   ├── database/    # 数据库连接
│   └── models/      # 数据模型
├── services/        # 服务层
├── styles/          # 样式文件
├── docs/            # 文档目录
├── test/            # 测试文件
├── data.db          # SQLite数据库
└── package.json     # 项目配置
```

## 测试

### 数据库连接测试
```bash
bun run test_db_connection.js
```

### API连接测试
```bash
bun run test_api_connection.js
```

### 综合测试
```bash
bun run test_comprehensive_improved.js
```

## 部署

### 构建生产版本
```bash
bun run build
```

### 启动生产服务器
```bash
bun start
```

## 文档

详细文档请查看 [docs](./docs) 目录。

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
