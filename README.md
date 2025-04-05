# Search1API MCP Server

[中文文档](./README_zh.md)

A Model Context Protocol (MCP) server that provides search and crawl functionality using Search1API.

## Prerequisites

- Node.js >= 18.0.0
- A valid Search1API API key (See **Setup Guide** below on how to obtain and configure)

## Installation (Standalone / General)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fatwang2/search1api-mcp.git
    cd search1api-mcp
    ```

2.  **Configure API Key:** Before building, you need to provide your Search1API key. See the **Setup Guide** section below for different methods (e.g., using a `.env` file or environment variables).

3.  **Install dependencies and build:**
    ```bash
    npm install
    npm run build
    ```
    *Note: If using the project's `.env` file method for the API key, ensure it exists before this step.*

## Usage (Standalone / General)

Ensure your API key is configured (see **Setup Guide**).

Start the server:
```bash
npm start
```

The server will then be ready to accept connections from MCP clients.

## Setup Guide

### 1. Get Search1API Key

1.  Register at [Search1API](https://www.search1api.com/?utm_source=mcp)
2.  Get your API key from your dashboard.

### 2. Configure API Key

You need to make your API key available to the server. Choose **one** of the following methods:

**Method A: Project `.env` File (Recommended for Standalone or LibreChat)**

This method is required if integrating with the current version of LibreChat (see specific section below).

1.  In the `search1api-mcp` project root directory, create a file named `.env`:
    ```bash
    # In the search1api-mcp directory
    echo "SEARCH1API_KEY=your_api_key_here" > .env
    ```
2.  Replace `your_api_key_here` with your actual key.
3.  Make sure this file exists **before** running `npm install && npm run build`.

**Method B: Environment Variable (Standalone Only)**

Set the `SEARCH1API_KEY` environment variable before starting the server.

```bash
export SEARCH1API_KEY="your_api_key_here"
npm start
```

**Method C: MCP Client Configuration (Advanced)**

Some MCP clients allow specifying environment variables directly in their configuration. This is useful for clients like Cursor, VS Code extensions, etc.

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

**Note for LibreChat Users:** Due to current limitations in LibreChat, Method A (Project `.env` File) is the **required** method. See the dedicated integration section below for full instructions.

## Integration with LibreChat (Docker)

This section details the required steps for integrating with LibreChat via Docker.

**Overview:**

1.  Clone this server's repository into a location accessible by your LibreChat `docker-compose.yml`.
2.  Configure the required API key using the **Project `.env` File method** within this server's directory.
3.  Build this server.
4.  Tell LibreChat how to run this server by editing `librechat.yaml`.
5.  Make sure the built server code is available inside the LibreChat container via a Docker volume bind.
6.  Restart LibreChat.

**Step-by-Step:**

1.  **Clone the Repository:**
    Navigate to the directory on your host machine where you manage external services for LibreChat (this is often alongside your `docker-compose.yml`). A common location is a dedicated `mcp-server` directory.
    ```bash
    # Example: Navigate to where docker-compose.yml lives, then into mcp-server
    cd /path/to/your/librechat/setup/mcp-server
    git clone https://github.com/fatwang2/search1api-mcp.git
    ```

2.  **Navigate into the Server Directory:**
    ```bash
    cd search1api-mcp
    ```

3.  **Configure API Key (Project `.env` File Method - Required for LibreChat):**
    ```bash
    # Create the .env file
    echo "SEARCH1API_KEY=your_api_key_here" > .env
    # IMPORTANT: Replace 'your_api_key_here' with your actual Search1API key
    ```

4.  **Install Dependencies and Build:**
    This step compiles the server code into the `build` directory.
    ```bash
    npm install
    npm run build
    ```

5.  **Configure `librechat.yaml`:**
    Edit your main `librechat.yaml` file to tell LibreChat how to execute this MCP server. Add an entry under `mcp_servers`:
    ```yaml
    # In your main librechat.yaml
    mcp_servers:
      # You can add other MCP servers here too
      search1api:
        # Optional: Display name for the server in LibreChat UI
        # name: Search1API Tools

        # Command tells LibreChat to use 'node'
        command: node

        # Args specify the script for 'node' to run *inside the container*
        args:
          - /app/mcp-server/search1api-mcp/build/index.js
    ```
    *   The `args` path (`/app/...`) is the location *inside* the LibreChat API container where the built server will be accessed (thanks to the volume bind in the next step).

6.  **Configure Docker Volume Bind:**
    Edit your `docker-compose.yml` (or more likely, your `docker-compose.override.yml`) to map the `search1api-mcp` directory from your host machine into the LibreChat API container. Find the `volumes:` section for the `api:` service:
    ```yaml
    # In your docker-compose.yml or docker-compose.override.yml
    services:
      api:
        # ... other service config ...
        volumes:
          # ... other volumes likely exist here ...

          # Add this volume bind:
          - ./mcp-server/search1api-mcp:/app/mcp-server/search1api-mcp
    ```
    *   **Host Path (`./mcp-server/search1api-mcp`):** This is the path on your host machine *relative* to where your `docker-compose.yml` file is located. Adjust it if you cloned the repo elsewhere.
    *   **Container Path (`:/app/mcp-server/search1api-mcp`):** This is the path *inside* the container. It **must match** the directory structure used in the `librechat.yaml` `args` path.

7.  **Restart LibreChat:**
    Apply the changes by rebuilding (if you modified `docker-compose.yml`) and restarting your LibreChat stack.
    ```bash
    docker compose down && docker compose up -d --build
    # Or: docker compose restart api (if only librechat.yaml changed)
    ```

Now, the Search1API server should be available as a tool provider within LibreChat.

## Features

- Web search functionality
- News search functionality
- Web page content extraction
- Website sitemap extraction
- Deep thinking and complex problem solving with DeepSeek R1
- Seamless integration with Claude Desktop, Cursor, Windsurf, Cline and other MCP clients

## Tools

### 1. Search Tool
- Name: `search`
- Description: Search the web using Search1API
- Parameters:
  * `query` (required): Search query in natural language. Be specific and concise for better results
  * `max_results` (optional, default: 10): Number of results to return
  * `search_service` (optional, default: "google"): Search service to use (google, bing, duckduckgo, yahoo, x, reddit, github, youtube, arxiv, wechat, bilibili, imdb, wikipedia)
  * `crawl_results` (optional, default: 0): Number of results to crawl for full webpage content
  * `include_sites` (optional): List of sites to include in search
  * `exclude_sites` (optional): List of sites to exclude from search
  * `time_range` (optional): Time range for search results ("day", "month", "year")

### 2. News Tool
- Name: `news`
- Description: Search for news articles using Search1API
- Parameters:
  * `query` (required): Search query in natural language. Be specific and concise for better results
  * `max_results` (optional, default: 10): Number of results to return
  * `search_service` (optional, default: "bing"): Search service to use (google, bing, duckduckgo, yahoo, hackernews)
  * `crawl_results` (optional, default: 0): Number of results to crawl for full webpage content
  * `include_sites` (optional): List of sites to include in search
  * `exclude_sites` (optional): List of sites to exclude from search
  * `time_range` (optional): Time range for search results ("day", "month", "year")

### 3. Crawl Tool
- Name: `crawl`
- Description: Extract content from a URL using Search1API
- Parameters:
  * `url` (required): URL to crawl

### 4. Sitemap Tool
- Name: `sitemap`
- Description: Get all related links from a URL
- Parameters:
  * `url` (required): URL to get sitemap

### 5. Reasoning Tool
- Name: `reasoning`
- Description: A tool for deep thinking and complex problem solving with fast deepseek r1 model and web search ability(You can change to any other model in search1api website but the speed is not guaranteed)
- Parameters:
  * `content` (required): The question or problem that needs deep thinking

### 6. Trending Tool
- Name: `trending`
- Description: Get trending topics from popular platforms
- Parameters:
  * `search_service` (required): Specify the platform to get trending topics from (github, hackernews)
  * `max_results` (optional, default: 10): Maximum number of trending items to return

## Version History

- v0.2.0: Added fallback `.env` support for LibreChat integration and updated dependencies.
- v0.1.8: Added X(Twitter) and Reddit search services
- v0.1.7: Added Trending tool for GitHub and Hacker News
- v0.1.6: Added Wikipedia search service
- v0.1.5: Added new search parameters (include_sites, exclude_sites, time_range) and new search services (arxiv, wechat, bilibili, imdb)
- v0.1.4: Added reasoning tool with deepseek r1 and updated the Cursor and Windsurf configuration guide
- v0.1.3: Added news search functionality
- v0.1.2: Added sitemap functionality
- v0.1.1: Added web crawling functionality
- v0.1.0: Initial release with search functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
