#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { log } from "./utils.js";
import { createMcpServer } from "./server.js";
import { API_KEY } from "./config.js";

/**
 * Main function - Program entry point (stdio mode)
 */
async function main() {
  // Stdio mode requires API key at startup
  if (!API_KEY) {
    log("SEARCH1API_KEY environment variable is not set");
    process.exit(1);
  }

  try {
    log("Starting Search1API MCP server (stdio mode)");
    const server = createMcpServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);
    log("Server started successfully");

    // Handle process exit signals
    const exitHandler = async () => {
      log("Shutting down server...");
      await server.close();
      process.exit(0);
    };

    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);
    process.on("SIGUSR1", exitHandler);
    process.on("SIGUSR2", exitHandler);
  } catch (error) {
    log("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle global errors
process.on("uncaughtException", (error) => {
  log("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  log("Unhandled rejection:", reason);
});

// Start program
main().catch((error) => {
  log("Fatal error:", error);
  process.exit(1);
});
