async function mediaTable(db) {
  if (!db) throw new Error('Media database unavailable');
  await db.prepare('CREATE TABLE IF NOT EXISTS product_media (placement TEXT PRIMARY KEY, videos_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1)').run();
}
function youtubeId(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    let id;
    if (host === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(?:embed|shorts|live)\/([^/]+)\/?$/.exec(url.pathname)?.[1];
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : null;
  } catch { return null; }
}
async function readMedia(db) {
  await mediaTable(db);
  const rows = await db.prepare('SELECT placement, videos_json, revision FROM product_media').all();
  return { placements: Object.fromEntries(rows.results.map(row => [row.placement, { videos: JSON.parse(row.videos_json), revision: row.revision }])), locations: { '/': 'Homepage', ...Object.fromEntries(Object.entries(PRODUCT_PAGES).map(([path, product]) => [path, product.name.en])) } };
}
async function saveMedia(db, data) {
  if (!data || (data.placement !== '/' && !Object.prototype.hasOwnProperty.call(PRODUCT_PAGES, data.placement)) ||
      !Array.isArray(data.urls) || data.urls.length > 5 || !Number.isInteger(data.revision) || data.revision < 0) throw new Error('Invalid placement or video list (maximum 5).');
  const videos = data.urls.map(url => { const id = youtubeId(url); if (!id) throw new Error('Use a valid HTTPS YouTube watch, Shorts, embed or youtu.be URL.'); return id; });
  if (new Set(videos).size !== videos.length) throw new Error('Remove duplicate videos.');
  await mediaTable(db);
  const result = data.revision === 0
    ? await db.prepare('INSERT OR IGNORE INTO product_media (placement, videos_json, revision) VALUES (?, ?, 1)').bind(data.placement, JSON.stringify(videos)).run()
    : await db.prepare('UPDATE product_media SET videos_json = ?, revision = revision + 1 WHERE placement = ? AND revision = ?').bind(JSON.stringify(videos), data.placement, data.revision).run();
  return result.meta.changes ? { ok: true, revision: data.revision + 1 } : { ok: false, conflict: true };
}
