import {
  Server
} from "@modelcontextprotocol/sdk/server/index.js"; 
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  McpError, 
  ErrorCode,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall } from "./tools/handlers.js";
import { log, formatError } from "./utils.js";
import { handleListResources, handleReadResource } from "./resources.js";
import { ALL_TOOLS } from "./tools/index.js";

/**
 * Create and configure MCP server
 */
export function createServer() {
  log("Creating Search1API MCP server");

  // Create server instance
  const server = new Server({
    name: "search1api-server",
    version: "1.0.0"
  }, {
    capabilities: {
      resources: {},
      tools: {}
    }
  });

  // Set up request handlers
  setupRequestHandlers(server);

  // Create STDIO transport
  const transport = new StdioServerTransport();

  return {
    start: async () => {
      try {
        await server.connect(transport);
        log("Server started successfully");
      } catch (error) {
        log("Failed to start server:", error);
        throw error;
      }
    },
    stop: async () => {
      try {
        await server.close();
        log("Server stopped");
      } catch (error) {
        log("Error stopping server:", error);
      }
    }
  };
}

/**
 * Helper function to handle errors uniformly
 */
function handleError(context: string, error: unknown): never {
  log(`Error ${context}:`, error);
  
  if (error instanceof McpError) {
    throw error;
  }
  
  throw new McpError(
    ErrorCode.InternalError,
    `${context}: ${formatError(error)}`
  );
}

/**
 * Set up server request handlers
 */
function setupRequestHandlers(server: Server) {
  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const toolName = request.params.name;
      const toolArgs = request.params.arguments;
      
      log(`Tool call received: ${toolName}`);
      return await handleToolCall(toolName, toolArgs);
    } catch (error) {
      handleError("handling tool call", error);
    }
  });

  // Handle resource listing
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      return { resources: handleListResources() };
    } catch (error) {
      handleError("listing resources", error);
    }
  });

  // Handle resource reading
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    try {
      const resourceUri = request.params.uri;
      const resource = handleReadResource(resourceUri);
      
      return {
        contents: [{
          uri: resourceUri,
          mimeType: resource.mimeType || "application/json",
          text: JSON.stringify(resource)
        }]
      };
    } catch (error) {
      handleError("reading resource", error);
    }
  });

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: ALL_TOOLS };
  });

  // Handle global errors
  process.on("uncaughtException", (error) => {
    log("Uncaught exception:", error);
  });

  process.on("unhandledRejection", (reason) => {
    log("Unhandled rejection:", reason);
  });
}