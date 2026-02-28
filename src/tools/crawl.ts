import { CrawlArgs, CrawlResponse, isValidCrawlArgs } from '../types.js';
import { makeRequest } from '../api.js';
import { formatError, log } from '../utils.js';
import { API_CONFIG } from '../config.js';
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

/**
 * Implementation of the crawl tool
 */
export async function handleCrawl(args: unknown, apiKey?: string) {
  if (!isValidCrawlArgs(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid crawl arguments"
    );
  }

  const { url } = args;

  log("Starting crawl for:", url);

  try {
    const startTime = Date.now();
    const response = await makeRequest<CrawlResponse>(
      API_CONFIG.ENDPOINTS.CRAWL,
      { url },
      apiKey
    );
    const endTime = Date.now();
    log(`Crawl completed successfully in ${endTime - startTime}ms`);

    return {
      content: [{
        type: "text",
        mimeType: "application/json",
        text: JSON.stringify(response.results, null, 2)
      }]
    };
  } catch (error) {
    log("Crawl error:", error);
    return {
      content: [{
        type: "text",
        mimeType: "text/plain",
        text: `Crawl API error: ${formatError(error)}`
      }],
      isError: true
    };
  }
}