/**
 * KundiKamado Netherlands - Market Test Storefront Logic
 * - Real 100% Dutch e-commerce experience
 * - Funnel telemetry: visitor -> add_to_cart -> checkout -> purchase_intent
 * - Model & size selection: 18 Basic, 18 Premium, 21, 23, 27
 * - Color selection: Black, Burgundy, Blue, Green, Orange, Beige, Yellow
 * - Size-specific accessories matrix
 * - Exact Dutch legal demand validation modal
 */

(function() {
  'use strict';

  // --- CATALOG DATA ---
  const KAMADO_MODELS = {
    '18_basic': {
      key: '18_basic',
      name: 'KundiKamado 18″ Basic',
      sizeInch: '18',
      modelCode: 'AU-18OR-BAS',
      badge: 'Compact & Scherp Geprijsd',
      price: 599,
      origPrice: 749,
      grate: 'Ø 38.5 cm',
      body: '45.0 cm (17.7″)',
      people: '2–4 personen',
      weight: '55.0 kg',
      desc: 'Compacte keramische kamado barbecue met uitstekende warmte-isolatie. Ideaal voor balkons, stadstuinen of kleine gezinnen.',
      image: '/images/kamado_18_front.jpg',
      thumbs: [
        '/images/kamado_18_front.jpg',
        '/images/kamado_divide_open.jpg',
        '/images/kamado_detail_vent.jpg',
        '/images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '18_premium': {
      key: '18_premium',
      name: 'KundiKamado 18″ Premium',
      sizeInch: '18',
      modelCode: 'AU-18OR',
      badge: 'Compact & Familie',
      price: 699,
      origPrice: 898,
      grate: 'Ø 38.5 cm',
      body: '45.0 cm (17.7″)',
      people: '2–4 personen',
      weight: '59.5 kg',
      desc: 'Compacte Mullite keramische kamado van topklasse. Compleet All-Inclusive pakket met Air Hinge veerscharnier, multi-level Divide & Conquer kooksysteem, gietijzeren rooster, handige aslade, rookhout-inlaat en weersbestendige beschermhoes.',
      image: '/images/kamado_18_front.jpg',
      thumbs: [
        '/images/kamado_18_front.jpg',
        '/images/kamado_divide_open.jpg',
        '/images/kamado_detail_vent.jpg',
        '/images/kamado_detail_hinge.jpg',
        '/images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '21': {
      key: '21',
      name: 'KundiKamado 21″ Veelzijdig',
      sizeInch: '21',
      modelCode: 'AU-21OR',
      badge: 'Veelzijdig & Familie+',
      price: 889,
      origPrice: 1108,
      grate: 'Ø 47.5 cm',
      body: '53.6 cm (21.1″)',
      people: '4–6 personen',
      weight: '75.0 kg',
      desc: 'Het ideale allround formaat! Royaal kookoppervlak voor familie en vrienden, inclusief compleet multi-level kooksysteem, gietijzeren halve maan roosters en luxe afwerking.',
      image: '/images/kamado_21_front.jpg',
      thumbs: [
        '/images/kamado_21_front.jpg',
        '/images/kamado_divide_open.jpg',
        '/images/kamado_detail_vent.jpg',
        '/images/kamado_detail_hinge.jpg',
        '/images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '23': {
      key: '23',
      name: 'KundiKamado 23″ Bestseller',
      sizeInch: '23',
      modelCode: 'AU-23OR',
      badge: '🔥 Bestseller / Meest Gekozen',
      price: 1019,
      origPrice: 1178,
      grate: 'Ø 52.3 cm',
      body: '59.5 cm (23.5″)',
      people: '4–8 personen (Ideaal)',
      weight: '89.0 kg',
      desc: 'De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.',
      image: '/images/kamado_23_front.jpg',
      thumbs: [
        '/images/kamado_23_front.jpg',
        '/images/kamado_divide_open.jpg',
        '/images/kamado_detail_vent.jpg',
        '/images/kamado_detail_hinge.jpg',
        '/images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '27': {
      key: '27',
      name: 'KundiKamado 27″ HoReCa Reus',
      sizeInch: '27',
      modelCode: 'AU-27OR',
      badge: 'Reus / HoReCa & Heavy Duty',
      price: 1319,
      origPrice: 1410,
      grate: 'Ø 57.5 cm',
      body: '67.7 cm (26.6″)',
      people: '6–12+ personen',
      weight: '94.6 kg',
      desc: 'Enorme capaciteit voor grote gezelschappen, feesten en horecagebruik. 57.5 cm rvs kookrooster, geavanceerde dubbele ventilatieschuif en gewichtsloze dekselopening.',
      image: '/images/kamado_27_front.jpg',
      thumbs: [
        '/images/kamado_27_front.jpg',
        '/images/kamado_divide_open.jpg',
        '/images/kamado_detail_vent.jpg',
        '/images/kamado_detail_hinge.jpg',
        '/images/kamado_bbq_lifestyle.jpg'
      ]
    }
  };

  const ACCESSORIES = [
    {
      id: 'cover',
      name: 'All-Weather Beschermhoes',
      isSizeDependent: true,
      sizePrices: { '18': 39, '21': 45, '23': 49, '27': 59 },
      desc: 'Zware kwaliteit waterdichte en UV-bestendige hoes, precies op maat voor het gekozen formaat.',
      image: '/images/cover.webp'
    },
    {
      id: 'rotisserie',
      name: 'Draaispit / Rotisserie met motor',
      isSizeDependent: true,
      sizePrices: { '18': 139, '21': 159, '23': 159, '27': 189 },
      desc: 'Krachtige 230V/batterij motor met RVS spies voor ultiem sappig gevogelte en braadstukken.',
      image: '/images/rotisserie.webp'
    },
    {
      id: 'cast-iron-halfmoon',
      name: 'Gietijzeren Halve Maan Rooster / Plancha',
      isSizeDependent: true,
      sizePrices: { '18': 49, '21': 59, '23': 69, '27': 79 },
      desc: 'Tweezijdig bruikbaar: geribbeld voor grillstrepen, vlakke plancha voor burgers en groenten.',
      image: '/images/divide.webp'
    },
    {
      id: 'pizza-stone',
      name: 'Cordieriet Pizzasteen (Extra Dik)',
      isSizeDependent: true,
      sizePrices: { '18': 49, '21': 59, '23': 69, '27': 79 },
      desc: 'Bestand tegen 400°C voor de perfecte knapperige Napolitaanse pizzabodem.',
      image: '/images/pizza.webp'
    },
    {
      id: 'electric-starter',
      name: 'Elektrische Houtskoolaansteker (2000W)',
      isSizeDependent: false,
      price: 59,
      desc: 'Binnen 60-90 seconden gloeiende houtskool met hete lucht, zonder chemicaliën.',
      image: '/images/heat.webp'
    },
    {
      id: 'bbq-gloves',
      name: 'Hittebestendige BBQ Handschoenen (350°C)',
      isSizeDependent: false,
      price: 32,
      desc: 'Antislip siliconen voor het veilig beetpakken van hete grillroosters en pannen.',
      image: '/images/cover.webp'
    },
    {
      id: 'meat-claws',
      name: 'Pulled Pork Vleesklauwen Set',
      isSizeDependent: false,
      price: 16,
      desc: 'Voedselveilige en oersterke klauwen om pulled pork en kipfilet razendsnel te versnipperen.',
      image: '/images/ash.webp'
    },
    {
      id: 'grid-clip',
      name: 'RVS Roostertang & Lifter',
      isSizeDependent: false,
      price: 14,
      desc: 'Robuuste grijper om hete roosters en gietijzer veilig uit de kamado te tillen.',
      image: '/images/cast-iron.webp'
    },
    {
      id: 'ash-collector-kit',
      name: 'RVS Aslade & Schraper Kit',
      isSizeDependent: false,
      price: 22,
      desc: 'Sluit naadloos aan op de luchtschuif voor schoon en stofvrij as verwijderen.',
      image: '/images/ash.webp'
    }
  ];

  // --- ATTRIBUTION DETECTION ---
  function getUrlParams() {
    const params = {};
    new URLSearchParams(window.location.search).forEach((v, k) => {
      params[k] = v;
    });
    return params;
  }

  function detectSource() {
    const params = getUrlParams();
    if (params.utm_source) {
      return params.utm_medium ? `${params.utm_source} / ${params.utm_medium}` : params.utm_source;
    }
    const ref = document.referrer || '';
    if (ref.includes('facebook') || ref.includes('fb.me') || ref.includes('instagram')) return 'Facebook / Meta Ad';
    if (ref.includes('google')) return 'Google Search';
    if (ref.includes('tiktok')) return 'TikTok';
    return ref ? ref.replace(/https?:\/\/(www\.)?/, '').split('/')[0] : 'Direct';
  }

  const trafficSource = detectSource();

  // --- STATE ---
  let activeModelKey = '23';
  let initialColor = 'Black';
  let currentColor = { id: 'black', name: 'Black', displayName: 'Black (Onyx Zwart)' };
  let cart = [];
  let checkoutEmailEntered = '';

  function getSessionId() {
    let sid = localStorage.getItem('kk_nl_session');
    if (!sid) {
      sid = 'nl_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('kk_nl_session', sid);
    }
    return sid;
  }

  const sessionId = getSessionId();

  // --- TELEMETRY ---
  async function trackEvent(eventType, payload = {}) {
    try {
      await fetch('/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType,
          payload: {
            ...payload,
            source: trafficSource,
            landingPage: window.location.pathname + window.location.search,
            initialColor,
            finalColor: currentColor.name,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (e) {}
  }

  async function syncCartTelemetry(lastStep = 'cart') {
    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      await fetch('/api/market-test/cart-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: cart,
          totalAmount,
          lastStep,
          source: trafficSource,
          email: checkoutEmailEntered || null
        })
      });
    } catch (e) {}
  }

  function formatEur(amount) {
    return '€' + Number(amount || 0).toLocaleString('nl-NL') + ',-';
  }

  // --- UI RENDERERS ---
  function updateModelConfigurator() {
    const model = KAMADO_MODELS[activeModelKey];
    if (!model) return;

    document.getElementById('activeModelName').textContent = model.name;
    document.getElementById('activeModelPrice').textContent = formatEur(model.price);
    document.getElementById('activeModelOrigPrice').textContent = formatEur(model.origPrice);
    document.getElementById('activeModelDesc').textContent = model.desc;
    document.getElementById('addBtnPrice').textContent = formatEur(model.price);

    document.getElementById('specGrate').textContent = model.grate;
    document.getElementById('specBody').textContent = model.body;
    document.getElementById('specPeople').textContent = model.people;
    document.getElementById('specWeight').textContent = model.weight;

    const activeImg = document.getElementById('activeModelImg');
    activeImg.src = model.image;
    document.getElementById('activeModelBadge').textContent = model.badge;

    const thumbsContainer = document.getElementById('galleryThumbs');
    thumbsContainer.innerHTML = '';
    model.thumbs.forEach((src, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}">`;
      thumb.onclick = () => {
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        activeImg.src = src;
      };
      thumbsContainer.appendChild(thumb);
    });

    const accLabel = document.getElementById('accSelectedSizeLabel');
    if (accLabel) accLabel.textContent = `${model.sizeInch}″ Kamado`;

    renderAccessories();
  }

  function renderAccessories() {
    const grid = document.getElementById('accessoriesGrid');
    if (!grid) return;

    const currentSize = KAMADO_MODELS[activeModelKey]?.sizeInch || '23';

    grid.innerHTML = '';
    ACCESSORIES.forEach(acc => {
      let price = acc.price;
      let sizeBadge = '';

      if (acc.isSizeDependent) {
        price = acc.sizePrices[currentSize] || acc.sizePrices['23'];
        sizeBadge = `<span class="acc-size-badge">Maat ${currentSize}″</span>`;
      }

      const card = document.createElement('div');
      card.className = 'acc-card';
      card.innerHTML = `
        <div class="acc-img-wrap">
          <img src="${acc.image}" alt="${acc.name}" class="acc-img">
          ${sizeBadge}
        </div>
        <div class="acc-body">
          <h4 class="acc-title">${acc.name}</h4>
          <p class="acc-desc">${acc.desc}</p>
          <div class="acc-footer">
            <div class="acc-price">${formatEur(price)}</div>
            <button class="btn btn-secondary add-acc-btn" data-id="${acc.id}">
              + Toevoegen
            </button>
          </div>
        </div>
      `;

      card.querySelector('.add-acc-btn').onclick = () => {
        addAccessoryToCart(acc, price, currentSize);
      };

      grid.appendChild(card);
    });
  }

  // --- CART OPERATIONS ---
  function loadCart() {
    try {
      const saved = localStorage.getItem('kk_nl_cart');
      if (saved) cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
    updateCartUI();
  }

  function saveCart() {
    try {
      localStorage.setItem('kk_nl_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
    syncCartTelemetry();
  }

  function addModelToCart() {
    const model = KAMADO_MODELS[activeModelKey];
    const cartItemId = `kamado_${activeModelKey}_${currentColor.id}`;

    const existing = cart.find(item => item.id === cartItemId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: cartItemId,
        type: 'kamado',
        modelKey: activeModelKey,
        modelName: model.name,
        name: `${model.name} – ${currentColor.displayName}`,
        sizeInch: model.sizeInch,
        colorId: currentColor.id,
        colorName: currentColor.name,
        colorDisplayName: currentColor.displayName,
        price: model.price,
        image: model.image,
        qty: 1
      });
    }

    saveCart();
    trackEvent('add_to_cart', {
      type: 'kamado',
      modelKey: activeModelKey,
      modelName: model.name,
      color: currentColor.name,
      price: model.price
    });
    openCart();
  }

  function addAccessoryToCart(acc, price, sizeInch) {
    const sizeSuffix = acc.isSizeDependent ? `_${sizeInch}` : '';
    const cartItemId = `acc_${acc.id}${sizeSuffix}`;
    const displayName = acc.isSizeDependent ? `${acc.name} (${sizeInch}″)` : acc.name;

    const existing = cart.find(item => item.id === cartItemId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: cartItemId,
        type: 'accessory',
        rawId: acc.id,
        name: displayName,
        sizeInch: acc.isSizeDependent ? sizeInch : null,
        price: price,
        image: acc.image,
        qty: 1
      });
    }

    saveCart();
    trackEvent('add_to_cart', {
      type: 'accessory',
      accessoryName: displayName,
      price: price
    });
    openCart();
  }

  function updateCartUI() {
    const badge = document.getElementById('cartCountBadge');
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = totalCount;

    const list = document.getElementById('cartItemsList');
    if (!list) return;

    if (cart.length === 0) {
      list.innerHTML = '<div class="empty-cart-msg">Je winkelwagen is nog leeg.</div>';
      document.getElementById('cartKamadoSubtotal').textContent = '€0,-';
      document.getElementById('cartAccSubtotal').textContent = '€0,-';
      document.getElementById('cartTotal').textContent = '€0,-';
      document.getElementById('goToCheckoutBtn').disabled = true;
      return;
    }

    document.getElementById('goToCheckoutBtn').disabled = false;
    list.innerHTML = '';

    let kamadoSub = 0;
    let accSub = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      if (item.type === 'kamado') {
        kamadoSub += itemTotal;
      } else {
        accSub += itemTotal;
      }

      let metaText = item.type === 'kamado' ? item.colorDisplayName : (item.sizeInch ? `Maat: ${item.sizeInch}″` : '');

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">${metaText}</div>
          <div class="cart-item-price">${formatEur(item.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" aria-label="Verwijder">&times;</button>
      `;

      itemEl.querySelector('.dec-btn').onclick = () => {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          cart = cart.filter(i => i.id !== item.id);
        }
        saveCart();
      };

      itemEl.querySelector('.inc-btn').onclick = () => {
        item.qty += 1;
        saveCart();
      };

      itemEl.querySelector('.remove-item-btn').onclick = () => {
        cart = cart.filter(i => i.id !== item.id);
        saveCart();
      };

      list.appendChild(itemEl);
    });

    const total = kamadoSub + accSub;
    document.getElementById('cartKamadoSubtotal').textContent = formatEur(kamadoSub);
    document.getElementById('cartAccSubtotal').textContent = formatEur(accSub);
    document.getElementById('cartTotal').textContent = formatEur(total);
  }

  function openCart() {
    document.getElementById('cartBackdrop').classList.add('open');
    document.getElementById('cartDrawer').classList.add('open');
    trackEvent('open_cart', { totalItems: cart.reduce((s, i) => s + i.qty, 0) });
  }

  function closeCart() {
    document.getElementById('cartBackdrop').classList.remove('open');
    document.getElementById('cartDrawer').classList.remove('open');
  }

  // --- CHECKOUT OPERATIONS ---
  function openCheckout() {
    closeCart();
    const modalBackdrop = document.getElementById('checkoutModalBackdrop');
    modalBackdrop.classList.add('open');

    const primaryKamado = cart.find(i => i.type === 'kamado');
    const modelSummaryText = primaryKamado ? `${primaryKamado.modelName} (${primaryKamado.colorName})` : 'Accessoires Bestelling';

    const kamadoSub = cart.filter(i => i.type === 'kamado').reduce((s, i) => s + (i.price * i.qty), 0);
    const accSub = cart.filter(i => i.type === 'accessory').reduce((s, i) => s + (i.price * i.qty), 0);
    const total = kamadoSub + accSub;

    document.getElementById('checkoutModelSummary').textContent = modelSummaryText;
    document.getElementById('checkoutKamadoPrice').textContent = formatEur(kamadoSub);
    document.getElementById('checkoutAccPrice').textContent = formatEur(accSub);
    document.getElementById('checkoutTotalAmount').textContent = formatEur(total);
    document.getElementById('formErrors').textContent = '';

    trackEvent('checkout_start', { totalAmount: total, kamadoSub, accSub });
    syncCartTelemetry('checkout');
  }

  function closeCheckout() {
    document.getElementById('checkoutModalBackdrop').classList.remove('open');
  }

  // Track contact completion when user leaves email or zip
  function setupContactTracking() {
    const emailInput = document.getElementById('custEmail');
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        const val = emailInput.value.trim();
        if (val.includes('@')) {
          checkoutEmailEntered = val;
          trackEvent('contact_complete', { email: val });
          syncCartTelemetry('checkout');
        }
      });
    }
  }

  // --- FINAL PURCHASE INTENT SUBMIT ---
  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('formErrors');
    errorEl.textContent = '';

    const email = document.getElementById('custEmail').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const name = document.getElementById('custName').value.trim();
    const zip = document.getElementById('custZip').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'ideal';

    if (!email || !email.includes('@')) {
      errorEl.textContent = 'Vul een geldig e-mailadres in.';
      return;
    }
    if (!phone || phone.length < 8) {
      errorEl.textContent = 'Vul een geldig telefoonnummer in.';
      return;
    }
    if (!name) {
      errorEl.textContent = 'Vul je volledige naam in.';
      return;
    }
    if (!zip || !city) {
      errorEl.textContent = 'Vul je postcode en woonplaats in.';
      return;
    }

    checkoutEmailEntered = email;

    const submitBtn = document.getElementById('submitIntentBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met verwerken...';

    const primaryKamado = cart.find(i => i.type === 'kamado') || {};
    const accessories = cart.filter(i => i.type === 'accessory');
    const kamadoPrice = cart.filter(i => i.type === 'kamado').reduce((s, i) => s + (i.price * i.qty), 0);
    const accPrice = accessories.reduce((s, i) => s + (i.price * i.qty), 0);
    const totalAmount = kamadoPrice + accPrice;

    const intentPayload = {
      sessionId,
      customer: {
        email,
        phone,
        name,
        postalCode: zip,
        city,
        country: 'NL'
      },
      paymentMethod,
      source: trafficSource,
      landingPage: window.location.pathname + window.location.search,
      initialColor,
      finalColor: primaryKamado.colorName || currentColor.name,
      modelName: primaryKamado.modelName || KAMADO_MODELS[activeModelKey]?.name || '23" Premium',
      sizeInch: primaryKamado.sizeInch || KAMADO_MODELS[activeModelKey]?.sizeInch || '23',
      items: cart,
      accessories,
      kamadoPriceEur: kamadoPrice,
      accessoriesPriceEur: accPrice,
      totalAmountEur: totalAmount
    };

    try {
      const resp = await fetch('/api/market-test/purchase-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intentPayload)
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Fout bij het verwerken.');
      }

      trackEvent('purchase_intent', {
        intentId: data.intentId,
        totalEur: totalAmount,
        email
      });

      // Close checkout modal & Open exact Dutch legal demand modal
      closeCheckout();
      showDemandNoticeModal(email);

      // Clear cart
      cart = [];
      saveCart();
    } catch (err) {
      errorEl.textContent = err.message || 'Er trad een fout op. Probeer het opnieuw.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Doorgaan naar betaling';
    }
  }

  function showDemandNoticeModal(customerEmail) {
    const noticeModal = document.getElementById('intentNoticeBackdrop');
    const emailContainer = document.getElementById('vipEmailContainer');
    const emailInput = document.getElementById('vipEmailInput');
    const notifyBtn = document.getElementById('vipNotifyBtn');
    const confirmationMsg = document.getElementById('vipConfirmationMsg');

    confirmationMsg.style.display = 'none';

    if (customerEmail) {
      // Email was already provided in checkout!
      emailContainer.style.display = 'none';
      notifyBtn.onclick = () => {
        confirmationMsg.innerHTML = `✓ Dankjewel! We hebben je e-mailadres (<strong>${customerEmail}</strong>) genoteerd. Zodra jouw gekozen Kamado beschikbaar is, ontvang je direct bericht als eerste!`;
        confirmationMsg.style.display = 'block';
        notifyBtn.style.display = 'none';
      };
    } else {
      // Edge case: prompt email
      emailContainer.style.display = 'block';
      notifyBtn.onclick = async () => {
        const mail = emailInput.value.trim();
        if (!mail || !mail.includes('@')) {
          alert('Vul een geldig e-mailadres in.');
          return;
        }
        confirmationMsg.innerHTML = `✓ Dankjewel! We hebben je e-mailadres (<strong>${mail}</strong>) genoteerd. Zodra jouw gekozen Kamado beschikbaar is, ontvang je direct bericht als eerste!`;
        confirmationMsg.style.display = 'block';
        notifyBtn.style.display = 'none';
        emailContainer.style.display = 'none';
      };
    }

    noticeModal.classList.add('open');
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial page tracking
    trackEvent('page_view', {
      source: trafficSource,
      referrer: document.referrer,
      url: window.location.href
    });

    // 2. Load stored cart
    loadCart();

    // 3. Setup size tabs (18 Basic / 18 Premium / 21 / 23 / 27)
    document.querySelectorAll('.size-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.size-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeModelKey = tab.dataset.modelKey;
        updateModelConfigurator();
        trackEvent('change_config', { model: activeModelKey, color: currentColor.name });
      });
    });

    // 4. Setup colors (Black, Burgundy, Blue, Green, Orange, Beige, Yellow)
    document.querySelectorAll('.color-dot').forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const colorName = dot.dataset.colorName;
        currentColor = {
          id: dot.dataset.colorId,
          name: colorName,
          displayName: dot.dataset.displayName
        };
        if (!initialColor) initialColor = colorName;
        document.getElementById('selectedColorName').textContent = currentColor.displayName;
        trackEvent('change_config', { model: activeModelKey, color: colorName });
      });
    });

    // 5. Setup cart triggers
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCartBtn').addEventListener('click', closeCart);
    document.getElementById('cartBackdrop').addEventListener('click', closeCart);

    // 6. Add to cart actions
    document.getElementById('addModelToCartBtn').addEventListener('click', addModelToCart);
    document.getElementById('directCheckoutBtn').addEventListener('click', () => {
      addModelToCart();
      openCheckout();
    });

    // 7. Checkout triggers
    document.getElementById('goToCheckoutBtn').addEventListener('click', openCheckout);
    document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);

    // 8. Payment selector in checkout
    document.querySelectorAll('.payment-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });

    // 9. Form submit & contact tracking
    setupContactTracking();
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);

    // 10. Close notice modal
    document.getElementById('closeNoticeBtn').addEventListener('click', () => {
      document.getElementById('intentNoticeBackdrop').classList.remove('open');
    });

    // Render initial configurator
    updateModelConfigurator();
  });
})();
