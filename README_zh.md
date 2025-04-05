# Search1API MCP 服务

[English](./README.md)

Search1API 官方 MCP 服务，一个 API 里实现搜索和爬虫。

## 先决条件

- Node.js >= 18.0.0
- 一个有效的 Search1API API 密钥 (请参阅下面的 **设置指南** 了解如何获取和配置)

## 安装 (独立 / 通用)

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/fatwang2/search1api-mcp.git
    cd search1api-mcp
    ```

2.  **配置 API 密钥:** 在构建之前，您需要提供您的 Search1API 密钥。请参阅下面的 **设置指南** 部分了解不同的方法 (例如，使用 `.env` 文件或环境变量)。

3.  **安装依赖并构建:**
    ```bash
    npm install
    npm run build
    ```
    *注意: 如果使用项目 `.env` 文件方法配置 API 密钥，请确保在执行此步骤之前该文件已存在。*

## 使用 (独立 / 通用)

确保您的 API 密钥已配置 (请参阅 **设置指南**)。

启动服务:
```bash
npm start
```

服务随后将准备好接受来自 MCP 客户端的连接。

## 设置指南

### 1. 获取 Search1API 密钥

1.  在 [Search1API](https://www.search1api.com/?utm_source=mcp) 注册
2.  从您的仪表板获取 API 密钥。

### 2. 配置 API 密钥

您需要让服务能够访问您的 API 密钥。选择以下 **一种** 方法：

**方法 A: 项目 `.env` 文件 (推荐用于独立使用或 LibreChat)**

如果与当前版本的 LibreChat 集成，则必须使用此方法 (请参阅下面的特定部分)。

1.  在 `search1api-mcp` 项目根目录中，创建一个名为 `.env` 的文件:
    ```bash
    # 在 search1api-mcp 目录中
    echo "SEARCH1API_KEY=your_api_key_here" > .env
    ```
2.  将 `your_api_key_here` 替换为您的实际密钥。
3.  请确保在运行 `npm install && npm run build` **之前** 此文件已存在。

**方法 B: 环境变量 (仅限独立使用)**

在启动服务之前设置 `SEARCH1API_KEY` 环境变量。

```bash
export SEARCH1API_KEY="your_api_key_here"
npm start
```

**方法 C: MCP 客户端配置 (高级)**

一些 MCP 客户端允许直接在其配置中指定环境变量。这对于像 Cursor、VS Code 扩展等客户端很有用。

```json
{
  "mcpServers": {
    "search1api": {
      "command": "npx",
      "args": [
        "-y",
        "search1api-mcp"
      ],
      "env": {
        "SEARCH1API_KEY": "YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

**LibreChat 用户请注意:** 由于 LibreChat 当前的限制，方法 A (项目 `.env` 文件) 是 **必需的** 方法。请参阅下面的专用集成部分以获取完整说明。

## 与 LibreChat 集成 (Docker)

本节详细介绍了通过 Docker 与 LibreChat 集成的必要步骤。

**概述:**

1.  将此服务的仓库克隆到 LibreChat `docker-compose.yml` 可访问的位置。
2.  在此服务目录中使用 **项目 `.env` 文件方法** 配置所需的 API 密钥。
3.  构建此服务。
4.  通过编辑 `librechat.yaml` 告知 LibreChat 如何运行此服务。
5.  确保通过 Docker 卷绑定使构建的服务代码在 LibreChat 容器内可用。
6.  重启 LibreChat。

**分步说明:**

1.  **克隆仓库:**
    导航到您的宿主机上管理 LibreChat 外部服务的目录 (通常与 `docker-compose.yml` 放在一起)。一个常见的位置是专用的 `mcp-server` 目录。
    ```bash
    # 示例: 导航到 docker-compose.yml 所在目录，然后进入 mcp-server
    cd /path/to/your/librechat/setup/mcp-server
    git clone https://github.com/fatwang2/search1api-mcp.git
    ```

2.  **进入服务目录:**
    ```bash
    cd search1api-mcp
    ```

3.  **配置 API 密钥 (项目 `.env` 文件方法 - LibreChat 必需):**
    ```bash
    # 创建 .env 文件
    echo "SEARCH1API_KEY=your_api_key_here" > .env
    # 重要: 将 'your_api_key_here' 替换为您的实际 Search1API 密钥
    ```

4.  **安装依赖并构建:**
    此步骤将服务代码编译到 `build` 目录中。
    ```bash
    npm install
    npm run build
    ```

5.  **配置 `librechat.yaml`:**
    编辑您的主 `librechat.yaml` 文件，告知 LibreChat 如何执行此 MCP 服务。在 `mcp_servers` 下添加一个条目:
    ```yaml
    # 在您的主 librechat.yaml 中
    mcp_servers:
      # 您也可以在此处添加其他 MCP 服务
      search1api:
        # 可选: 服务在 LibreChat UI 中的显示名称
        # name: Search1API 工具

        # command 告知 LibreChat 使用 'node'
        command: node

        # args 指定 'node' 在 *容器内* 运行的脚本
        args:
          - /app/mcp-server/search1api-mcp/build/index.js
    ```
    *   `args` 路径 (`/app/...`) 是构建的服务在 LibreChat API 容器*内部*被访问的位置 (通过下一步的卷绑定实现)。

6.  **配置 Docker 卷绑定:**
    编辑您的 `docker-compose.yml` (或者更可能是 `docker-compose.override.yml`)，将宿主机上的 `search1api-mcp` 目录映射到 LibreChat API 容器内。找到 `api:` 服务的 `volumes:` 部分:
    ```yaml
    # 在您的 docker-compose.yml 或 docker-compose.override.yml 中
    services:
      api:
        # ... 其他服务配置 ...
        volumes:
          # ... 其他卷可能已存在于此 ...

          # 添加此卷绑定:
          - ./mcp-server/search1api-mcp:/app/mcp-server/search1api-mcp
    ```
    *   **宿主机路径 (`./mcp-server/search1api-mcp`):** 这是宿主机上*相对于* `docker-compose.yml` 文件位置的路径。如果您将仓库克隆到其他地方，请相应调整。
    *   **容器路径 (`:/app/mcp-server/search1api-mcp`):** 这是容器*内部*的路径。它**必须匹配** `librechat.yaml` `args` 路径中使用的目录结构。

7.  **重启 LibreChat:**
    通过重建 (如果您修改了 `docker-compose.yml`) 和重启您的 LibreChat 堆栈来应用更改。
    ```bash
    docker compose down && docker compose up -d --build
    # 或者: docker compose restart api (如果仅更改了 librechat.yaml)
    ```

现在，Search1API 服务应该可以在 LibreChat 中作为工具提供者使用了。

## 功能特点

- 网页搜索
- 新闻搜索
- 网页内容提取
- 网站站点地图提取
- 使用 DeepSeek R1 进行深度思考和复杂问题解决
- 可以在 Claude Desktop、Cursor、Windsurf、Cline 等 MCP 客户端安装使用

## 工具

### 1. 搜索工具
- 名称：`search`
- 描述：使用 Search1API 搜索网页
- 参数：
  * `query`（必需）：用自然语言描述的搜索查询。请具体且简洁以获得更好的结果
  * `max_results`（可选，默认值：10）：返回结果的数量
  * `search_service`（可选，默认值："google"）：使用的搜索服务（google、bing、duckduckgo、yahoo、x、reddit、github、youtube、arxiv、wechat、bilibili、imdb、wikipedia）
  * `crawl_results`（可选，默认值：0）：需要爬取完整网页内容的结果数量
  * `include_sites`（可选）：搜索结果中要包含的网站列表
  * `exclude_sites`（可选）：搜索结果中要排除的网站列表
  * `time_range`（可选）：搜索结果的时间范围（"day"、"month"、"year"）

### 2. 新闻工具
- 名称：`news`
- 描述：使用 Search1API 搜索新闻文章
- 参数：
  * `query`（必需）：用自然语言描述的搜索查询。请具体且简洁以获得更好的结果
  * `max_results`（可选，默认值：10）：返回结果的数量
  * `search_service`（可选，默认值："bing"）：使用的搜索服务（google、bing、duckduckgo、yahoo、hackernews）
  * `crawl_results`（可选，默认值：0）：需要爬取完整网页内容的结果数量
  * `include_sites`（可选）：搜索结果中要包含的网站列表
  * `exclude_sites`（可选）：搜索结果中要排除的网站列表
  * `time_range`（可选）：搜索结果的时间范围（"day"、"month"、"year"）

### 3. 爬虫工具
- 名称：`crawl`
- 描述：使用 Search1API 提取 URL 内容
- 参数：
  * `url`（必需）：要爬取的 URL

### 4. 站点地图工具
- 名称：`sitemap`
- 描述：获取 URL 的所有相关链接
- 参数：
  * `url`（必需）：获取站点地图的 URL

### 5. 推理工具
- 名称：`reasoning`
- 描述：使用快速的 deepseek r1 模型和网络搜索能力进行深度思考和复杂问题解决（您可以在 search1api 网站上更换其他模型，但速度可能会受影响）
- 参数：
  * `content`（必需）：需要深度思考的问题或难题

### 6. 热榜工具
- 名称：`trending`
- 描述：获取流行平台的热门话题
- 参数：
  * `search_service`（必需）：指定获取热门话题的平台（github、hackernews）
  * `max_results`（可选，默认值：10）：返回的热门项目数量

## 版本历史

- v0.2.0: 为 LibreChat 集成添加了回退 `.env` 支持并更新了依赖项。
- v0.1.8: 新增对 X (Twitter)、Reddit 搜索服务支持
- v0.1.7: 添加热榜工具，目前支持 GitHub 和 Hacker News 榜单
- v0.1.6: 添加 Wikipedia 搜索服务
- v0.1.5: 添加了新的搜索参数 (include_sites、exclude_sites、time_range) 和新的搜索服务 (arxiv、wechat、bilibili、imdb)
- v0.1.4: 添加了使用 deepseek r1 的推理工具，并更新了 Cursor 和 Windsurf 配置指南
- v0.1.3: 添加了新闻搜索功能
- v0.1.2: 添加了站点地图功能
- v0.1.1: 添加了网页爬取功能
- v0.1.0: 首次发布，具有搜索功能

## 许可证

本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。