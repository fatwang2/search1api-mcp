# Search1API MCP 服务

[English](./README.md)

[Search1API](https://www.search1api.com/?utm_source=mcp) 官方 MCP 服务 — 一个 API 搞定搜索、新闻、爬虫等能力。

## 获取 API 密钥

1. 在 [Search1API](https://www.search1api.com/?utm_source=mcp) 注册
2. 从仪表板获取 API 密钥

## 快速开始（Remote MCP）

无需本地安装，直接在 MCP 客户端中配置远程 URL 和 API 密钥即可使用。

### 认证方式

支持两种方式，根据客户端能力选择：

| 方式 | 格式 |
|------|------|
| Authorization Header | `Authorization: Bearer YOUR_SEARCH1API_KEY` |
| URL Query 参数 | `https://mcp.search1api.com/mcp?apiKey=YOUR_SEARCH1API_KEY` |

### Claude Desktop

```json
{
  "mcpServers": {
    "search1api": {
      "url": "https://mcp.search1api.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

### Claude.ai（网页版）

Settings > Connectors > Add custom connector：

```
https://mcp.search1api.com/mcp?apiKey=YOUR_SEARCH1API_KEY
```

### Cursor

```json
{
  "mcpServers": {
    "search1api": {
      "url": "https://mcp.search1api.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

### VS Code

```json
{
  "servers": {
    "search1api": {
      "type": "http",
      "url": "https://mcp.search1api.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http search1api https://mcp.search1api.com/mcp \
  --header "Authorization: Bearer YOUR_SEARCH1API_KEY"
```

### Windsurf

```json
{
  "mcpServers": {
    "search1api": {
      "serverUrl": "https://mcp.search1api.com/mcp?apiKey=YOUR_SEARCH1API_KEY"
    }
  }
}
```

## 本地模式（stdio）

如果你更倾向于在本地运行，通过 npx 即可使用，无需克隆仓库：

```json
{
  "mcpServers": {
    "search1api": {
      "command": "npx",
      "args": ["-y", "search1api-mcp"],
      "env": {
        "SEARCH1API_KEY": "YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

## 工具

### search
搜索网页。

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `query` | 是 | - | 搜索关键词 |
| `max_results` | 否 | 10 | 返回结果数量 |
| `search_service` | 否 | google | google、bing、duckduckgo、yahoo、x、reddit、github、youtube、arxiv、wechat、bilibili、imdb、wikipedia |
| `crawl_results` | 否 | 0 | 需要爬取完整内容的结果数量 |
| `include_sites` | 否 | [] | 限定搜索的网站 |
| `exclude_sites` | 否 | [] | 排除的网站 |
| `time_range` | 否 | - | day、month、year |

### news
搜索新闻。

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `query` | 是 | - | 搜索关键词 |
| `max_results` | 否 | 10 | 返回结果数量 |
| `search_service` | 否 | bing | google、bing、duckduckgo、yahoo、hackernews |
| `crawl_results` | 否 | 0 | 需要爬取完整内容的结果数量 |
| `include_sites` | 否 | [] | 限定搜索的网站 |
| `exclude_sites` | 否 | [] | 排除的网站 |
| `time_range` | 否 | - | day、month、year |

### crawl
提取网页内容。

| 参数 | 必需 | 说明 |
|------|------|------|
| `url` | 是 | 目标 URL |

### sitemap
获取网站所有相关链接。

| 参数 | 必需 | 说明 |
|------|------|------|
| `url` | 是 | 目标 URL |

### reasoning
使用 DeepSeek R1 进行深度思考和复杂问题解决。

| 参数 | 必需 | 说明 |
|------|------|------|
| `content` | 是 | 需要深度思考的问题 |

### trending
获取平台热门话题。

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `search_service` | 是 | - | github、hackernews |
| `max_results` | 否 | 10 | 返回数量 |

## 版本历史

- v0.3.0: 新增 Remote MCP 支持（Streamable HTTP），per-session API 密钥认证
- v0.2.0: LibreChat 集成的 `.env` 回退支持
- v0.1.8: X (Twitter)、Reddit 搜索服务
- v0.1.7: GitHub、Hacker News 热榜工具
- v0.1.6: Wikipedia 搜索服务
- v0.1.5: 新增搜索参数及搜索服务（arxiv、wechat、bilibili、imdb）
- v0.1.4: DeepSeek R1 推理工具
- v0.1.3: 新闻搜索
- v0.1.2: 站点地图
- v0.1.1: 网页爬取
- v0.1.0: 首次发布

## 许可证

MIT
