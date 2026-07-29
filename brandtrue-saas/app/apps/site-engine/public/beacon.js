// Tiny first-party pageview beacon. Posts to the analytics_events table via
// the Supabase REST API using the public anon key (insert-only under RLS).
(function () {
  var meta = document.querySelector('meta[name="be-analytics"]');
  if (!meta) return;
  var siteId = meta.getAttribute("data-site-id");
  var url = meta.getAttribute("data-supabase-url");
  var key = meta.getAttribute("data-supabase-key");
  if (!siteId || !url || !key) return;

  // Anonymous per-browser visitor id (no cookies, no PII).
  var hash;
  try {
    hash = localStorage.getItem("be_vid");
    if (!hash) {
      hash = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("be_vid", hash);
    }
  } catch (e) {
    hash = null;
  }

  var body = JSON.stringify({
    site_id: siteId,
    path: location.pathname,
    referrer: document.referrer ? document.referrer.slice(0, 500) : null,
    visitor_hash: hash,
  });

  fetch(url + "/rest/v1/analytics_events", {
    method: "POST",
    keepalive: true,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: body,
  }).catch(function () {});
})();
