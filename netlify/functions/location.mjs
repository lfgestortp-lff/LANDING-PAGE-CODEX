// Netlify Functions v2 supplies coarse IP geolocation through context.geo.
// No external API, GPS permission, raw IP or coordinates are used here.
export default function location(request, context = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff"
  };
  if (request.method !== "GET") return new Response(JSON.stringify({ ok: false }), { status: 405, headers });
  const geo = context.geo || {};
  const text = (value) => typeof value === "string" ? value.trim().slice(0, 120) : "";
  const estimated = {
    city: text(geo.city),
    state: text(geo.subdivision?.name || geo.subdivision?.code),
    country: text(geo.country?.name || geo.country?.code)
  };
  if (!Object.values(estimated).some(Boolean)) {
    return new Response(JSON.stringify({ ok: false }), { headers });
  }
  return new Response(JSON.stringify({ ok: true, ...estimated, source: "netlify_ip", accuracy: "approximate" }), { headers });
}
