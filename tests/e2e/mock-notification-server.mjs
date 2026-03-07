import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_NOTIFICATION_PORT || 4011);
const events = [];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
    });

    request.on("end", () => {
      if (!raw) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({ raw });
      }
    });

    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  const method = request.method || "GET";
  const url = request.url || "/";

  if (method === "GET" && url === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (method === "GET" && url === "/events") {
    sendJson(response, 200, { count: events.length, events });
    return;
  }

  if (method === "DELETE" && url === "/events") {
    events.length = 0;
    sendJson(response, 200, { cleared: true });
    return;
  }

  if (method === "POST" && url.startsWith("/webhooks/")) {
    const body = await readBody(request);
    events.push({
      body,
      method,
      path: url,
      receivedAt: new Date().toISOString(),
    });

    sendJson(response, 200, { ok: true });
    return;
  }

  sendJson(response, 404, { error: "not_found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock notification server listening on 127.0.0.1:${PORT}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
