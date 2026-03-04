# Search1API – Full Parameter Reference

> This file is loaded on demand. Only read it when you need detailed parameter info beyond what SKILL.md provides.

## Base URL

```
https://api.search1api.com
```

All requests require `Authorization: Bearer <API_KEY>` header.

---

## POST /search

Web search across multiple engines.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| query | string | yes | — | Search query |
| max_results | integer | no | 10 | Number of results (1–20) |
| search_service | string | no | "google" | Search engine to use |
| crawl_results | integer | no | 0 | Number of results to also crawl for full page content |
| image | boolean | no | false | Include image results |
| include_sites | string[] | no | [] | Only return results from these domains |
| exclude_sites | string[] | no | [] | Exclude results from these domains |
| language | string | no | "en" | Language code |
| time_range | string | no | — | Filter by recency: day, week, month, year |

### Supported search_service values

| Value | Description |
|-------|-------------|
| google | Google Search |
| bing | Bing Search |
| duckduckgo | DuckDuckGo |
| yahoo | Yahoo Search |
| baidu | Baidu (best for Chinese content) |
| x | X / Twitter |
| reddit | Reddit |
| github | GitHub |
| youtube | YouTube |
| arxiv | arXiv papers |
| wechat | WeChat articles |
| bilibili | Bilibili |
| imdb | IMDB |
| wikipedia | Wikipedia |

### Response shape

```json
{
  "searchParameters": { "query": "...", ... },
  "results": [
    {
      "title": "Page Title",
      "link": "https://...",
      "content": "Snippet text..."
    }
  ]
}
```

---

## POST /news

News-specific search. Same parameters as `/search`.

Recommended defaults: `time_range: "day"` for breaking news, `"week"` or `"month"` for broader coverage.

### Supported search_service values for news

google, bing, duckduckgo, yahoo, hackernews.

---

## POST /crawl

Fetch a URL and return clean markdown content.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | yes | The URL to crawl |

### Response shape

```json
{
  "url": "https://...",
  "content": "# Page Title\n\nMarkdown body..."
}
```

---

## POST /sitemap

Discover all links on a URL or domain.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | yes | The URL / domain to scan |

### Response shape

```json
{
  "url": "https://...",
  "links": ["https://...", "https://...", ...]
}
```

---

## POST /trending

Get trending topics from a platform.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| search_service | string | no | "google" | Platform: google, github, hackernews |
| max_results | integer | no | 10 | Number of items (1–50) |

---

## POST /extract

Extract structured data from a page using a prompt and JSON Schema.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | yes | Page URL |
| prompt | string | yes | Natural-language instruction for what to extract |
| schema | object | yes | JSON Schema describing the desired output structure |

### Response shape

Returns a JSON object matching the provided schema.

---

## POST /reasoning

Deep thinking and complex problem solving.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | yes | The question or problem that needs deep analysis |

### Response shape

Returns a text response with the reasoning result.

---

## GET /usage

Returns current API quota and consumption. No parameters.

### Response shape

```json
{
  "plan": "...",
  "used": 1234,
  "limit": 10000,
  "reset_at": "2026-03-01T00:00:00Z"
}
```

---

## Language codes (common)

| Code | Language |
|------|----------|
| en | English |
| zh | Chinese |
| ja | Japanese |
| ko | Korean |
| fr | French |
| de | German |
| es | Spanish |
| pt | Portuguese |
| ru | Russian |
| ar | Arabic |
