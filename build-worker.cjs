// Build script to generate worker.js for SmokeyKamado Netherlands Market Test
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const inventorySeed = JSON.parse(fs.readFileSync(path.join(__dirname, 'inventory.json'), 'utf8'));
const inventoryCode = fs.readFileSync(path.join(__dirname, 'server/inventory-service.js'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const shippingCode = fs.readFileSync(path.join(__dirname, 'shipping-policy.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8').replace('/* SHIPPING_POLICY */', () => shippingCode).replace('/* MEDIA_GALLERY */', () => fs.readFileSync(path.join(__dirname, 'gallery.js'), 'utf8'));
const mediaCode = fs.readFileSync(path.join(__dirname, 'server/media-service.js'), 'utf8');
const supportCode = fs.readFileSync(path.join(__dirname, 'server/support-pages.js'), 'utf8');
const adminHtml = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf8');
const brandLogo = fs.readFileSync(path.join(__dirname, 'assets/smokey-logo.svg'), 'utf8');
const adminJs = fs.readFileSync(path.join(__dirname, 'admin-test.js'), 'utf8');

// Inline style and script for maximum performance and zero extra requests
const embeddedAdminHtml = adminHtml
  .replace(/<script src="\/admin-test\.js"><\/script>/, () => '<script>\n' + adminJs + '\n</script>');

const embeddedHtml = indexHtml
  .replace(/<link rel="stylesheet" href="style\.css">/, () => '<style>\n' + styleCss + '\n</style>')
  .replace(/<script src="app\.js"><\/script>/, () => '<script>\n' + appJs + '\n</script>');

// Read the storefront catalog once at build time to keep product routes in sync.
const vm = require('vm');
const catalogSource = appJs.slice(appJs.indexOf('  const KAMADO_MODELS'), appJs.indexOf('  // --- I18N DICTIONARY'));
const catalog = vm.runInNewContext(catalogSource + '\n({ KAMADO_MODELS, ACCESSORIES })');
const seoTranslations = vm.runInNewContext(appJs.slice(appJs.indexOf('  const TRANSLATIONS'), appJs.indexOf('  // --- ATTRIBUTION DETECTION')) + '\nTRANSLATIONS');
const seoCode = fs.readFileSync(path.join(__dirname, 'server/seo-pages.js'), 'utf8');
const productPages = {};
for (const key of ['18_basic', '18_premium', '21', '23', '27']) {
  productPages['/kamados/' + key.replace('_', '-')] = { ...catalog.KAMADO_MODELS[key], type: 'kamado' };
}
for (const accessory of catalog.ACCESSORIES) {
  productPages['/accessories/' + accessory.id] = { ...accessory, type: 'accessory' };
}
const storefrontPagesCode = fs.readFileSync(path.join(__dirname, 'server/storefront-pages.js'), 'utf8');
// Pre-render all crawlable language variants during build, not on every request.
const seoContext = vm.createContext({ PRODUCT_PAGES: productPages, SEO_TRANSLATIONS: seoTranslations });
vm.runInContext(storefrontPagesCode + '\n' + seoCode, seoContext);
const seoPages = {};
for (const route of ['/', ...Object.keys(productPages)]) {
  seoPages[route] = {};
  for (const lang of ['nl', 'en']) {
    const shell = route === '/' ? indexHtml : seoContext.productPageHtml(indexHtml, productPages[route], route);
    seoPages[route][lang] = seoContext.seoPageHtml(shell, route, lang);
  }
}
const seoSitemapContent = seoContext.seoSitemap();


const emailServiceCode = fs.readFileSync(path.join(__dirname, 'server/email-service.js'), 'utf8')
  .replace(/module\.exports\s*=\s*\{[^}]*\};?/g, '');

const marketServiceCode = fs.readFileSync(path.join(__dirname, 'server/market-service.js'), 'utf8')
  .replace(/const\s*\{\s*sendPurchaseIntentNotification\s*\}\s*=\s*require\('[^']*'\);?/g, '')
  .replace(/module\.exports\s*=\s*\{[^}]*\};?/g, '');

const workerTemplate = `/**
 * SmokeyKamado Netherlands - Cloudflare Worker
 * - Serves 100% Dutch Storefront & Market-Test Admin Dashboard
 * - Comprehensive Funnel Tracking (visitor -> cart -> checkout -> purchase_intent)
 * - R2 Asset streaming
 * - Instant owner email notifications upon PURCHASE_INTENT
 */

const SEO_PAGES = ${JSON.stringify(seoPages)};
const SEO_SITEMAP = ${JSON.stringify(seoSitemapContent)};
const STOREFRONT_CSS = ${JSON.stringify(styleCss)};
const STOREFRONT_JS = ${JSON.stringify(appJs)};
function renderedPage(path, lang) {
  return SEO_PAGES[path][lang]
    .replace('<link rel="stylesheet" href="style.css">', () => '<style>' + STOREFRONT_CSS + '</style>')
    .replace('<script src="app.js"></script>', () => '<script>' + STOREFRONT_JS + '</script>');
}
const INVENTORY_SEED = ${JSON.stringify(inventorySeed)};
${shippingCode}
${supportCode}
${mediaCode}
${inventoryCode}
const PRODUCT_PAGES = ${JSON.stringify(productPages)};

const ADMIN_HTML_CONTENT = ${JSON.stringify(embeddedAdminHtml)};
const ADMIN_JS_CONTENT = ${JSON.stringify(adminJs)};

const BRAND_LOGO = ${JSON.stringify(brandLogo)};

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

  const expected = env.ADMIN_PASSWORD;
  const token = tokenQuery || tokenHeader;
  return Boolean(expected && token && token === expected);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;
    const siteUrl = (env.SITE_URL || url.origin).replace(/\\/+$/, '');
    const withSiteUrl = content => content.replaceAll('https://smokeykamado.nl', siteUrl);
    // Personal lead data and admin credentials must not be cached.
    const privateHeaders = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
    const storefrontHeaders = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' };
    if (url.hostname.endsWith('.workers.dev') || new URL(siteUrl).hostname.endsWith('.workers.dev') || url.hostname !== new URL(siteUrl).hostname) storefrontHeaders['X-Robots-Tag'] = 'noindex, follow';


    if (pathname === '/api/media') {
      try {
        if (method === 'GET') return Response.json(await readMedia(env.DB), { headers: privateHeaders });
        if (method !== 'POST') return new Response('Method not allowed', { status: 405 });
        if (!authenticateAdmin(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: privateHeaders });
        const result = await saveMedia(env.DB, await request.json());
        return Response.json(result, { status: result.conflict ? 409 : 200, headers: privateHeaders });
      } catch (error) { return Response.json({ error: error.message }, { status: method === 'GET' ? 503 : 400, headers: privateHeaders }); }
    }

    if (pathname === '/api/inventory') {
      try {
        if (method === 'GET') return Response.json(await getInventory(env.DB), { headers: { 'Cache-Control': 'no-store' } });
        if (method === 'POST') {
          if (!authenticateAdmin(request, env)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
          const result = await updateInventory(env.DB, await request.json());
          return Response.json(result, { status: result.conflict ? 409 : 200, headers: { 'Cache-Control': 'no-store' } });
        }
        return new Response('Method not allowed', { status: 405 });
      } catch (error) { return Response.json({ error: error.message }, { status: method === 'GET' ? 503 : 400 }); }
    }

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
        'Sitemap: https://smokeykamado.nl/sitemap.xml',
        ''
      ].join('\\n');
      return new Response(withSiteUrl(robotsTxt), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    // SEO: sitemap.xml
    if (pathname === '/sitemap.xml') {

      return new Response(withSiteUrl(SEO_SITEMAP), {
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    if (Object.prototype.hasOwnProperty.call(SUPPORT_PAGES, pathname)) {
      return new Response(supportPageHtml(pathname, url.searchParams.get('lang')), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' } });
    }

    const pageLang = url.searchParams.get('lang') === 'en' ? 'en' : 'nl';
    if (pathname === '/index.html' || (pathname.endsWith('/') && Object.prototype.hasOwnProperty.call(PRODUCT_PAGES, pathname.slice(0, -1)))) {
      return Response.redirect(url.origin + (pathname === '/index.html' ? '/' : pathname.slice(0,-1)) + url.search, 301);
    }
    const productPath = pathname.replace(/\\/$/, '');
    if (Object.prototype.hasOwnProperty.call(PRODUCT_PAGES, productPath)) {
      return new Response(withSiteUrl(renderedPage(productPath, pageLang)), {
        headers: storefrontHeaders
      });
    }

    // 1. Static Storefront HTML
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(withSiteUrl(renderedPage('/', pageLang)), { headers: storefrontHeaders });
    }

    // 2. Admin Dashboard & Admin JS
    if (pathname === '/admin/market-test' || pathname === '/admin' || pathname === '/admin/') {
      return new Response(ADMIN_HTML_CONTENT, {
        headers: {
          'X-Robots-Tag': 'noindex, nofollow',
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

    if (pathname === '/assets/smokey-logo.svg' || pathname === '/favicon.ico') {
      return new Response(BRAND_LOGO, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' }
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
        const ip = ''; // Do not persist raw IP addresses.
        const userAgent = request.headers.get('User-Agent') || '';
        const referer = request.headers.get('Referer') || '';

        if (body.eventType === 'purchase_intent') {
          throw new Error('Purchase intent is recorded only through checkout.');
        }
        await trackEvent(env.DB, {
          sessionId: body.sessionId,
          eventType: body.eventType,
          payload: body.payload,
          ip,
          userAgent,
          referer
        });

        return new Response(JSON.stringify({ ok: true }), {
          headers: privateHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: privateHeaders
        });
      }
    }

    // 5. Cart Update / Abandoned Cart (POST /api/market-test/cart-update)
    if (pathname === '/api/market-test/cart-update' && method === 'POST') {
      try {
        const body = await request.json();
        await updateCart(env.DB, body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: privateHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: privateHeaders
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
          headers: privateHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: privateHeaders
        });
      }
    }

    // 7. Admin Market Stats (GET /api/market-test/stats)
    if (pathname === '/api/market-test/stats' && method === 'GET') {
      if (!authenticateAdmin(request, env)) {
        return new Response(JSON.stringify({ error: 'Niet geautoriseerd' }), {
          status: 401,
          headers: privateHeaders
        });
      }

      try {
        const stats = await getMarketStats(env.DB);
        return new Response(JSON.stringify(stats), {
          headers: privateHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: privateHeaders
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
            'Content-Disposition': 'attachment; filename="smokeykamado-nl-intents.csv"',
            'Cache-Control': 'no-store'
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
