# Search1API – Usage Examples

> This file is loaded on demand. Read it when you need more examples beyond the basics in SKILL.md.

Examples below show both MCP tool calls and equivalent shell commands.

## 1. Quick web search

**MCP:**
```json
search({ "query": "Claude Code skills best practices", "max_results": 5 })
```

**Shell:**
```bash
bash scripts/search.sh "Claude Code skills best practices" 5
```

## 2. Non-English search with language detection

When the query is in a non-English language, set the language parameter and consider a region-appropriate search engine.

**MCP:**
```json
search({ "query": "大语言模型最新进展", "max_results": 10, "search_service": "baidu", "language": "zh", "time_range": "month" })
```

**Shell:**
```bash
bash scripts/search.sh "大语言模型最新进展" 10 baidu zh month
```

## 3. Domain-scoped search

Restrict results to specific sites using include_sites (MCP only; for shell, construct the payload manually).

**MCP:**
```json
search({ "query": "transformer architecture", "max_results": 5, "include_sites": ["arxiv.org", "openai.com"] })
```

**Shell:**
```bash
jq -n '{query:"transformer architecture",max_results:5,include_sites:["arxiv.org","openai.com"]}' | \
  curl -sS -X POST "https://api.search1api.com/search" \
    -H "Authorization: Bearer $SEARCH1API_KEY" \
    -H "Content-Type: application/json" \
    -d @-
```

## 4. Breaking news

**MCP:**
```json
news({ "query": "AI regulation", "max_results": 10, "time_range": "day" })
```

**Shell:**
```bash
bash scripts/news.sh "AI regulation" 10 google en day
```

## 5. Trending → news deep dive

**Step 1 – discover trending topics:**

**MCP:**
```json
trending({ "search_service": "hackernews", "max_results": 10 })
```

**Shell:**
```bash
bash scripts/trending.sh hackernews 10
```

**Step 2 – search for details on an interesting topic:**

**MCP:**
```json
search({ "query": "interesting topic from step 1", "max_results": 5, "time_range": "week" })
```

**Step 3 – crawl the most relevant result:**

**MCP:**
```json
crawl({ "url": "https://example.com/full-article" })
```

## 6. URL summarization

User shares a link and wants a summary.

**MCP:**
```json
crawl({ "url": "https://example.com/blog-post" })
```

**Shell:**
```bash
bash scripts/crawl.sh "https://example.com/blog-post"
```

Then summarize the returned markdown content.

## 7. Extract product data

**MCP:**
```json
extract({
  "url": "https://example.com/product/123",
  "prompt": "Extract the product name, price, rating, and number of reviews",
  "schema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "price": { "type": "string" },
      "rating": { "type": "number" },
      "review_count": { "type": "integer" }
    },
    "required": ["name", "price"]
  }
})
```

**Shell:**
```bash
bash scripts/extract.sh \
  "https://example.com/product/123" \
  "Extract the product name, price, rating, and number of reviews" \
  '{"type":"object","properties":{"name":{"type":"string"},"price":{"type":"string"},"rating":{"type":"number"},"review_count":{"type":"integer"}},"required":["name","price"]}'
```

## 8. Extract a list of items

**MCP:**
```json
extract({
  "url": "https://example.com/blog",
  "prompt": "Extract all article titles and their publication dates",
  "schema": {
    "type": "object",
    "properties": {
      "articles": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "date": { "type": "string" }
          },
          "required": ["title", "date"]
        }
      }
    },
    "required": ["articles"]
  }
})
```

## 9. Sitemap discovery

**MCP:**
```json
sitemap({ "url": "https://docs.example.com" })
```

**Shell:**
```bash
bash scripts/sitemap.sh "https://docs.example.com"
```

## 10. Deep research workflow

A complete multi-step research pipeline:

**Step 1 – broad search:**
```json
search({ "query": "zero-knowledge proofs applications", "max_results": 15, "time_range": "year" })
```

**Step 2 – crawl top results for full content:**
```json
crawl({ "url": "https://result1.com/article" })
crawl({ "url": "https://result2.com/article" })
crawl({ "url": "https://result3.com/article" })
```

**Step 3 – check for recent news:**
```json
news({ "query": "zero-knowledge proofs", "max_results": 5, "time_range": "week" })
```

**Step 4 – synthesize all gathered content into a report.**

## 11. Platform-specific search

Search within a specific platform by setting search_service:

```json
search({ "query": "MCP server best practices", "search_service": "github", "max_results": 10 })
search({ "query": "AI agent framework", "search_service": "reddit", "max_results": 10 })
search({ "query": "attention mechanism explained", "search_service": "arxiv", "max_results": 10 })
search({ "query": "LLM tutorial", "search_service": "youtube", "max_results": 5 })
```

## 12. Check API quota

**MCP:**
```json
usage()
```

**Shell:**
```bash
bash scripts/usage.sh
```
