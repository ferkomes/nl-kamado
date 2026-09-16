/**
 * KundiKamado Netherlands - Market Test Storefront Logic
 * - Size-dependent Kamado and accessory pricing
 * - Cart management in EUR
 * - Real-time market funnel tracking (visitor -> cart -> checkout -> purchase_intent)
 * - Abandoned cart telemetry
 * - Transparent demand validation notice flow
 */

(function() {
  'use strict';

  // --- CATALOG DATA ---
  const KAMADO_MODELS = {
    '18': {
      id: '18',
      name: 'KundiKamado 18″ Compact',
      modelCode: 'AU-18OR',
      badge: 'Compact & Familie',
      price: 699,
      origPrice: 898,
      grate: 'Ø 38.5 cm',
      body: '45.0 cm (17.7″)',
      people: '2–4 personen',
      weight: '59.5 kg',
      assembledSize: '118 × 65 × 116.5 cm',
      desc: 'Compacte Mullite keramische kamado van topklasse. Compleet All-Inclusive pakket met Air Hinge veerscharnier, multi-level Divide & Conquer kooksysteem, gietijzeren rooster, handige aslade, rookhout-inlaat en weersbestendige beschermhoes.',
      image: 'images/kamado_18_front.jpg',
      thumbs: [
        'images/kamado_18_front.jpg',
        'images/kamado_divide_open.jpg',
        'images/kamado_detail_vent.jpg',
        'images/kamado_detail_hinge.jpg',
        'images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '21': {
      id: '21',
      name: 'KundiKamado 21″ Veelzijdig',
      modelCode: 'AU-21OR',
      badge: 'Veelzijdig & Familie+',
      price: 889,
      origPrice: 1108,
      grate: 'Ø 47.5 cm',
      body: '53.6 cm (21.1″)',
      people: '4–6 personen',
      weight: '75.0 kg',
      assembledSize: '129.6 × 73 × 125.9 cm',
      desc: 'Het ideale allround formaat! Royaal kookoppervlak voor familie en vrienden, inclusief compleet multi-level kooksysteem, gietijzeren halve maan roosters en luxe afwerking.',
      image: 'images/kamado_21_front.jpg',
      thumbs: [
        'images/kamado_21_front.jpg',
        'images/kamado_divide_open.jpg',
        'images/kamado_detail_vent.jpg',
        'images/kamado_detail_hinge.jpg',
        'images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '23': {
      id: '23',
      name: 'KundiKamado 23″ Bestseller',
      modelCode: 'AU-23OR',
      badge: '🔥 Bestseller / Meest Gekozen',
      price: 1019,
      origPrice: 1178,
      grate: 'Ø 52.3 cm',
      body: '59.5 cm (23.5″)',
      people: '4–8 personen (Ideaal)',
      weight: '89.0 kg',
      assembledSize: '136 × 80 × 126.8 cm',
      desc: 'De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.',
      image: 'images/kamado_23_front.jpg',
      thumbs: [
        'images/kamado_23_front.jpg',
        'images/kamado_divide_open.jpg',
        'images/kamado_detail_vent.jpg',
        'images/kamado_detail_hinge.jpg',
        'images/kamado_bbq_lifestyle.jpg'
      ]
    },
    '27': {
      id: '27',
      name: 'KundiKamado 27″ HoReCa Reus',
      modelCode: 'AU-27OR',
      badge: 'Reus / HoReCa & Heavy Duty',
      price: 1319,
      origPrice: 1410,
      grate: 'Ø 57.5 cm',
      body: '67.7 cm (26.6″)',
      people: '6–12+ personen',
      weight: '94.6 kg',
      assembledSize: '144.7 × 89 × 131 cm',
      desc: 'Enorme capaciteit voor grote gezelschappen, feesten en horecagebruik. 57.5 cm rvs kookrooster, geavanceerde dubbele ventilatieschuif en gewichtsloze dekselopening.',
      image: 'images/kamado_27_front.jpg',
      thumbs: [
        'images/kamado_27_front.jpg',
        'images/kamado_divide_open.jpg',
        'images/kamado_detail_vent.jpg',
        'images/kamado_detail_hinge.jpg',
        'images/kamado_bbq_lifestyle.jpg'
      ]
    }
  };

  const ACCESSORIES = [
    {
      id: 'cover',
      category: 'protection',
      name: 'Premium All-Weather Beschermhoes',
      isSizeDependent: true,
      sizePrices: { '18': 39, '21': 45, '23': 49, '27': 59 },
      desc: 'Zware kwaliteit waterdichte en UV-bestendige hoes, op maat gemaakt voor het gekozen formaat kamado.',
      image: 'images/cover.webp'
    },
    {
      id: 'rotisserie',
      category: 'tools',
      name: 'Draaispit / Rotisserie met motor',
      isSizeDependent: true,
      sizePrices: { '18': 139, '21': 159, '23': 159, '27': 189 },
      desc: 'Spitring met krachtige 230V/batterij motor voor gelijkmatige rotatie en ultiem malse braadstukken.',
      image: 'images/rotisserie.webp'
    },
    {
      id: 'cast-iron-halfmoon',
      category: 'cooking',
      name: 'Gietijzeren Halve Maan Plancha / Rooster',
      isSizeDependent: true,
      sizePrices: { '18': 49, '21': 59, '23': 69, '27': 79 },
      desc: 'Dubbelzijdig bruikbaar: één geribbelde zijde voor steaks, één gladde bakplaat voor smashburgers en groenten.',
      image: 'images/divide.webp'
    },
    {
      id: 'pizza-stone',
      category: 'cooking',
      name: 'Cordieriet Pizzasteen (Extra Dik)',
      isSizeDependent: true,
      sizePrices: { '18': 49, '21': 59, '23': 69, '27': 79 },
      desc: 'Hittebestendig tot 400°C voor de ultieme krokante Napolitaanse pizzabodem op jouw kamado.',
      image: 'images/pizza.webp'
    },
    {
      id: 'electric-starter',
      category: 'tools',
      name: 'Elektrische Houtskoolaansteker (2000W)',
      isSizeDependent: false,
      price: 59,
      desc: 'Binnen 60-90 seconden gloeiende houtskool met hete lucht, zonder vieze chemicaliën of geur.',
      image: 'images/heat.webp'
    },
    {
      id: 'bbq-gloves',
      category: 'protection',
      name: 'Hittebestendige BBQ Handschoenen (350°C)',
      isSizeDependent: false,
      price: 32,
      desc: 'Hittebestendig siliconen met antislip profiel voor het veilig vastpakken van gloeiend hete roosters.',
      image: 'images/cover.webp'
    },
    {
      id: 'meat-claws',
      category: 'tools',
      name: 'Pulled Pork Vleesklauwen Set',
      isSizeDependent: false,
      price: 16,
      desc: 'Oersterke voedselveilige klauwen om pulled pork en kipfilet binnen no-time professioneel te versnipperen.',
      image: 'images/ash.webp'
    },
    {
      id: 'grid-clip',
      category: 'tools',
      name: 'RVS Roostertang & Lifter',
      isSizeDependent: false,
      price: 14,
      desc: 'Stevig hulpmiddel om hete grillroosters en gietijzeren pannen veilig uit de kamado te tillen.',
      image: 'images/cast-iron.webp'
    },
    {
      id: 'ash-collector-kit',
      category: 'tools',
      name: 'RVS Aslade & Schraper Kit',
      isSizeDependent: false,
      price: 22,
      desc: 'Sluit naadloos aan op de luchtschuif onderin voor supersnel en stofvrij verwijderen van overgebleven as.',
      image: 'images/ash.webp'
    }
  ];

  // --- STATE ---
  let currentSize = '23';
  let currentColor = { id: 'black', name: 'Onyx Zwart' };
  let currentTexture = { id: 'bubble', name: 'Bubble Glaze (Ambachtelijk reliëf)' };
  let cart = [];

  // Session token
  function getSessionId() {
    let sid = localStorage.getItem('kk_nl_session');
    if (!sid) {
      sid = 'nl_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('kk_nl_session', sid);
    }
    return sid;
  }

  const sessionId = getSessionId();

  // --- TELEMETRY DISPATCHER ---
  async function trackEvent(eventType, payload = {}) {
    try {
      await fetch('/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType,
          payload: { ...payload, timestamp: new Date().toISOString() }
        })
      });
    } catch (e) {
      console.warn('Telemetry event failed:', e);
    }
  }

  async function syncCartTelemetry() {
    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      await fetch('/api/market-test/cart-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: cart,
          totalAmount,
          lastStep: document.getElementById('checkoutModalBackdrop')?.classList.contains('open') ? 'checkout' : 'cart'
        })
      });
    } catch (e) {
      console.warn('Cart telemetry sync failed:', e);
    }
  }

  // --- FORMATTERS ---
  function formatEur(amount) {
    return '€' + Number(amount).toLocaleString('nl-NL') + ',-';
  }

  // --- UI UPDATERS ---
  function updateModelConfigurator() {
    const model = KAMADO_MODELS[currentSize];
    if (!model) return;

    // Header & pricing
    document.getElementById('activeModelName').textContent = model.name;
    document.getElementById('activeModelPrice').textContent = formatEur(model.price);
    document.getElementById('activeModelOrigPrice').textContent = formatEur(model.origPrice);
    document.getElementById('activeModelDesc').textContent = model.desc;
    document.getElementById('addBtnPrice').textContent = formatEur(model.price);

    // Specs
    document.getElementById('specGrate').textContent = model.grate;
    document.getElementById('specBody').textContent = model.body;
    document.getElementById('specPeople').textContent = model.people;
    document.getElementById('specWeight').textContent = model.weight;

    // Main image & thumbs
    const activeImg = document.getElementById('activeModelImg');
    activeImg.src = model.image;
    document.getElementById('activeModelBadge').textContent = model.badge;

    const thumbsContainer = document.getElementById('galleryThumbs');
    thumbsContainer.innerHTML = '';
    model.thumbs.forEach((src, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}" onerror="this.src='assets/hero.jpg'">`;
      thumb.onclick = () => {
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        activeImg.src = src;
      };
      thumbsContainer.appendChild(thumb);
    });

    // Update label in accessories section
    const accLabel = document.getElementById('accSelectedSizeLabel');
    if (accLabel) accLabel.textContent = `${currentSize}″ Kamado`;

    // Re-render accessories with size-dependent prices
    renderAccessories();
  }

  function renderAccessories() {
    const grid = document.getElementById('accessoriesGrid');
    if (!grid) return;

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
          <img src="${acc.image}" alt="${acc.name}" class="acc-img" onerror="this.src='assets/pizza.webp'">
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
        addAccessoryToCart(acc, price);
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
    const model = KAMADO_MODELS[currentSize];
    const cartItemId = `kamado_${currentSize}_${currentColor.id}_${currentTexture.id}`;

    const existing = cart.find(item => item.id === cartItemId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: cartItemId,
        type: 'kamado',
        modelId: currentSize,
        name: model.name,
        sizeInch: currentSize,
        colorId: currentColor.id,
        colorName: currentColor.name,
        textureId: currentTexture.id,
        textureName: currentTexture.name,
        price: model.price,
        image: model.image,
        qty: 1
      });
    }

    saveCart();
    trackEvent('add_to_cart', {
      type: 'kamado',
      modelId: currentSize,
      color: currentColor.id,
      texture: currentTexture.id,
      price: model.price
    });
    openCart();
  }

  function addAccessoryToCart(acc, price) {
    const sizeSuffix = acc.isSizeDependent ? `_${currentSize}` : '';
    const cartItemId = `acc_${acc.id}${sizeSuffix}`;

    const existing = cart.find(item => item.id === cartItemId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: cartItemId,
        type: 'accessory',
        rawId: acc.id,
        name: acc.name,
        sizeInch: acc.isSizeDependent ? currentSize : null,
        price: price,
        image: acc.image,
        qty: 1
      });
    }

    saveCart();
    trackEvent('add_to_cart', {
      type: 'accessory',
      accessoryId: acc.id,
      sizeInch: acc.isSizeDependent ? currentSize : null,
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
      document.getElementById('cartSubtotal').textContent = '€0,-';
      document.getElementById('cartTotal').textContent = '€0,-';
      document.getElementById('goToCheckoutBtn').disabled = true;
      return;
    }

    document.getElementById('goToCheckoutBtn').disabled = false;
    list.innerHTML = '';

    let subtotal = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      let metaText = '';
      if (item.type === 'kamado') {
        metaText = `${item.colorName} • ${item.textureName}`;
      } else if (item.sizeInch) {
        metaText = `Geschikt voor ${item.sizeInch}″ Kamado`;
      }

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/pizza.webp'">
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
        <button class="remove-item-btn" data-id="${item.id}" aria-label="Verwijder artikel">&times;</button>
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

    document.getElementById('cartSubtotal').textContent = formatEur(subtotal);
    document.getElementById('cartTotal').textContent = formatEur(subtotal);
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

    // Update checkout totals
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('checkoutItemsCount').textContent = `${totalCount} artikel(en)`;
    document.getElementById('checkoutTotalAmount').textContent = formatEur(subtotal);
    document.getElementById('formErrors').textContent = '';

    trackEvent('checkout_start', { totalItems: totalCount, totalAmount: subtotal });
    syncCartTelemetry();
  }

  function closeCheckout() {
    document.getElementById('checkoutModalBackdrop').classList.remove('open');
  }

  // --- PURCHASE INTENT SUBMISSION ---
  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('formErrors');
    errorEl.textContent = '';

    const email = document.getElementById('custEmail').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const name = document.getElementById('custName').value.trim();
    const street = document.getElementById('custStreet').value.trim();
    const house = document.getElementById('custHouse').value.trim();
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
    if (!name || !street || !house || !zip || !city) {
      errorEl.textContent = 'Vul alle verplichte adresvelden in.';
      return;
    }

    const submitBtn = document.getElementById('submitIntentBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met verwerken...';

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Identify primary Kamado in order if present
    const primaryKamado = cart.find(item => item.type === 'kamado') || {};
    const accessoriesOrdered = cart.filter(item => item.type === 'accessory');

    const intentPayload = {
      sessionId,
      customer: {
        email,
        phone,
        name,
        street,
        houseNumber: house,
        postalCode: zip,
        city,
        country: 'NL'
      },
      paymentMethod,
      modelId: primaryKamado.modelId || currentSize,
      sizeInch: primaryKamado.sizeInch || currentSize,
      colorId: primaryKamado.colorId || currentColor.id,
      colorName: primaryKamado.colorName || currentColor.name,
      texture: primaryKamado.textureName || currentTexture.name,
      items: cart,
      accessories: accessoriesOrdered,
      subtotalEur: subtotal,
      shippingFeeEur: 0,
      totalAmountEur: subtotal
    };

    try {
      const resp = await fetch('/api/market-test/purchase-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intentPayload)
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Fout bij het versturen.');
      }

      // Track the final purchase intent event
      trackEvent('purchase_intent', {
        intentId: data.intentId,
        totalEur: subtotal,
        email
      });

      // Show Demand Notice Modal
      closeCheckout();
      showIntentDemandNotice(intentPayload, data.intentId);

      // Reset cart
      cart = [];
      saveCart();
    } catch (err) {
      errorEl.textContent = err.message || 'Er trad een onverwachte fout op. Probeer het opnieuw.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Doorgaan naar betaling';
    }
  }

  function showIntentDemandNotice(intentPayload, intentId) {
    const summaryBox = document.getElementById('registeredSummaryBox');
    let itemsListHtml = intentPayload.items.map(i => `<li><strong>${i.qty}x</strong> ${i.name} (${formatEur(i.price * i.qty)})</li>`).join('');

    summaryBox.innerHTML = `
      <div style="margin-bottom: 0.5rem;"><strong>Referentienummer:</strong> NL-VIP-${intentId.substring(0, 8).toUpperCase()}</div>
      <div style="margin-bottom: 0.5rem;"><strong>Geregistreerd voor:</strong> ${intentPayload.customer.name} (${intentPayload.customer.email})</div>
      <div style="margin-bottom: 0.5rem;"><strong>Gekozen configuratie:</strong></div>
      <ul style="padding-left: 1.25rem; margin-bottom: 0.5rem; color: #cbd5e1;">${itemsListHtml}</ul>
      <div><strong>Totaalwaarde:</strong> ${formatEur(intentPayload.totalAmountEur)} (Palletbezorging inbegrepen)</div>
    `;

    document.getElementById('intentNoticeBackdrop').classList.add('open');
  }

  // --- INITIALIZATION & EVENT LISTENERS ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial page tracking
    trackEvent('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // 2. Load stored cart
    loadCart();

    // 3. Setup size tabs
    document.querySelectorAll('.size-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.size-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSize = tab.dataset.size;
        updateModelConfigurator();
        trackEvent('change_config', { size: currentSize, color: currentColor.id, texture: currentTexture.id });
      });
    });

    // 4. Setup color dots
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentColor = {
          id: dot.dataset.colorId,
          name: dot.dataset.colorName
        };
        document.getElementById('selectedColorName').textContent = currentColor.name;
        trackEvent('change_config', { size: currentSize, color: currentColor.id, texture: currentTexture.id });
      });
    });

    // 5. Setup texture radio
    document.querySelectorAll('input[name="texture"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        document.querySelectorAll('.texture-radio').forEach(r => r.classList.remove('active'));
        e.target.closest('.texture-radio').classList.add('active');
        currentTexture = {
          id: e.target.value,
          name: e.target.value === 'bubble' ? 'Bubble Glaze (Ambachtelijk reliëf)' : 'Hoogglans Glad (Strak modern design)'
        };
        document.getElementById('selectedTextureName').textContent = currentTexture.name;
        trackEvent('change_config', { size: currentSize, color: currentColor.id, texture: currentTexture.id });
      });
    });

    // 6. Setup cart drawer triggers
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCartBtn').addEventListener('click', closeCart);
    document.getElementById('cartBackdrop').addEventListener('click', closeCart);

    // 7. Add to cart actions
    document.getElementById('addModelToCartBtn').addEventListener('click', addModelToCart);
    document.getElementById('directCheckoutBtn').addEventListener('click', () => {
      addModelToCart();
      openCheckout();
    });

    // 8. Checkout modal triggers
    document.getElementById('goToCheckoutBtn').addEventListener('click', openCheckout);
    document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);

    // 9. Payment method switcher in checkout
    document.querySelectorAll('.payment-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });

    // 10. Checkout form submit
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);

    // 11. Demand notice close button
    document.getElementById('closeNoticeBtn').addEventListener('click', () => {
      document.getElementById('intentNoticeBackdrop').classList.remove('open');
    });

    // Initial render
    updateModelConfigurator();
  });
})();
