#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./server.js";
import { log } from "./utils.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

const app = express();
app.use(express.json());

// Session storage: sessionId → { transport, server }
const sessions = new Map<string, {
  transport: StreamableHTTPServerTransport;
  server: Server;
}>();

/**
 * Extract API key from request: Authorization header > URL query parameter
 */
function extractApiKey(req: express.Request): string | undefined {
  // 1. Authorization: Bearer <key>
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7).trim() || undefined;
  }
  // 2. ?apiKey=<key>
  const queryKey = req.query.apiKey;
  if (typeof queryKey === "string" && queryKey.trim()) {
    return queryKey.trim();
  }
  return undefined;
}

/**
 * Check if a JSON-RPC request body is an initialize request
 */
function isInitializeRequest(body: unknown): boolean {
  if (Array.isArray(body)) {
    return body.some((msg) => typeof msg === "object" && msg !== null && (msg as Record<string, unknown>).method === "initialize");
  }
  return typeof body === "object" && body !== null && (body as Record<string, unknown>).method === "initialize";
}

// Handle POST /mcp — initialize or route to existing session
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  // Route to existing session
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    await session.transport.handleRequest(req, res, req.body);
    return;
  }

  // New session — must be an initialize request
  if (!sessionId && isInitializeRequest(req.body)) {
    const apiKey = extractApiKey(req);
    if (!apiKey) {
      res.status(401).json({
        jsonrpc: "2.0",
        error: {
          code: -32001,
          message: "API key is required. Pass it via 'Authorization: Bearer <key>' header or '?apiKey=<key>' query parameter.",
        },
        id: null,
      });
      return;
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        sessions.set(sid, { transport, server });
        log(`Session created: ${sid}`);
      },
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        sessions.delete(transport.sessionId);
        log(`Session closed: ${transport.sessionId}`);
      }
    };

    const server = createMcpServer(apiKey);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    return;
  }

  res.status(400).json({
    jsonrpc: "2.0",
    error: { code: -32600, message: "Bad request: no valid session or not an initialize request" },
    id: null,
  });
});

// Handle GET /mcp — SSE stream for existing session
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32600, message: "Invalid or missing session ID" },
      id: null,
    });
    return;
  }
  await sessions.get(sessionId)!.transport.handleRequest(req, res);
});

// Handle DELETE /mcp — session termination
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string;
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    await session.transport.handleRequest(req, res);
    await session.server.close();
    sessions.delete(sessionId);
    log(`Session terminated: ${sessionId}`);
  } else {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32600, message: "Invalid or missing session ID" },
      id: null,
    });
  }
});

const PORT = parseInt(process.env.PORT || "3000", 10);

app.listen(PORT, () => {
  log(`Search1API MCP HTTP server listening on http://localhost:${PORT}/mcp`);
});

// Handle global errors
process.on("uncaughtException", (error) => {
  log("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  log("Unhandled rejection:", reason);
});
