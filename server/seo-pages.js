function seoEscape(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function seoPageHtml(html, path, lang) {
  const en = lang === 'en';
  const base = 'https://smokeykamado.nl';
  const canonical = base + path + (en ? '?lang=en' : '');
  const product = PRODUCT_PAGES[path];
  const name = product?.name[lang];
  const title = product ? (product.type === 'kamado' ? `Kamado ${product.sizeInch} inch ${product.key === '18_basic' ? 'Basic' : 'Premium'} BBQ | SmokeyKamado` : name + ' | SmokeyKamado') : (en ? 'Kamado BBQ Netherlands | Ceramic Barbecues | SmokeyKamado' : 'Kamado BBQ kopen? Vergelijk 18–27 inch | SmokeyKamado');
  const description = product ? (product.type === 'kamado' ? (en ? `Explore the ${product.sizeInch} inch ${product.key === '18_basic' ? 'Basic' : 'Premium'} ceramic kamado: ${product.grate} cooking grid. Compare specifications, accessories and planned delivery. Register your interest.` : `Ontdek de ${product.sizeInch} inch ${product.key === '18_basic' ? 'Basic' : 'Premium'} keramische kamado met ${product.grate} grillrooster. Bekijk specificaties, accessoires en bezorgkosten. Meld je interesse.`) : product.desc[lang]) : (en ? 'Compare ceramic kamado barbecues in 18, 21, 23 and 27 inch. Explore Basic and Premium equipment, accessories and planned delivery in the Netherlands.' : 'Kamado BBQ kopen? Vergelijk 18, 21, 23 en 27 inch keramische barbecues, Basic en Premium. Bekijk uitrusting, accessoires en bezorgkosten in Nederland.');
  const headEnd = html.indexOf('</head>');
  let head = html.slice(0,headEnd);
  head = head.replace(/<html lang="[^"]*"/, '<html lang="'+lang+'"');
  head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>'+seoEscape(title)+'</title>');
  head = head.replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*/g,(_,start)=>start+seoEscape(title));
  head = head.replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g,(_,start)=>start+seoEscape(description));
  head = head.replace(/(<meta (?:name|property)="(?:og:url|twitter:url)" content=")[^"]*/g,(_,start)=>start+canonical);
  head = head.replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="'+canonical+'">');
  head = head.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/g,'');
  head += ['nl','en','x-default'].map(code=>'<link rel="alternate" hreflang="'+code+'" href="'+base+path+(code==='en'?'?lang=en':'')+'">').join('\n');
  const graph = [{ '@type':'Organization','@id':base+'/#organization',name:'SmokeyKamado Nederland',url:base+'/',logo:base+'/assets/smokey-logo.svg',email:'info@smokeykamado.nl' },{ '@type':'WebSite','@id':base+'/#website',url:base+'/',name:'SmokeyKamado',inLanguage:['nl','en'] }];
  if (product) {
    graph.push({'@type':'Product','@id':canonical+'#product',name,description:product.desc[lang],image:(product.thumbs||[product.image]).map(src=>base+src),url:canonical,brand:{'@type':'Brand',name:'SmokeyKamado'},category:product.type==='kamado'?'Keramische barbecue':'Kamado accessoires'});
    graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'SmokeyKamado',item:base+'/'},{'@type':'ListItem',position:2,name,item:canonical}]});
  } else graph.push({'@type':'ItemList',name:en?'Kamado barbecues':'Kamado barbecues vergelijken',itemListElement:Object.entries(PRODUCT_PAGES).filter(([,p])=>p.type==='kamado').map(([path,p],i)=>({'@type':'ListItem',position:i+1,name:p.name[lang],url:base+path+(en?'?lang=en':'')}))});
  // No price/availability/review markup for a market test that cannot accept purchases.
  head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')+'</script>');
  let tail = html.slice(headEnd);
  const scriptStart = tail.indexOf('<script>');
  let body = scriptStart < 0 ? tail : tail.slice(0,scriptStart);
  const scripts = scriptStart < 0 ? '' : tail.slice(scriptStart);
  // Translate visible HTML before JavaScript runs, keeping the bundled code unchanged.
  const translations = SEO_TRANSLATIONS[lang];
  for (const [id,value] of Object.entries(translations)) {
    const pattern = new RegExp('(<(p|span|h1|h2|h3|h4|label|small|button|a)[^>]*id="'+id+'"[^>]*>)[\\s\\S]*?</\\2>','g');
    body = body.replace(pattern,(_,start,tag)=>start+value+'</'+tag+'>');
  }
  body = body.replace(/(<(h1|h2|p|span|a)[^>]*data-nl="([^"]*)"[^>]*data-en="([^"]*)"[^>]*>)[\s\S]*?<\/\2>/g,(_,start,tag,nl,english)=>start+(en?english:nl)+'</'+tag+'>');
  if (!product) body = body.replace('<h1 id="detailAccessoryName"', '<h2 id="detailAccessoryName"').replace('<h2 id="detailAccessoryName"></h1>', '<h2 id="detailAccessoryName"></h2>');
  if(product) {
    body=body.replace(/<h1\b/g,'<h2').replace(/<\/h1>/g,'</h2>');
    const id=product.type==='kamado'?'modelsSectionTitle':'detailAccessoryName';
    body=body.replace(new RegExp('<h[23]([^>]*id="'+id+'"[^>]*)>[\\s\\S]*?</h[23]>'),'<h1$1>'+seoEscape(name)+'</h1>');
    for (const [id,value] of Object.entries(product.type==='kamado'?{modelPriceLabel:en?'Introductory price':'Introductieprijs',modelRrp:(en?'RRP: €':'Adviesprijs: €')+product.rrp,modelRrpNote:en?'RRP is the recommended list price set by SmokeyKamado, not a previous selling price.':'Adviesprijs is de door SmokeyKamado vastgestelde aanbevolen lijstprijs, geen eerdere verkoopprijs.',activeModelName:name,activeModelDesc:product.desc[lang],specPeople:product.people[lang]}:{detailAccessoryDesc:product.desc[lang]})) {
      body=body.replace(new RegExp('(<(p|h3|span|div|small)[^>]*id="'+id+'"[^>]*>)[\\s\\S]*?</\\2>'),(_,start,tag)=>start+seoEscape(value)+'</'+tag+'>');
    }
    const imageId=product.type==='kamado'?'activeModelImg':'detailAccessoryImage';
    body=body.replace(new RegExp('(<img id="'+imageId+'"[^>]*alt=")[^"]*'),(_,start)=>start+seoEscape(name));
    body=body.replace(new RegExp('(<img id="'+imageId+'")'),'$1 fetchpriority="high" width="600" height="600"');
  }
  const accessoryCards=Object.entries(PRODUCT_PAGES).filter(([,p])=>p.type==='accessory').map(([url,p])=>`<a class="acc-card" href="${url}${en?'?lang=en':''}"><div class="acc-img-wrap"><img src="${p.image}" alt="${seoEscape(p.name[lang])}" class="acc-img" width="400" height="400" loading="lazy" decoding="async"></div><div class="acc-body"><h3 class="acc-title">${seoEscape(p.name[lang])}</h3><p class="acc-desc">${seoEscape(p.desc[lang])}</p><span>${en?'View details':'Bekijk details'} ↗</span></div></a>`).join('');
  body=body.replace('<!-- SERVER_ACCESSORIES -->',accessoryCards);
  if (!product) {
    const rows=Object.entries(PRODUCT_PAGES).filter(([,p])=>p.type==='kamado').map(([url,p])=>`<tr><td><a href="${url}${en?'?lang=en':''}">${seoEscape(p.name[lang])}</a></td><td>${seoEscape(p.grate)}</td><td>${seoEscape(p.people[lang])}</td><td>€${p.rrp}</td><td>€${p.price}</td></tr>`).join('');
    const guide=`<section class="section buying-guide"><div class="container"><h2>${en?'Which kamado BBQ suits you?':'Welke kamado BBQ past bij jou?'}</h2><p>${en?'Compare cooking-grid diameter, equipment and space before choosing a ceramic barbecue. The nominal inch size is not the cooking-grid diameter.':'Wil je een kamado kopen? Vergelijk de diameter van het grillrooster, de uitrusting en de beschikbare ruimte. De inch-maat van het model is niet hetzelfde als de diameter van het grillrooster.'}</p><div class="comparison-scroll"><table><thead><tr><th>Kamado</th><th>${en?'Cooking grid':'Grillrooster'}</th><th>${en?'People (guide)':'Personen (indicatie)'}</th><th>${en?'RRP incl. VAT':'Adviesprijs incl. btw'}</th><th>${en?'Introductory price incl. VAT':'Introductieprijs incl. btw'}</th></tr></thead><tbody>${rows}</tbody></table></div><p>${en?'The 18-inch model is available as Basic or Premium. Compare the included equipment; a cover and Divide & Conquer system belong to the Premium specification. Delivery is additional: €99 for 18–23 inch, €129 for 27 inch on mainland Netherlands.':'De 18 inch is er als Basic en Premium. Vergelijk wat inbegrepen is: de hoes en het Divide & Conquer-systeem horen bij de Premium-specificatie. Bezorging komt erbij: €99 voor 18–23 inch en €129 voor 27 inch op het Nederlandse vasteland.'} <a href="/support/shipping${en?'?lang=en':''}">${en?'Delivery details':'Bekijk bezorginformatie'}</a>.</p></div></section>`;
    body=body.replace('  <!-- Why SmokeyKamado -->',guide+'\n  <!-- Why SmokeyKamado -->');
  }
  return head+body+scripts;
}
function seoSitemap() {
  const base='https://smokeykamado.nl';
  const paths=['/',...Object.keys(PRODUCT_PAGES)];
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+paths.map(path=>['nl','en'].map(lang=>'<url><loc>'+base+path+(lang==='en'?'?lang=en':'')+'</loc>'+['nl','en','x-default'].map(code=>'<xhtml:link rel="alternate" hreflang="'+code+'" href="'+base+path+(code==='en'?'?lang=en':'')+'"/>').join('')+'</url>').join('')).join('')+'</urlset>';
}
