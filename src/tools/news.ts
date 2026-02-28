import { NewsArgs, NewsResponse, isValidNewsArgs } from '../types.js';
import { makeRequest } from '../api.js';
import { formatError, log } from '../utils.js';
import { API_CONFIG } from '../config.js';
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

/**
 * Implementation of the news search tool
 */
export async function handleNews(args: unknown, apiKey?: string) {
  if (!isValidNewsArgs(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid news search arguments"
    );
  }

  log("Processing news search with query:", (args as NewsArgs).query);

  try {
    const response = await makeRequest<NewsResponse>(
      API_CONFIG.ENDPOINTS.NEWS,
      args,
      apiKey
    );
    
    return {
      content: [{
        type: "text",
        mimeType: "application/json",
        text: JSON.stringify(response.results, null, 2)
      }]
    };
  } catch (error) {
    log("News search error:", error);
    return {
      content: [{
        type: "text",
        mimeType: "text/plain",
        text: `News API error: ${formatError(error)}`
      }],
      isError: true
    };
  }
}