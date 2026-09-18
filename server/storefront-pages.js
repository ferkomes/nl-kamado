// Each product has a shareable URL and server-rendered metadata and initial content.
function productPageHtml(html, product, productPath) {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name = product.name.nl;
  const description = product.desc.nl;
  const base = 'https://smokeykamado.nl';
  let page = html.replace('class="page-home"', 'class="page-' + product.type + (product.key === '18_basic' ? ' edition-basic' : '') + '"');
  // The homepage promotes accessories below the collection; detail pages lead with the selected kamado.
  if (product.type === 'kamado') {
    const accessories = page.match(/  <section id="accessoires"[\s\S]*?<\/section>/);
    if (accessories) {
      page = page.replace(accessories[0], '');
      page = page.replace(/(<section id="modellen"[\s\S]*?<\/section>)/, (_, section) => section + '\n' + accessories[0]);
    }
  }
  // Restrict replacements to the head so scripts and unrelated links stay intact.
  const headEnd = page.indexOf('</head>');
  let head = page.slice(0, headEnd);
  head = head.replace(/<title>[^<]*<\/title>/, '<title>' + escape(name) + ' | SmokeyKamado</title>');
  head = head.replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*/g, (_, start) => start + escape(name + ' | SmokeyKamado'));
  head = head.replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g, (_, start) => start + escape(description));
  head = head.replace(/https:\/\/smokeykamado.nl\/(?=["?])/g, base + productPath);
  head = head.replace(/(<meta (?:name|property)="(?:og:image|twitter:image)" content=")[^"]*/g, (_, start) => start + base + product.image);
  head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name, description,
    url: base + productPath, image: base + product.image, brand: { '@type': 'Brand', name: 'SmokeyKamado' }
  }).replace(/</g, '\\u003c') + '</script>');
  page = head + page.slice(headEnd);
  const text = (id, value) => {
    page = page.replace(new RegExp('(<[^>]+id="' + id + '"[^>]*>)[\\s\\S]*?(</[^>]+>)'), (_, start, end) => start + escape(value) + end);
  };
  if (product.type === 'kamado') {
    text('modelsSectionTitle', name);
    page = page.replace(/<h2([^>]*id="modelsSectionTitle"[^>]*)>(.*?)<\/h2>/, '<h1$1>$2</h1>');
    text('activeModelName', name);
    text('activeModelDesc', description);
    text('activeModelPrice', '€' + product.price);
    text('modelRrp', 'Adviesprijs: €' + product.rrp);
    text('addBtnPrice', '€' + product.price);
    text('specGrate', product.grate);
    text('specBody', product.body);
    text('specPeople', product.people.nl);
    text('specWeight', product.weight);
    page = page.replace(/(<img id="activeModelImg" src=")[^"]*/, '$1' + product.image);
  } else {
    text('detailAccessoryName', name);
    text('detailAccessoryDesc', description);
    text('detailAccessoryPrice', '€' + (product.price || product.sizePrices['23']));
    page = page.replace(/(<img id="detailAccessoryImage" src=")[^"]*/, '$1' + product.image);
  }
  return page;
}
