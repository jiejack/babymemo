# Agent 操作规则

## 网络操作规则

### curl 命令必须添加超时参数

**重要规则**：所有使用 `curl` 命令的网络操作必须添加超时参数，默认超时时间为 30 秒。

#### 必须使用的参数：
- `--max-time 30` - 总超时时间 30 秒
- `--connect-timeout 10` - 连接超时时间 10 秒

#### 正确示例：
```bash
# 带超时参数的 curl 命令
curl --connect-timeout 10 --max-time 30 -X GET "http://localhost:3000/api/xxx"
```

#### 错误示例：
```bash
# 错误：没有超时参数
curl -X GET "http://localhost:3000/api/xxx"
```

## 为什么需要这个规则

1. **避免Agent操作卡死**：网络请求可能因为各种原因无响应，导致Agent操作一直等待
2. **提升操作效率**：超时后可以及时失败并进行其他尝试
3. **资源管理**：及时释放超时的网络连接资源
4. **错误处理**：明确的超时错误可以帮助定位问题

## 其他网络操作规则

请参考 [NETWORK_RULES.md](file:///workspace/babymemo/NETWORK_RULES.md) 文件了解更多网络操作的超时设置规则。

---

**最后更新：2026-04-21**