---
name: search1api
description: >
  Read, fetch, or summarize content from any URL or link the user shares.
  Also provides web search, news search, structured data extraction, sitemap
  discovery, trending topics, and deep reasoning via Search1API. Use this
  skill whenever the user pastes or sends a URL and wants to know what it
  says, get a summary, read the page, or extract information from it. Also
  use when the user asks to search the web, find news, look something up
  online, research a topic, do deep research, extract structured data from
  pages, discover sitemaps, check trending topics, or query API usage. This
  skill should be used even when the user doesn't explicitly say "search" —
  phrases like "find out about", "what's happening with", "look up", "any
  news on", "what does this link say", or sharing a bare URL all indicate
  this skill should be used. Supports multiple search engines (Google, Bing,
  DuckDuckGo, Baidu, Reddit, GitHub, YouTube, arXiv, etc.) with language
  and time-range filters.
---

# Search1API

Primary web search & content retrieval skill.

## Tool selection

If Search1API **MCP tools** are available in the current session (search, news, crawl, sitemap, trending, extract), prefer them over the shell scripts below. MCP tools accept the same parameters documented here.

If MCP tools are not available (e.g. OpenClaw or other bash-based agents), use the bundled shell scripts under `scripts/`.

## When to use

- **User shares a URL / link** → crawl the URL, then summarize the content
- **User asks to search** → web search with appropriate filters
- **User wants news** → news search, default time_range "day"
- **User wants deep research** → search + crawl top results + synthesize
- **User wants structured data** → extract with a JSON Schema
- **User wants to explore a site** → sitemap
- **User wants trending topics** → trending
- **User wants deep thinking on a problem** → reasoning
- **User asks about API quota** → usage

## Dynamic tuning

Adapt parameters to user intent rather than using fixed defaults:

- **Quick lookup** ("search for X", "what is X") → max_results: 5, no crawl
- **Deep research** ("research X thoroughly", "comprehensive analysis") → max_results: 15–20, then crawl top 3–5 results
- **User specifies a number** ("find 10 articles") → match it exactly
- **Query language detection** → if the query is non-English, set language accordingly (e.g. "zh" for Chinese). If the query is Chinese, also consider search_service: "baidu"
- **Recency signals** ("latest", "recent", "this week") → set time_range to "day" or "week". Otherwise omit time_range to get broader results
- **Domain-specific search** ("search on Reddit", "find GitHub repos") → set search_service to the matching platform (reddit, github, arxiv, youtube, etc.)

## Workflows

### Deep research
1. **search** → get 15–20 results for the topic
2. **crawl** → get full content of the top 3–5 most relevant pages
3. Synthesize findings into a coherent answer with source citations

### URL summarization
1. **crawl** → get the page content as markdown
2. Summarize or answer questions based on the content

### Trending + news monitoring
1. **trending** → discover hot topics on a platform
2. **news** → search for details on interesting items

### Structured data collection
1. **search** → locate target pages
2. **extract** → pull structured data with a JSON Schema

## Constraints

- Always use **crawl** (not search) when the user provides a specific URL
- The **news** tool defaults to time_range "day"; only override if the user asks for a different period
- **extract** requires both a natural-language prompt and a JSON Schema; construct the schema based on what the user wants to extract
- Do not set time_range on **search** unless the user explicitly wants recent results or uses recency language

## Operations (shell scripts)

### search
```bash
bash scripts/search.sh "<query>" [max_results] [search_service] [language] [time_range]
```
Returns JSON `{ results: [{ title, link, content }] }`.

### news
```bash
bash scripts/news.sh "<query>" [max_results] [search_service] [language] [time_range]
```
Same parameters as search. Default time_range is **day**.

### crawl
```bash
bash scripts/crawl.sh "<url>"
```
Returns clean markdown content of the page.

### sitemap
```bash
bash scripts/sitemap.sh "<url>"
```
Returns all discovered links on the URL / domain.

### trending
```bash
bash scripts/trending.sh [search_service] [max_results]
```
Platforms: google, github, hackernews. Default: google, 10 results.

### extract
```bash
bash scripts/extract.sh "<url>" "<prompt>" '<json_schema>'
```
Extracts structured data according to a prompt and JSON Schema.

### reasoning

MCP tool only (no shell script). Pass a complex question or problem for deep analysis.

```json
reasoning({ "content": "Analyze the pros and cons of microservices vs monolith for a startup" })
```

### usage
```bash
bash scripts/usage.sh
```
Returns current API quota and consumption stats.

## Authentication

API key resolution order:
1. OpenClaw config: `~/.openclaw/openclaw.json` → `skills.entries.search1api.apiKey`
2. Environment variable: `SEARCH1API_KEY`

## Error handling

- Auth errors → verify API key in config or environment
- HTTP 4xx/5xx → printed to stderr with status code and response body
- Scripts require `jq` for safe JSON construction

## References

- [Full parameter documentation](reference/api-parameters.md)
- [More usage examples](reference/examples.md)
- API base URL: `https://api.search1api.com`
