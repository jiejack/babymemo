# 网络操作规则

## 规则概述

**所有网络操作必须设置超时机制，避免AI编程时卡死。**

---

## 具体规则

### 1. 前端API调用

#### 1.1 超时设置
- **默认超时时间**：30秒（30000ms）
- **超时后处理**：显示友好的错误提示，允许用户重试
- **超时处理**：使用 `AbortController` 中止请求

#### 1.2 代码示例

```javascript
// 在 services/api.js 中的实现
const DEFAULT_TIMEOUT = 30000; // 默认30秒超时

const request = async (url, options = {}) => {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  
  // 创建超时控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    // 处理响应...
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API请求超时:', url);
      throw new Error('请求超时，请稍后重试');
    }
    // 其他错误处理...
  }
};
```

### 2. curl 命令

#### 2.1 超时参数
- **连接超时**：`--connect-timeout 10` （10秒连接超时）
- **最大时间**：`--max-time 30` （30秒总超时）

#### 2.2 代码示例

```bash
# 带超时的curl命令
curl --connect-timeout 10 --max-time 30 -X GET "http://localhost:3000/api/xxx"
```

### 3. 其他网络操作

#### 3.1 Node.js 中的 http/https 请求
```javascript
const options = {
  timeout: 30000 // 30秒超时
};

const req = https.request(url, options, (res) => {
  // 处理响应...
});

req.on('timeout', () => {
  req.destroy();
  throw new Error('请求超时');
});
```

---

## 为什么需要这个规则

1. **避免AI编程时卡死**：网络请求可能因为各种原因无响应
2. **提升用户体验**：超时后给出明确的错误提示，而不是无限等待
3. **资源管理**：及时释放超时的连接资源
4. **错误恢复**：让用户可以重试，而不是一直等待

---

## 检查清单

在提交代码前，检查以下内容：

- [ ] 所有前端fetch调用都设置了超时
- [ ] 所有curl命令都使用了`--max-time`参数
- [ ] 超时错误有友好的错误提示
- [ ] 超时时间设置合理（30-60秒）
- [ ] 超时后请求被正确中止

---

## 例外情况

以下情况可以不使用超时（但仍推荐使用）：
- 本地开发环境的快速网络测试
- 特殊业务需求需要更长等待时间的场景（但必须记录原因）

---

## 相关文件

- [services/api.js](file:///workspace/babymemo/services/api.js) - 前端API调用封装（已实现超时）
- [test_api_connection.js](file:///workspace/babymemo/test_api_connection.js) - API连接测试脚本（需要更新）

---

**最后更新：2026-04-18**