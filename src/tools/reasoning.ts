import { ReasoningArgs, ReasoningResponse, isValidReasoningArgs } from '../types.js';
import { makeRequest } from '../api.js';
import { formatError, log } from '../utils.js';
import { API_CONFIG } from '../config.js';
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

/**
 * Implementation of the deep thinking and complex reasoning tool
 */
export async function handleReasoning(args: unknown, apiKey?: string) {
  if (!isValidReasoningArgs(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid reasoning arguments"
    );
  }

  const { content } = args as ReasoningArgs;
  log("Processing reasoning request");

  try {
    // Convert to API required format
    const apiRequestData = {
      model: "deepseek-r1-70b-fast-online",
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      stream: false
    };

    const response = await makeRequest<ReasoningResponse>(
      API_CONFIG.ENDPOINTS.REASONING,
      apiRequestData,
      apiKey
    );
    
    // Directly use the correct structure of ReasoningResponse
    const resultText = response.choices && response.choices.length > 0
      ? response.choices[0].message.content
      : JSON.stringify(response);
    
    return {
      content: [{
        type: "text",
        mimeType: "text/plain",
        text: resultText
      }]
    };
  } catch (error) {
    log("Reasoning API error:", error);
    return {
      content: [{
        type: "text",
        mimeType: "text/plain",
        text: `Reasoning API error: ${formatError(error)}`
      }],
      isError: true
    };
  }
}