# 经验总结

## 不要使用 [id].js 文件处理 API 路由

**问题描述**：
使用 [id].js 文件处理带 ID 参数的 API 路由会导致代码重复和维护困难，每次添加新的 API 端点都需要创建新的 [id].js 文件。

**解决方案**：
在单个 index.js 文件中处理所有 HTTP 方法（GET、POST、PUT、DELETE），并从查询参数或路径参数中获取 ID。

**代码示例**：
```javascript
// pages/api/resources/index.js
export default function handler(req, res) {
  // 从查询参数或路径参数中获取ID
  const id = req.query.id || req.query[0];
  
  switch (req.method) {
    case 'GET':
      if (id) {
        return getResourceById(req, res);
      } else {
        return getResources(req, res);
      }
    case 'POST':
      return createResource(req, res);
    case 'PUT':
      return updateResource(req, res);
    case 'DELETE':
      return deleteResource(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

**优势**：
- 所有相关的 API 操作都集中在一个文件中，便于维护
- 无需为每个资源创建额外的 [id].js 文件
- 统一的错误处理和身份验证逻辑

## 数据库表结构设计

**问题描述**：
在更新数据时，需要确保 API 路由中使用的列名与数据库表结构完全匹配，否则会导致数据库错误。

**解决方案**：
- 在修改 API 路由之前，先检查数据库表结构
- 使用与数据库表结构一致的列名
- 在更新操作中，只更新表中存在的列

**示例**：
如果数据库表中没有 `tags` 列，就不要在 UPDATE 语句中包含 `tags` 字段。

## 视频 ID 生成

**问题描述**：
对于使用 TEXT 类型 ID 的表，不能使用 `lastID` 来获取新插入记录的 ID，因为这只适用于自增整数类型的 ID。

**解决方案**：
使用 UUID 生成器为 TEXT 类型的 ID 字段生成唯一标识符。

**代码示例**：
```javascript
import { v4 as uuidv4 } from 'uuid';

// 创建新记录时生成 UUID
const id = uuidv4();
await db.run(
  `INSERT INTO videos (id, user_id, ...) VALUES (?, ?, ...)`,
  [id, userId, ...]
);
```

## curl 命令必须添加超时机制

**问题描述**：
执行 curl 命令时，如果没有设置超时机制，可能会导致命令长时间挂起，影响开发效率和测试过程。

**解决方案**：
- 所有 curl 命令必须添加 `-m 30` 参数，设置默认超时时间为 30 秒
- 对于个别特殊接口（如大文件上传/下载），可以根据需要调整超时时间，但必须在命令中明确指定

**代码示例**：
```bash
# 默认 30 秒超时
curl -m 30 -X GET http://localhost:3000/api/photos

# 大文件上传时调整超时时间为 300 秒
curl -m 300 -X POST -F "file=@large-file.jpg" http://localhost:3000/api/photos
```

**优势**：
- 避免命令长时间挂起
- 提高测试和开发效率
- 可以根据实际需求灵活调整