const EVENTS = new Set(["PageView", "AttendanceYes", "AttendanceNo", "FormStart", "ReviewData", "ConfirmSubmit", "Lead"]);
const reply = (statusCode, payload) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(payload)
});

// Dependencies are injectable for tests; no credentials are bundled into the page.
export function createHandler({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now } = {}) {
  return async function handler(request) {
    if (request.httpMethod !== "POST") return reply(405, { ok: false, code: "METHOD_NOT_ALLOWED" });
    if (!request.body || request.isBase64Encoded || request.body.length > 8192) {
      return reply(400, { ok: false, code: "INVALID_BODY" });
    }
    const headers = Object.fromEntries(Object.entries(request.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    let site;
    try { site = new URL(env.URL || "https://zippy-selkie-9f0252.netlify.app"); }
    catch { return reply(503, { ok: false, code: "CONFIGURATION_REQUIRED" }); }
    if (headers.origin !== site.origin) return reply(403, { ok: false, code: "ORIGIN_NOT_ALLOWED" });
    let data;
    try { data = JSON.parse(request.body); }
    catch { return reply(400, { ok: false, code: "INVALID_BODY" }); }
    if (data?.consent !== true) return reply(403, { ok: false, code: "CONSENT_REQUIRED" });
    const currentTime = Math.floor(now() / 1000);
    if (!EVENTS.has(data.event_name) || typeof data.event_id !== "string" || !/^[A-Za-z0-9-]{1,100}$/.test(data.event_id) ||
        !Number.isInteger(data.event_time) || data.event_time < currentTime - 7 * 86400 || data.event_time > currentTime + 60) {
      return reply(400, { ok: false, code: "INVALID_EVENT" });
    }
    let source;
    try {
      source = new URL(data.event_source_url);
      if (source.origin !== site.origin) throw new Error("Invalid source");
      source.search = "";
      source.hash = "";
    } catch { return reply(400, { ok: false, code: "INVALID_SOURCE" }); }
    const pixelId = env.META_PIXEL_ID || "1801282187897715";
    if (!env.META_CAPI_ACCESS_TOKEN || !/^\d+$/.test(pixelId)) {
      return reply(503, { ok: false, code: "CONFIGURATION_REQUIRED" });
    }
    // The connection IP comes from Netlify's proxy, never the request payload.
    const ip = headers["x-nf-client-connection-ip"];
    const agent = headers["user-agent"];
    if (!ip || !agent) return reply(400, { ok: false, code: "MATCH_DATA_REQUIRED" });
    const userData = { client_ip_address: ip, client_user_agent: agent.slice(0, 1000) };
    for (const field of ["fbp", "fbc"]) {
      if (typeof data[field] === "string" && /^fb\.\d\.\d+\.[A-Za-z0-9_.-]{1,500}$/.test(data[field])) userData[field] = data[field];
    }
    const payload = {
      data: [{
        event_name: data.event_name,
        event_id: data.event_id,
        event_time: data.event_time,
        action_source: "website",
        event_source_url: source.href,
        user_data: userData
      }]
    };
    if (env.META_TEST_EVENT_CODE) payload.test_event_code = env.META_TEST_EVENT_CODE;
    try {
      const response = await fetchImpl(`https://graph.facebook.com/v23.0/${pixelId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.META_CAPI_ACCESS_TOKEN}` },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      const result = await response.json();
      if (!response.ok || result.events_received !== 1) {
        // Do not return/log token, IP, browser identifiers or Meta response bodies.
        return reply(response.status === 429 ? 429 : 502, { ok: false, code: "META_NOT_ACCEPTED" });
      }
      return reply(200, { ok: true, events_received: result.events_received });
    } catch { return reply(502, { ok: false, code: "META_UNAVAILABLE" }); }
  };
}

export const handler = createHandler();
