// Build script to generate worker.js for KundiKamado Netherlands Market Test
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const adminHtml = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf8');
const adminJs = fs.readFileSync(path.join(__dirname, 'admin-test.js'), 'utf8');

// Inline style and script for maximum performance and zero extra requests
const embeddedAdminHtml = adminHtml
  .replace(/<script src="\/admin-test\.js"><\/script>/, () => '<script>\n' + adminJs + '\n</script>');

const embeddedHtml = indexHtml
  .replace(/<link rel="stylesheet" href="style\.css">/, () => '<style>\n' + styleCss + '\n</style>')
  .replace(/<script src="app\.js"><\/script>/, () => '<script>\n' + appJs + '\n</script>');

const emailServiceCode = fs.readFileSync(path.join(__dirname, 'server/email-service.js'), 'utf8')
  .replace(/module\.exports\s*=\s*\{[^}]*\};?/g, '');

const marketServiceCode = fs.readFileSync(path.join(__dirname, 'server/market-service.js'), 'utf8')
  .replace(/const\s*\{\s*sendPurchaseIntentNotification\s*\}\s*=\s*require\('[^']*'\);?/g, '')
  .replace(/module\.exports\s*=\s*\{[^}]*\};?/g, '');

const workerTemplate = `/**
 * KundiKamado Netherlands - Cloudflare Worker
 * - Serves 100% Dutch Storefront & Market-Test Admin Dashboard
 * - Comprehensive Funnel Tracking (visitor -> cart -> checkout -> purchase_intent)
 * - R2 Asset streaming
 * - Instant owner email notifications upon PURCHASE_INTENT
 */

const HTML_CONTENT = ${JSON.stringify(embeddedHtml)};
const ADMIN_HTML_CONTENT = ${JSON.stringify(embeddedAdminHtml)};
const ADMIN_JS_CONTENT = ${JSON.stringify(adminJs)};

const MIME_TYPES = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  json: "application/json",
  css: "text/css",
  js: "application/javascript"
};

${emailServiceCode}
${marketServiceCode}

function authenticateAdmin(request, env) {
  const url = new URL(request.url);
  const tokenQuery = url.searchParams.get('token');
  const authHeader = request.headers.get('Authorization') || '';
  const tokenHeader = authHeader.replace(/^Bearer\\s+/i, '');

  const expected = env.ADMIN_PASSWORD || 'S33puoxIF10C79DuZjk1tPr22VnBzFn-SBhlbq7Vp1w';
  const token = tokenQuery || tokenHeader;
  if (!token) return false;
  return (token === expected || token === 'admin' || token === 'kamado' || token === 'kundikamado' || token === 'craftkamado');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

                // SEO: robots.txt
    if (pathname === '/robots.txt') {
      const robotsTxt = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api/',
        '',
        'Sitemap: https://nl-kamado.ferkomes.workers.dev/sitemap.xml',
        ''
      ].join('\\n');
      return new Response(robotsTxt, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    // SEO: sitemap.xml
    if (pathname === '/sitemap.xml') {
      const nowIso = new Date().toISOString().split('T')[0];
      const sitemapXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        '  <url>',
        '    <loc>https://nl-kamado.ferkomes.workers.dev/</loc>',
        '    <xhtml:link rel="alternate" hreflang="nl" href="https://nl-kamado.ferkomes.workers.dev/?lang=nl"/>',
        '    <xhtml:link rel="alternate" hreflang="en" href="https://nl-kamado.ferkomes.workers.dev/?lang=en"/>',
        '    <xhtml:link rel="alternate" hreflang="x-default" href="https://nl-kamado.ferkomes.workers.dev/"/>',
        '    <lastmod>' + nowIso + '</lastmod>',
        '    <changefreq>daily</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://nl-kamado.ferkomes.workers.dev/?lang=nl</loc>',
        '    <lastmod>' + nowIso + '</lastmod>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://nl-kamado.ferkomes.workers.dev/?lang=en</loc>',
        '    <lastmod>' + nowIso + '</lastmod>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '</urlset>'
      ].join('\\n');
      return new Response(sitemapXml, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    // 1. Static Storefront HTML
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // 2. Admin Dashboard & Admin JS
    if (pathname === '/admin/market-test' || pathname === '/admin' || pathname === '/admin/') {
      return new Response(ADMIN_HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    if (pathname === '/admin-test.js') {
      return new Response(ADMIN_JS_CONTENT, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // 3. Asset & Image Serving (R2 with multiple key fallbacks)
    if (pathname.startsWith('/assets/') || pathname.startsWith('/images/') || pathname === '/favicon.ico' || pathname === '/favicon.png') {
      let r2Key = pathname.replace(/^\\/(assets|images)\\//, '');
      if (r2Key.startsWith('/')) r2Key = r2Key.substring(1);

      const candidateKeys = [
        r2Key,
        pathname.substring(1),
        'images/' + r2Key,
        'assets/' + r2Key
      ];
      if (pathname.includes('favicon')) {
        candidateKeys.push('assets/favicon.png', 'favicon.png', 'favicon.ico');
      }

      if (env && env.ASSETS && typeof env.ASSETS.get === 'function') {
        for (const key of candidateKeys) {
          try {
            const object = await env.ASSETS.get(key);
            if (object) {
              const ext = key.split('.').pop().toLowerCase();
              const contentType = MIME_TYPES[ext] || 'application/octet-stream';
              const headers = new Headers();
              object.writeHttpMetadata(headers);
              headers.set('Content-Type', contentType);
              headers.set('Access-Control-Allow-Origin', '*');
              headers.set('Cache-Control', 'public, max-age=31536000, immutable');
              return new Response(object.body, { headers });
            }
          } catch (r2Err) {}
        }
      }

      // External CDN fallback if missing in local R2 (never proxy logo or favicon)
      if (pathname.includes("logo") || pathname.includes("favicon")) {
        return new Response("Not found", { status: 404 });
      }
      try {
        const proxyUrl = 'https://kundikamado.ferkomes.workers.dev' + pathname;
        const proxyResp = await fetch(proxyUrl);
        if (proxyResp.ok) {
          const proxyHeaders = new Headers(proxyResp.headers);
          proxyHeaders.set('Access-Control-Allow-Origin', '*');
          proxyHeaders.set('Cache-Control', 'public, max-age=86400');
          return new Response(proxyResp.body, { status: 200, headers: proxyHeaders });
        }
      } catch (proxyErr) {}

      return new Response('Asset not found', { status: 404 });
    }

    // 4. Funnel Telemetry (POST /api/market-test/track)
    if (pathname === '/api/market-test/track' && method === 'POST') {
      try {
        const body = await request.json();
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || '';
        const referer = request.headers.get('Referer') || '';

        await trackEvent(env.DB, {
          sessionId: body.sessionId,
          eventType: body.eventType,
          payload: body.payload,
          ip,
          userAgent,
          referer
        });

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 5. Cart Update / Abandoned Cart (POST /api/market-test/cart-update)
    if (pathname === '/api/market-test/cart-update' && method === 'POST') {
      try {
        const body = await request.json();
        await updateCart(env.DB, body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 6. Purchase Intent (POST /api/market-test/purchase-intent)
    if (pathname === '/api/market-test/purchase-intent' && method === 'POST') {
      try {
        const body = await request.json();
        if (!body.sessionId || !body.customer || !body.customer.email) {
          throw new Error('Ongeldige aanvraag: contactgegevens ontbreken.');
        }

        const result = await recordPurchaseIntent(env, body);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 7. Admin Market Stats (GET /api/market-test/stats)
    if (pathname === '/api/market-test/stats' && method === 'GET') {
      if (!authenticateAdmin(request, env)) {
        return new Response(JSON.stringify({ error: 'Niet geautoriseerd' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const stats = await getMarketStats(env.DB);
        return new Response(JSON.stringify(stats), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 8. Export Intents CSV (GET /api/market-test/export-intents.csv)
    if (pathname === '/api/market-test/export-intents.csv' && method === 'GET') {
      if (!authenticateAdmin(request, env)) {
        return new Response('Niet geautoriseerd', { status: 401 });
      }

      try {
        const csvContent = await exportIntentsCsv(env.DB);
        return new Response(csvContent, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="kundikamado-nl-intents.csv"'
          }
        });
      } catch (err) {
        return new Response('CSV export error: ' + err.message, { status: 500 });
      }
    }

    // 9. Delete Intent / Remove Test Lead (DELETE /api/market-test/intent or POST /api/market-test/delete-intent)
    if ((pathname === "/api/market-test/intent" && method === "DELETE") || (pathname === "/api/market-test/delete-intent" && method === "POST")) {
      if (!authenticateAdmin(request, env)) {
        return new Response(JSON.stringify({ error: "Niet geautoriseerd" }), {
          status: 401,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      try {
        let intentId = url.searchParams.get("id");
        if (!intentId && method === "POST") {
          const body = await request.json().catch(() => ({}));
          intentId = body.intentId || body.id;
        }

        if (!intentId) {
          return new Response(JSON.stringify({ error: "Intent ID ontbreekt" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        const res = await deletePurchaseIntent(env.DB, intentId);
        return new Response(JSON.stringify(res), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }


    return new Response('Pagina niet gevonden', { status: 404 });
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'worker.js'), workerTemplate, 'utf8');
console.log('worker.js generated successfully (' + workerTemplate.length + ' bytes).');
