/**
 * CraftKamado Netherlands - Market Demand Storefront Logic
 * - Full Dual-Language Support: Dutch (NL) & English (EN)
 * - Removed test indicators for 100% authentic e-commerce perception
 * - Funnel telemetry: visitor -> add_to_cart -> checkout -> purchase_intent
 * - Model selection: 18 Basic, 18 Premium, 21, 23, 27
 * - Color selection: Black, Burgundy, Blue, Green, Orange, Beige, Yellow
 * - Size-specific accessories matrix & attach rates
 * - Legal Dutch/English demand validation notice modal
 */

(function() {
  "use strict";

  // --- CATALOG DATA ---
  const KAMADO_MODELS = {
    "18_basic": {
      key: "18_basic",
      name: { nl: "CraftKamado 18″ Basic", en: "CraftKamado 18″ Basic" },
      sizeInch: "18",
      modelCode: "CK-18BAS",
      badge: { nl: "Compact & Scherp Geprijsd", en: "Compact & Best Value" },
      price: 599,
      origPrice: 749,
      grate: "Ø 38.5 cm",
      body: "45.0 cm (17.7″)",
      people: { nl: "2–4 personen", en: "2–4 people" },
      weight: "55.0 kg",
      desc: {
        nl: "Compacte keramische kamado barbecue met uitstekende warmte-isolatie. Ideaal voor balkons, stadstuinen of kleine gezinnen.",
        en: "Compact ceramic kamado BBQ with outstanding thermal insulation. Ideal for balconies, urban gardens or small families."
      },
      image: "/images/kamado_18_front.jpg",
      thumbs: [
        "/images/kamado_18_front.jpg",
        "/images/kamado_divide_open.jpg",
        "/images/kamado_detail_vent.jpg",
        "/images/kamado_bbq_lifestyle.jpg"
      ]
    },
    "18_premium": {
      key: "18_premium",
      name: { nl: "CraftKamado 18″ Premium", en: "CraftKamado 18″ Premium" },
      sizeInch: "18",
      modelCode: "CK-18PREM",
      badge: { nl: "Compact & Familie", en: "Compact & Family" },
      price: 699,
      origPrice: 898,
      grate: "Ø 38.5 cm",
      body: "45.0 cm (17.7″)",
      people: { nl: "2–4 personen", en: "2–4 people" },
      weight: "59.5 kg",
      desc: {
        nl: "Compacte Mullite keramische kamado van topklasse. Compleet All-Inclusive pakket met Air Hinge veerscharnier, multi-level Divide & Conquer kooksysteem, gietijzeren rooster, handige aslade, rookhout-inlaat en weersbestendige beschermhoes.",
        en: "High-end compact Mullite ceramic kamado. Complete All-Inclusive package with Air Hinge spring counter-balance, Divide & Conquer cooking system, cast iron grate, slide-out ash drawer, wood chip feeder and heavy weather cover."
      },
      image: "/images/kamado_18_front.jpg",
      thumbs: [
        "/images/kamado_18_front.jpg",
        "/images/kamado_divide_open.jpg",
        "/images/kamado_detail_vent.jpg",
        "/images/kamado_detail_hinge.jpg",
        "/images/kamado_bbq_lifestyle.jpg"
      ]
    },
    "21": {
      key: "21",
      name: { nl: "CraftKamado 21″ Veelzijdig", en: "CraftKamado 21″ Versatile" },
      sizeInch: "21",
      modelCode: "CK-21ALL",
      badge: { nl: "Veelzijdig & Familie+", en: "Versatile & Family+" },
      price: 889,
      origPrice: 1108,
      grate: "Ø 47.5 cm",
      body: "53.6 cm (21.1″)",
      people: { nl: "4–6 personen", en: "4–6 people" },
      weight: "75.0 kg",
      desc: {
        nl: "Het ideale allround formaat! Royaal kookoppervlak voor familie en vrienden, inclusief compleet multi-level kooksysteem, gietijzeren halve maan roosters en luxe afwerking.",
        en: "The quintessential all-round size! Generous cooking surface for family and friends, featuring the full multi-level cooking rack, half-moon cast iron grate, and luxury finish."
      },
      image: "/images/kamado_21_front.jpg",
      thumbs: [
        "/images/kamado_21_front.jpg",
        "/images/kamado_divide_open.jpg",
        "/images/kamado_detail_vent.jpg",
        "/images/kamado_detail_hinge.jpg",
        "/images/kamado_bbq_lifestyle.jpg"
      ]
    },
    "23": {
      key: "23",
      name: { nl: "CraftKamado 23″ Bestseller", en: "CraftKamado 23″ Bestseller" },
      sizeInch: "23",
      modelCode: "CK-23BEST",
      badge: { nl: "🔥 Bestseller / Meest Gekozen", en: "🔥 Bestseller / Most Popular" },
      price: 1019,
      origPrice: 1178,
      grate: "Ø 52.3 cm",
      body: "59.5 cm (23.5″)",
      people: { nl: "4–8 personen (Ideaal)", en: "4–8 people (Optimal)" },
      weight: "89.0 kg",
      desc: {
        nl: "De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.",
        en: "The most popular kamado size in the Netherlands! Superb capacity for multiple whole chickens, racks of ribs, briskets or stone-baked pizza at once. Delivered fully All-Inclusive with rolling cart and side tables."
      },
      image: "/images/kamado_23_front.jpg",
      thumbs: [
        "/images/kamado_23_front.jpg",
        "/images/kamado_divide_open.jpg",
        "/images/kamado_detail_vent.jpg",
        "/images/kamado_detail_hinge.jpg",
        "/images/kamado_bbq_lifestyle.jpg"
      ]
    },
    "27": {
      key: "27",
      name: { nl: "CraftKamado 27″ HoReCa Reus", en: "CraftKamado 27″ Heavy Duty Giant" },
      sizeInch: "27",
      modelCode: "CK-27PRO",
      badge: { nl: "Reus / HoReCa & Heavy Duty", en: "Giant / Commercial & Heavy Duty" },
      price: 1319,
      origPrice: 1410,
      grate: "Ø 57.5 cm",
      body: "67.7 cm (26.6″)",
      people: { nl: "6–12+ personen", en: "6–12+ people" },
      weight: "94.6 kg",
      desc: {
        nl: "Enorme capaciteit voor grote gezelschappen, feesten en horecagebruik. 57.5 cm rvs kookrooster, geavanceerde dubbele ventilatieschuif en gewichtsloze dekselopening.",
        en: "Gigantic capacity for large gatherings, catering and heavy-duty commercial use. 57.5 cm stainless steel grate, dual precision air vent, and weightless lid balance."
      },
      image: "/images/kamado_27_front.jpg",
      thumbs: [
        "/images/kamado_27_front.jpg",
        "/images/kamado_divide_open.jpg",
        "/images/kamado_detail_vent.jpg",
        "/images/kamado_detail_hinge.jpg",
        "/images/kamado_bbq_lifestyle.jpg"
      ]
    }
  };

  const ACCESSORIES = [
    {
      id: "cover",
      name: { nl: "All-Weather Beschermhoes", en: "All-Weather Protective Cover" },
      isSizeDependent: true,
      sizePrices: { "18": 39, "21": 45, "23": 49, "27": 59 },
      desc: {
        nl: "Zware kwaliteit waterdichte en UV-bestendige hoes, precies op maat voor het gekozen formaat.",
        en: "Heavy-duty waterproof and UV-resistant cover, tailor-made for your selected kamado size."
      },
      image: "/images/cover.jpg"
    },
    {
      id: "rotisserie",
      name: { nl: "Draaispit / Rotisserie met motor", en: "Rotisserie Spit with Motor" },
      isSizeDependent: true,
      sizePrices: { "18": 139, "21": 159, "23": 159, "27": 189 },
      desc: {
        nl: "Krachtige 230V/batterij motor met RVS spies voor ultiem sappig gevogelte en braadstukken.",
        en: "Powerful 230V/battery motor with food-grade stainless spit rod for extraordinarily juicy poultry and roasts."
      },
      image: "/images/rotisserie.jpg"
    },
    {
      id: "cast-iron-halfmoon",
      name: { nl: "Gietijzeren Halve Maan Rooster / Plancha", en: "Cast Iron Half-Moon Grate / Plancha" },
      isSizeDependent: true,
      sizePrices: { "18": 49, "21": 59, "23": 69, "27": 79 },
      desc: {
        nl: "Tweezijdig bruikbaar: geribbeld voor grillstrepen, vlakke plancha voor burgers en groenten.",
        en: "Reversible: ribbed side for authentic grill marks, flat plancha side for burgers, seafood and veggies."
      },
      image: "/images/cast-iron.jpg"
    },
    {
      id: "pizza-stone",
      name: { nl: "Cordieriet Pizzasteen (Extra Dik)", en: "Cordierite Pizza Stone (Extra Thick)" },
      isSizeDependent: true,
      sizePrices: { "18": 49, "21": 59, "23": 69, "27": 79 },
      desc: {
        nl: "Bestand tegen 400°C voor de perfecte knapperige Napolitaanse pizzabodem.",
        en: "Withstands up to 400°C to bake crispy, authentic Italian stone-oven pizzas."
      },
      image: "/images/pizza.jpg"
    },
    {
      id: "electric-starter",
      name: { nl: "Elektrische Houtskoolaansteker (2000W)", en: "Electric Charcoal Lighter (2000W)" },
      isSizeDependent: false,
      price: 59,
      desc: {
        nl: "Binnen 60-90 seconden gloeiende houtskool met hete lucht, zonder chemicaliën.",
        en: "Glowing charcoal in 60-90 seconds using clean superheated airflow without harmful lighter fluid."
      },
      image: "/images/heat.jpg"
    },
    {
      id: "bbq-gloves",
      name: { nl: "Hittebestendige BBQ Handschoenen (350°C)", en: "Heat-Resistant BBQ Gloves (350°C)" },
      isSizeDependent: false,
      price: 32,
      desc: {
        nl: "Antislip siliconen voor het veilig beetpakken van hete grillroosters en pannen.",
        en: "Non-slip silicone heat protection for safely handling hot grates and cast iron cookware."
      },
      image: "/images/gloves.jpg"
    }
  ];

  const COLOR_OPTIONS = [
    { id: "black", name: "Black", hex: "#171717", displayName: { nl: "Black (Onyx Zwart)", en: "Black (Onyx Black)" } },
    { id: "burgundy", name: "Burgundy", hex: "#781d2e", displayName: { nl: "Burgundy (Bordeaux Rood)", en: "Burgundy (Wine Red)" } },
    { id: "blue", name: "Blue", hex: "#1b3f75", displayName: { nl: "Blue (Marine Blauw)", en: "Blue (Navy Blue)" } },
    { id: "green", name: "Green", hex: "#235338", displayName: { nl: "Green (Bosgroen)", en: "Green (Forest Green)" } },
    { id: "orange", name: "Orange", hex: "#df5417", displayName: { nl: "Orange (Craft Oranje)", en: "Orange (Craft Orange)" } },
    { id: "beige", name: "Beige", hex: "#d6cbb6", displayName: { nl: "Beige (Zand Beige)", en: "Beige (Sand Beige)" } },
    { id: "yellow", name: "Yellow", hex: "#dca326", displayName: { nl: "Yellow (Warm Okergeel)", en: "Yellow (Warm Ochre)" } }
  ];

  // --- I18N DICTIONARY ---
  const TRANSLATIONS = {
    nl: {
      topBanner: "🇳🇱 <strong>Gratis verzekerde palletlevering</strong> in heel Nederland • Tijdelijke voorjaarsactie: All-Inclusive pakket inbegrepen!",
      navModellen: "Kamado Modellen",
      navAllInclusive: "All-Inclusive Uitrusting",
      navAccessoires: "Accessoires",
      navWaarom: "Waarom CraftKamado?",
      navReviews: "Ervaringen",
      cartTriggerText: "Winkelwagen",
      heroTitle: "Keramisch Meesterschap.<br><span class=\"highlight\">All-Inclusive</span> Geleverd.",
      heroSubtitle: "Geen verborgen kosten, geen losse accessoires bijkopen. CraftKamado levert de meest complete keramische barbecue van Nederland, vervaardigd uit zwaar Mullite keramiek met gepatenteerd Air Hinge scharnier.",
      
      // Modellen Section
      modelsSectionTag: "Formaten & Uitvoeringen",
      modelsSectionTitle: "Kies Jouw Perfecte CraftKamado",
      modelsSectionDesc: "Selecteer een model, formaat en kleur. Alle modellen worden geleverd met ons complete All-Inclusive pakket.",
      tabTitle_18_basic: "18″ Basic",
      tabTitle_18_premium: "18″ Premium",
      tabTitle_21: "21″ Veelzijdig",
      tabTitle_23: "23″ Bestseller",
      tabTitle_27: "27″ HoReCa Reus",
      tabPopularTag: "Meest Gekozen",
      specLabelGrate: "Grillrooster",
      specLabelBody: "Buitendiameter",
      specLabelPeople: "Capaciteit",
      specLabelWeight: "Gewicht",
      colorPickerLabel: "Kies Kleur:",
      modelVatTag: "Inclusief 21% BTW & Gratis Bezorging",
      addKamadoBtnText: "In Winkelwagen Leggen",
      
      // All-Inclusive Section
      incSectionTag: "Ongeëvenaarde Waarde",
      incSectionTitle: "Wat zit er Standaard in het Pakket?",
      incSectionDesc: "Bij andere merken betaal je honderden euro's extra voor accessoires. Bij CraftKamado is alles direct inbegrepen.",
      incCardTitle1: "Air Hinge Veerscharnier",
      incCardDesc1: "Moeiteloos openen en sluiten. De zware deksel blijft op elke gewenste stand veilig zweven zonder dicht te klappen.",
      incCardTitle2: "Divide & Conquer Kooksysteem",
      incCardDesc2: "Tweedelig flexibel kooksysteem op verschillende hoogtes. Combineer tegelijkertijd direct grillen en indirect roken.",
      incCardTitle3: "Gietijzeren Halve Maan Rooster",
      incCardDesc3: "Inclusief zwaar gietijzeren rooster voor sensationele grillstrepen en sublieme karamellisatie van je vlees.",
      incCardTitle4: "RVS Aslade & Schraper",
      incCardDesc4: "Gemakkelijk as verwijderen in een handomdraai zonder knoeien via de uitschuifbare RVS aslade.",
      incCardTitle5: "Rookhout Toevoerpoort",
      incCardDesc5: "Voeg houtsnippers of chunks toe tijdens lange rooksessies zonder het deksel te openen en warmte te verliezen.",
      incCardTitle6: "Zware Weersbestendige Hoes",
      incCardDesc6: "Extra dikke, UV- en waterbestendige beschermhoes op maat, zodat jouw kamado in elk seizoen beschermd buiten staat.",
      incCardTitle7: "Zwaar Rolbaar Onderstel",
      incCardDesc7: "Gepoedercoat stalen frame met 4 grote industriële zwenkwielen (waarvan 2 met stevige remvoet).",
      incCardTitle8: "Inklapbare Bamboe Zijtafels",
      incCardDesc8: "Stevige natuurlijke bamboe zijtafels met praktische haken voor je spatels, vleestangen en theedoeken.",

      // Accessories Section
      accSectionTag: "Maatwerk Accessoires",
      accSectionTitle: "Optionele Uitbreidingen op Maat",
      accSectionDescTemplate: "Prijzen en afmetingen van onderstaande accessoires passen zich automatisch aan op jouw geselecteerde <strong id=\"accSelectedSizeLabel\">{size}″ Kamado</strong>.",
      addAccBtn: "+ Toevoegen",
      addedAccBtn: "✓ Toegevoegd",

      // Waarom Section
      whySectionTag: "Superieure Bouwkwaliteit",
      whySectionTitle: "Ontwikkeld voor Echte BBQ Fanaten",
      whySectionDesc: "CraftKamado is ontstaan uit één heldere filosofie: een compromisloze keramische barbecue bouwen met de allerbeste materialen, zónder de torenhoge marketingopslagen van gevestigde merken.",
      whyFeatTitle1: "Speciaal Mullite Keramiek",
      whyFeatDesc1: "Uitzonderlijk bestand tegen thermische schokken en temperaturen tot wel 1.000°C. Scheurt niet bij vrieskou of plotse hitte.",
      whyFeatTitle2: "30% Zuiniger Houtskoolverbruik",
      whyFeatDesc2: "Dankzij de superieure thermische massa kook je met één lading kwaliteits-houtskool tot wel 24 uur continu op 110°C.",
      whyFeatTitle3: "Direct Contact & Persoonlijke Service",
      whyFeatDesc3: "Onze experts staan altijd voor je klaar met advies over recepten, onderhoud en techniek.",

      // Reviews Section
      revSectionTag: "Beoordelingen",
      revSectionTitle: "Wat Zeggen BBQ Liefhebbers?",
      revQuote1: "\"De prijs-kwaliteitverhouding is ongeëvenaard. Je krijgt een kamado van topniveau met scharnier en divide & conquer waar je bij anderen honderden euro's meer voor betaalt.\"",
      revQuote2: "\"Het Air Hinge scharnier is een openbaring. De deksel van de 23 inch voelt vederlicht aan. Mijn vrouw kan hem nu ook gemakkelijk openen zonder angst.\"",
      revQuote3: "\"Fantastische temperatuurstabiliteit! Eerste brisket van 14 uur gemaakt zonder de schuiven aan te hoeven raken. Ziet er prachtig uit in de tuin.\"",

      // Cart Drawer
      cartDrawerTitle: "Jouw Winkelwagen",
      cartRowKamadoLabel: "Kamado:",
      cartRowAccLabel: "Accessoires:",
      cartRowDeliveryLabel: "Palletbezorging (Nederland):",
      cartFreeLabel: "GRATIS",
      cartRowTotalLabel: "Totaal (incl. BTW):",
      emptyCartMsg: "Je winkelwagen is nog leeg.",
      goToCheckoutBtn: "Doorgaan naar Bestellen",

      // Checkout Modal
      chkModalTitle: "Afrekenen & Gegevens",
      chkStep1Title: "1. Contactgegevens",
      chkLabelEmail: "E-mailadres *",
      chkLabelPhone: "Telefoonnummer *",
      chkStep2Title: "2. Bezorgadres in Nederland",
      chkLabelName: "Volledige Naam *",
      chkLabelStreet: "Straat en huisnummer",
      chkLabelZip: "Postcode *",
      chkLabelCity: "Woonplaats *",
      chkStep3Title: "3. Kies Betaalmethode",
      chkIdealSub: "Direct en veilig via Rabobank, ING, ABN AMRO, etc.",
      chkKlarnaSub: "Achteraf betalen binnen 30 dagen",
      chkSumModelLabel: "Gekozen model:",
      chkSumKamadoLabel: "Kamado prijs:",
      chkSumAccLabel: "Accessoires:",
      chkSumShipLabel: "Palletbezorging:",
      chkSumFreeLabel: "Gratis",
      chkSumTotalLabel: "Totaalbedrag:",
      submitIntentBtn: "Doorgaan naar betaling",
      chkSslNotice: "🔒 Veilig afrekenen via 256-bit SSL verbinding",

      // Notice Modal
      noticeTitle: "Bedankt voor je interesse in CraftKamado!",
      noticeBody1: "De door jou gekozen CraftKamado is momenteel nog niet beschikbaar in Nederland. We bereiden onze Nederlandse introductie voor.",
      noticeBody2: "Je bestelling is niet geplaatst en er is niets in rekening gebracht.",
      noticePrompt: "Wil je als eerste bericht krijgen zodra jouw gekozen Kamado beschikbaar is?",
      vipNotifyBtn: "Ja, houd mij op de hoogte",
      closeNoticeBtn: "Sluiten",
      vipAckMsg: "✓ Dankjewel! We hebben je e-mailadres (<strong>{email}</strong>) genoteerd. Zodra jouw gekozen Kamado beschikbaar is, ontvang je direct bericht als eerste!",

      // Footer
      footerDesc: "Dé all-inclusive keramische barbecue met levenslange garantie op het keramiek. Kwaliteit zonder concessies.",
      footerCopyright: "© 2026 CraftKamado Nederland. Alle rechten voorbehouden.",
      footerColQuick: "Snelle Links",
      footerLinkModellen: "Kamado Modellen",
      footerLinkAllInc: "Inbegrepen Pakket",
      footerLinkAcc: "Maatwerk Accessoires",
      footerLinkWaarom: "Onze Filosofie",
      footerColSupport: "Klantenservice",
      footerSupportShip: "Verzending: Gratis palletlevering in heel Nederland",
      footerSupportWarranty: "Garantie: Levenslang op keramiek, 5 jaar op scharnieren",
      footerSupportReturns: "Retourneren: 30 dagen bedenktermijn",
      footerColSecurity: "Veiligheid & Betaalmethoden",
      footerSslNote: "🔒 256-bit SSL Beveiligde Verbinding"
    },
    en: {
      topBanner: "🇳🇱 <strong>Free insured pallet delivery</strong> throughout the Netherlands • Temporary spring promotion: All-Inclusive package included!",
      navModellen: "Kamado Models",
      navAllInclusive: "All-Inclusive Gear",
      navAccessoires: "Accessories",
      navWaarom: "Why CraftKamado?",
      navReviews: "Reviews",
      cartTriggerText: "Cart",
      heroTitle: "Ceramic Mastery.<br><span class=\"highlight\">All-Inclusive</span> Delivered.",
      heroSubtitle: "No hidden costs, no separate accessories to purchase. CraftKamado delivers the most complete ceramic BBQ in the Netherlands, crafted from heavy-duty Mullite ceramic with patented Air Hinge counter-balance.",
      
      // Modellen Section
      modelsSectionTag: "Sizes & Editions",
      modelsSectionTitle: "Choose Your Perfect CraftKamado",
      modelsSectionDesc: "Select a model, size and color. All models arrive complete with our comprehensive All-Inclusive package.",
      tabTitle_18_basic: "18″ Basic",
      tabTitle_18_premium: "18″ Premium",
      tabTitle_21: "21″ Versatile",
      tabTitle_23: "23″ Bestseller",
      tabTitle_27: "27″ HoReCa Giant",
      tabPopularTag: "Most Popular",
      specLabelGrate: "Cooking Grate",
      specLabelBody: "Outer Diameter",
      specLabelPeople: "Capacity",
      specLabelWeight: "Weight",
      colorPickerLabel: "Choose Color:",
      modelVatTag: "Includes 21% VAT & Free Insured Delivery",
      addKamadoBtnText: "Add to Shopping Cart",
      
      // All-Inclusive Section
      incSectionTag: "Unmatched Value",
      incSectionTitle: "What's Included as Standard?",
      incSectionDesc: "Other brands charge hundreds of euros extra for essential gear. With CraftKamado, everything is fully included out of the box.",
      incCardTitle1: "Air Hinge Spring System",
      incCardDesc1: "Effortless opening and closing. Heavy lid stays safely counter-balanced at any desired angle without slamming shut.",
      incCardTitle2: "Divide & Conquer Cooking System",
      incCardDesc2: "Two-level flexible cooking system. Simultaneously grill direct and smoke indirect at different heat levels.",
      incCardTitle3: "Cast Iron Half-Moon Grate",
      incCardDesc3: "Includes heavy-duty cast iron grate for restaurant-grade searing and mouthwatering caramelization.",
      incCardTitle4: "Stainless Ash Drawer & Scraper",
      incCardDesc4: "Effortless ash disposal in seconds without mess via the sliding stainless steel drawer and ash tool.",
      incCardTitle5: "Wood Chip Feeder Port",
      incCardDesc5: "Add smoking chips or chunks mid-cook without lifting the dome or losing heat.",
      incCardTitle6: "Heavy All-Weather Cover",
      incCardDesc6: "Heavy-duty waterproof and UV-resistant custom fitted cover to keep your kamado protected outdoors all year round.",
      incCardTitle7: "Heavy Rolling Cart",
      incCardDesc7: "Powder-coated steel cart with 4 large industrial caster wheels (including 2 heavy foot locks).",
      incCardTitle8: "Folding Bamboo Side Shelves",
      incCardDesc8: "Sturdy natural bamboo shelves with integrated accessory hooks for spatulas, meat tongs and towels.",

      // Accessories Section
      accSectionTag: "Custom Accessories",
      accSectionTitle: "Optional Tailored Accessories",
      accSectionDescTemplate: "Prices and dimensions of the accessories below automatically match your selected <strong id=\"accSelectedSizeLabel\">{size}″ Kamado</strong>.",
      addAccBtn: "+ Add to Cart",
      addedAccBtn: "✓ Added",

      // Waarom Section
      whySectionTag: "Superior Build Quality",
      whySectionTitle: "Engineered for True BBQ Enthusiasts",
      whySectionDesc: "CraftKamado was born from a clear principle: build an uncompromising ceramic grill using the finest materials, without the inflated markups of traditional brands.",
      whyFeatTitle1: "Specialized Mullite Ceramic",
      whyFeatDesc1: "Exceptional thermal shock resistance up to 1,000°C. Resists cracking during sudden temperature spikes or winter frosts.",
      whyFeatTitle2: "30% Lower Charcoal Consumption",
      whyFeatDesc2: "Superior thermal mass enables low & slow cooking for up to 24 hours continuously on a single batch of quality lump charcoal.",
      whyFeatTitle3: "Direct Contact & Dedicated Support",
      whyFeatDesc3: "Our barbecue specialists are always available with hands-on advice for setup, recipes and maintenance.",

      // Reviews Section
      revSectionTag: "Customer Reviews",
      revSectionTitle: "What BBQ Lovers Say",
      revQuote1: "\"The value for money is unmatched. You get a top-tier kamado with spring hinge and divide & conquer where other brands charge hundreds more.\"",
      revQuote2: "\"The Air Hinge counter-balance is a revelation. The heavy lid of the 23-inch feels feather-light. My wife can easily open it with one hand.\"",
      revQuote3: "\"Superb temperature stability! Cooked my first 14-hour brisket without having to adjust the dampers once. Looks gorgeous in our garden.\"",

      // Cart Drawer
      cartDrawerTitle: "Your Shopping Cart",
      cartRowKamadoLabel: "Kamado:",
      cartRowAccLabel: "Accessories:",
      cartRowDeliveryLabel: "Pallet Delivery (Netherlands):",
      cartFreeLabel: "FREE",
      cartRowTotalLabel: "Total (incl. VAT):",
      emptyCartMsg: "Your shopping cart is currently empty.",
      goToCheckoutBtn: "Proceed to Checkout",

      // Checkout Modal
      chkModalTitle: "Checkout & Shipping",
      chkStep1Title: "1. Contact Details",
      chkLabelEmail: "Email Address *",
      chkLabelPhone: "Phone Number *",
      chkStep2Title: "2. Delivery Address in the Netherlands",
      chkLabelName: "Full Name *",
      chkLabelStreet: "Street and house number",
      chkLabelZip: "Postal Code *",
      chkLabelCity: "City *",
      chkStep3Title: "3. Select Payment Method",
      chkIdealSub: "Fast and secure via Dutch bank transfer (Rabobank, ING, ABN AMRO, etc.)",
      chkKlarnaSub: "Pay later within 30 days",
      chkSumModelLabel: "Selected model:",
      chkSumKamadoLabel: "Kamado price:",
      chkSumAccLabel: "Accessories:",
      chkSumShipLabel: "Pallet delivery:",
      chkSumFreeLabel: "Free",
      chkSumTotalLabel: "Total amount:",
      submitIntentBtn: "Continue to payment",
      chkSslNotice: "🔒 Secure checkout via 256-bit SSL encryption",

      // Notice Modal
      noticeTitle: "Thank you for your interest in CraftKamado!",
      noticeBody1: "The CraftKamado you selected is currently not yet available in the Netherlands. We are preparing our launch in the Netherlands.",
      noticeBody2: "Your order has not been placed and nothing has been charged.",
      noticePrompt: "Would you like to be the first to know as soon as your chosen Kamado becomes available?",
      vipNotifyBtn: "Yes, keep me updated",
      closeNoticeBtn: "Close",
      vipAckMsg: "✓ Thank you! We have noted your email address (<strong>{email}</strong>). As soon as your chosen Kamado is available, you will be the first to know!",

      // Footer
      footerDesc: "The all-inclusive ceramic barbecue with lifetime warranty on ceramics. Uncompromising quality.",
      footerCopyright: "© 2026 CraftKamado Netherlands. All rights reserved.",
      footerColQuick: "Quick Links",
      footerLinkModellen: "Kamado Models",
      footerLinkAllInc: "Included Gear",
      footerLinkAcc: "Tailored Accessories",
      footerLinkWaarom: "Our Philosophy",
      footerColSupport: "Customer Support",
      footerSupportShip: "Shipping: Free insured pallet delivery in the Netherlands",
      footerSupportWarranty: "Warranty: Lifetime on ceramics, 5 years on hardware",
      footerSupportReturns: "Returns: 30-day return policy",
      footerColSecurity: "Security & Payment Methods",
      footerSslNote: "🔒 256-bit SSL Secure Connection"
    }
  };

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
    const ref = document.referrer || "";
    if (ref.includes("facebook") || ref.includes("fb.me") || ref.includes("instagram")) return "Facebook / Meta Ad";
    if (ref.includes("google")) return "Google Search";
    if (ref.includes("tiktok")) return "TikTok";
    return ref ? ref.replace(/https?:\/\/(www\.)?/, "").split("/")[0] : "Direct";
  }

  const trafficSource = detectSource();

  // --- STATE ---
  let currentLang = localStorage.getItem("craft_nl_lang") || (new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "nl");
  let activeModelKey = "23";
  let initialColor = "Black";
  let currentColor = COLOR_OPTIONS[0];
  let cart = [];
  let checkoutEmailEntered = "";

  function getSessionId() {
    let sid = localStorage.getItem("craft_nl_session");
    if (!sid) {
      sid = "nl_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem("craft_nl_session", sid);
    }
    return sid;
  }

  const sessionId = getSessionId();

  // --- TELEMETRY ---
  async function trackEvent(eventType, payload = {}) {
    try {
      await fetch("/api/market-test/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          eventType,
          payload: {
            ...payload,
            lang: currentLang,
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

  async function syncCartTelemetry(lastStep = "cart") {
    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      await fetch("/api/market-test/cart-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    return "€" + Number(amount || 0).toLocaleString("nl-NL") + ",-";
  }

  // --- I18N SWITCHER ---
  function setLanguage(lang) {
    currentLang = lang === "en" ? "en" : "nl";
    localStorage.setItem("craft_nl_lang", currentLang);
    document.documentElement.lang = currentLang;

    // Toggle button active states
    document.getElementById("btnLangNl")?.classList.toggle("active", currentLang === "nl");
    document.getElementById("btnLangEn")?.classList.toggle("active", currentLang === "en");

    const t = TRANSLATIONS[currentLang];

    const setElemText = (id, text) => {
      const el = document.getElementById(id);
      if (el && text !== undefined) el.textContent = text;
    };
    const setElemHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el && html !== undefined) el.innerHTML = html;
    };

    // Nav
    setElemText("navModellen", t.navModellen);
    setElemText("navAllInclusive", t.navAllInclusive);
    setElemText("navAccessoires", t.navAccessoires);
    setElemText("navWaarom", t.navWaarom);
    setElemText("navReviews", t.navReviews);
    setElemText("cartTriggerText", t.cartTriggerText);

    // Hero
    const heroTitleEl = document.querySelector(".hero-title");
    if (heroTitleEl) heroTitleEl.innerHTML = t.heroTitle;
    const heroSubEl = document.querySelector(".hero-subtitle");
    if (heroSubEl) heroSubEl.textContent = t.heroSubtitle;

    // Modellen
    setElemText("modelsSectionTag", t.modelsSectionTag);
    setElemText("modelsSectionTitle", t.modelsSectionTitle);
    setElemText("modelsSectionDesc", t.modelsSectionDesc);
    setElemText("tabTitle_18_basic", t.tabTitle_18_basic);
    setElemText("tabTitle_18_premium", t.tabTitle_18_premium);
    setElemText("tabTitle_21", t.tabTitle_21);
    setElemText("tabTitle_23", t.tabTitle_23);
    setElemText("tabTitle_27", t.tabTitle_27);
    setElemText("tabPopularTag", t.tabPopularTag);
    setElemText("specLabelGrate", t.specLabelGrate);
    setElemText("specLabelBody", t.specLabelBody);
    setElemText("specLabelPeople", t.specLabelPeople);
    setElemText("specLabelWeight", t.specLabelWeight);
    setElemText("colorPickerLabel", t.colorPickerLabel);
    setElemText("modelVatTag", t.modelVatTag);
    setElemText("addKamadoBtnText", t.addKamadoBtnText);

    // All-Inclusive
    setElemText("incSectionTag", t.incSectionTag);
    setElemText("incSectionTitle", t.incSectionTitle);
    setElemText("incSectionDesc", t.incSectionDesc);
    for (let i = 1; i <= 8; i++) {
      setElemText(`incCardTitle${i}`, t[`incCardTitle${i}`]);
      setElemText(`incCardDesc${i}`, t[`incCardDesc${i}`]);
    }

    // Accessoires Section
    setElemText("accSectionTag", t.accSectionTag);
    setElemText("accSectionTitle", t.accSectionTitle);
    const curSize = KAMADO_MODELS[activeModelKey]?.sizeInch || "23";
    setElemHtml("accSectionDesc", t.accSectionDescTemplate.replace("{size}", curSize));

    // Waarom
    setElemText("whySectionTag", t.whySectionTag);
    setElemText("whySectionTitle", t.whySectionTitle);
    setElemText("whySectionDesc", t.whySectionDesc);
    setElemText("whyFeatTitle1", t.whyFeatTitle1);
    setElemText("whyFeatDesc1", t.whyFeatDesc1);
    setElemText("whyFeatTitle2", t.whyFeatTitle2);
    setElemText("whyFeatDesc2", t.whyFeatDesc2);
    setElemText("whyFeatTitle3", t.whyFeatTitle3);
    setElemText("whyFeatDesc3", t.whyFeatDesc3);

    // Reviews
    setElemText("revSectionTag", t.revSectionTag);
    setElemText("revSectionTitle", t.revSectionTitle);
    setElemText("revQuote1", t.revQuote1);
    setElemText("revQuote2", t.revQuote2);
    setElemText("revQuote3", t.revQuote3);

    // Cart Drawer
    setElemText("cartDrawerTitle", t.cartDrawerTitle);
    setElemText("cartRowKamadoLabel", t.cartRowKamadoLabel);
    setElemText("cartRowAccLabel", t.cartRowAccLabel);
    setElemText("cartRowDeliveryLabel", t.cartRowDeliveryLabel);
    setElemText("cartFreeLabel", t.cartFreeLabel);
    setElemText("cartRowTotalLabel", t.cartRowTotalLabel);
    setElemText("goToCheckoutBtn", t.goToCheckoutBtn);

    // Checkout Modal
    setElemText("chkModalTitle", t.chkModalTitle);
    setElemText("chkStep1Title", t.chkStep1Title);
    setElemText("chkLabelEmail", t.chkLabelEmail);
    setElemText("chkLabelPhone", t.chkLabelPhone);
    setElemText("chkStep2Title", t.chkStep2Title);
    setElemText("chkLabelName", t.chkLabelName);
    setElemText("chkLabelStreet", t.chkLabelStreet);
    setElemText("chkLabelZip", t.chkLabelZip);
    setElemText("chkLabelCity", t.chkLabelCity);
    setElemText("chkStep3Title", t.chkStep3Title);
    setElemText("chkIdealSub", t.chkIdealSub);
    setElemText("chkKlarnaSub", t.chkKlarnaSub);
    setElemText("chkSumModelLabel", t.chkSumModelLabel);
    setElemText("chkSumKamadoLabel", t.chkSumKamadoLabel);
    setElemText("chkSumAccLabel", t.chkSumAccLabel);
    setElemText("chkSumShipLabel", t.chkSumShipLabel);
    setElemText("chkSumFreeLabel", t.chkSumFreeLabel);
    setElemText("chkSumTotalLabel", t.chkSumTotalLabel);
    setElemText("submitIntentBtn", t.submitIntentBtn);
    setElemText("chkSslNotice", t.chkSslNotice);

    // Input placeholders
    const emailInp = document.getElementById("custEmail");
    if (emailInp) emailInp.placeholder = currentLang === "en" ? "e.g. john@example.com" : "bijv. jan@example.nl";
    const phoneInp = document.getElementById("custPhone");
    if (phoneInp) phoneInp.placeholder = currentLang === "en" ? "e.g. +31 6 12345678" : "bijv. 06 12345678";
    const nameInp = document.getElementById("custName");
    if (nameInp) nameInp.placeholder = currentLang === "en" ? "First and last name" : "Voor- en achternaam";
    const streetInp = document.getElementById("custStreet");
    if (streetInp) streetInp.placeholder = currentLang === "en" ? "e.g. Keizersgracht 42" : "bijv. Keizersgracht 42";
    const zipInp = document.getElementById("custZip");
    if (zipInp) zipInp.placeholder = currentLang === "en" ? "e.g. 1015 CR" : "bijv. 1015 CR";
    const cityInp = document.getElementById("custCity");
    if (cityInp) cityInp.placeholder = currentLang === "en" ? "e.g. Amsterdam" : "bijv. Amsterdam";

    // Notice Modal
    setElemText("noticeTitle", t.noticeTitle);
    setElemText("noticeBody1", t.noticeBody1);
    setElemText("noticeBody2", t.noticeBody2);
    setElemText("noticePrompt", t.noticePrompt);
    setElemText("vipNotifyBtn", t.vipNotifyBtn);
    setElemText("closeNoticeBtn", t.closeNoticeBtn);

    // Footer
    setElemText("footerDesc", t.footerDesc);
    setElemText("footerCopyright", t.footerCopyright);
    setElemText("footerColQuick", t.footerColQuick);
    setElemText("footerLinkModellen", t.footerLinkModellen);
    setElemText("footerLinkAllInc", t.footerLinkAllInc);
    setElemText("footerLinkAcc", t.footerLinkAcc);
    setElemText("footerLinkWaarom", t.footerLinkWaarom);
    setElemText("footerColSupport", t.footerColSupport);
    setElemText("footerSupportShip", t.footerSupportShip);
    setElemText("footerSupportWarranty", t.footerSupportWarranty);
    setElemText("footerSupportReturns", t.footerSupportReturns);
    setElemText("footerColSecurity", t.footerColSecurity);
    setElemText("footerSslNote", t.footerSslNote);

    updateModelConfigurator();
    renderCart();
  }

  // --- UI RENDERERS ---
  function updateModelConfigurator() {
    const model = KAMADO_MODELS[activeModelKey];
    if (!model) return;

    const mName = model.name[currentLang] || model.name.nl;
    const mDesc = model.desc[currentLang] || model.desc.nl;
    const mBadge = model.badge[currentLang] || model.badge.nl;
    const mPeople = model.people[currentLang] || model.people.nl;

    const elName = document.getElementById("activeModelName");
    if (elName) elName.textContent = mName;
    const elPrice = document.getElementById("activeModelPrice");
    if (elPrice) elPrice.textContent = formatEur(model.price);
    const elOrig = document.getElementById("activeModelOrigPrice");
    if (elOrig) elOrig.textContent = formatEur(model.origPrice);
    const elDesc = document.getElementById("activeModelDesc");
    if (elDesc) elDesc.textContent = mDesc;
    const elAddPrice = document.getElementById("addBtnPrice");
    if (elAddPrice) elAddPrice.textContent = formatEur(model.price);

    const elGrate = document.getElementById("specGrate");
    if (elGrate) elGrate.textContent = model.grate;
    const elBody = document.getElementById("specBody");
    if (elBody) elBody.textContent = model.body;
    const elPeople = document.getElementById("specPeople");
    if (elPeople) elPeople.textContent = mPeople;
    const elWeight = document.getElementById("specWeight");
    if (elWeight) elWeight.textContent = model.weight;

    const activeImg = document.getElementById("activeModelImg");
    if (activeImg) activeImg.src = model.image;
    const elBadge = document.getElementById("activeModelBadge");
    if (elBadge) elBadge.textContent = mBadge;

    const thumbsContainer = document.getElementById("galleryThumbs");
    if (thumbsContainer) {
      thumbsContainer.innerHTML = "";
      model.thumbs.forEach((src, idx) => {
        const thumb = document.createElement("div");
        thumb.className = `thumb-item ${idx === 0 ? "active" : ""}`;
        thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}">`;
        thumb.onclick = () => {
          document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
          if (activeImg) activeImg.src = src;
        };
        thumbsContainer.appendChild(thumb);
      });
    }

    const accDescEl = document.getElementById("accSectionDesc");
    if (accDescEl && TRANSLATIONS[currentLang]) {
      accDescEl.innerHTML = TRANSLATIONS[currentLang].accSectionDescTemplate.replace("{size}", model.sizeInch);
    }

    const colorDisp = currentColor.displayName[currentLang] || currentColor.displayName.nl;
    const colorLabel = document.getElementById("selectedColorName");
    if (colorLabel) colorLabel.textContent = colorDisp;

    renderAccessories();
  }

  function renderAccessories() {
    const grid = document.getElementById("accessoriesGrid");
    if (!grid) return;

    const currentSize = KAMADO_MODELS[activeModelKey]?.sizeInch || "23";
    const t = TRANSLATIONS[currentLang];

    grid.innerHTML = "";
    ACCESSORIES.forEach(acc => {
      let price = acc.price;
      let sizeBadge = "";

      if (acc.isSizeDependent) {
        price = acc.sizePrices[currentSize] || acc.sizePrices["23"];
        sizeBadge = `<span class="acc-size-badge">${currentLang === "en" ? "Size" : "Maat"} ${currentSize}″</span>`;
      }

      const accName = acc.name[currentLang] || acc.name.nl;
      const accDesc = acc.desc[currentLang] || acc.desc.nl;

      const card = document.createElement("div");
      card.className = "acc-card";
      card.innerHTML = `
        <div class="acc-img-wrap">
          <img src="${acc.image}" alt="${accName}" class="acc-img">
          ${sizeBadge}
        </div>
        <div class="acc-body">
          <h4 class="acc-title">${accName}</h4>
          <p class="acc-desc">${accDesc}</p>
          <div class="acc-footer">
            <div class="acc-price">${formatEur(price)}</div>
            <button class="btn btn-secondary add-acc-btn" data-id="${acc.id}">
              ${t.addAccBtn}
            </button>
          </div>
        </div>
      `;

      const addBtn = card.querySelector(".add-acc-btn");
      addBtn.addEventListener("click", () => {
        addAccessoryToCart(acc, price, currentSize);
        addBtn.textContent = t.addedAccBtn;
        addBtn.classList.add("btn-primary");
        addBtn.classList.remove("btn-secondary");
        setTimeout(() => {
          addBtn.textContent = t.addAccBtn;
          addBtn.classList.remove("btn-primary");
          addBtn.classList.add("btn-secondary");
        }, 1200);
      });

      grid.appendChild(card);
    });
  }

  // --- CART OPERATIONS ---
  function saveCart() {
    localStorage.setItem("craft_nl_cart", JSON.stringify(cart));
    renderCart();
  }

  function loadCart() {
    try {
      cart = JSON.parse(localStorage.getItem("craft_nl_cart") || "[]");
    } catch (e) {
      cart = [];
    }
  }

  function addModelToCart() {
    const model = KAMADO_MODELS[activeModelKey];
    if (!model) return;

    const mName = model.name[currentLang] || model.name.nl;
    const cDisp = currentColor.displayName[currentLang] || currentColor.displayName.nl;

    const existingIndex = cart.findIndex(i => i.type === "kamado");
    const kamadoItem = {
      id: "kamado_" + model.key,
      type: "kamado",
      modelKey: model.key,
      sizeInch: model.sizeInch,
      name: mName,
      colorId: currentColor.id,
      colorName: currentColor.name,
      colorDisplayName: cDisp,
      price: model.price,
      qty: 1,
      image: model.image
    };

    if (existingIndex > -1) {
      cart[existingIndex] = kamadoItem;
    } else {
      cart.unshift(kamadoItem);
    }

    saveCart();
    openCart();
    trackEvent("add_to_cart", { item: kamadoItem });
    syncCartTelemetry("cart");
  }

  function addAccessoryToCart(acc, price, sizeInch) {
    const accName = acc.name[currentLang] || acc.name.nl;
    const itemKey = acc.isSizeDependent ? `${acc.id}_${sizeInch}` : acc.id;
    const displayName = acc.isSizeDependent ? `${accName} (${sizeInch}″)` : accName;

    const existing = cart.find(i => i.id === itemKey);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: itemKey,
        type: "accessory",
        accessoryId: acc.id,
        name: displayName,
        sizeInch: acc.isSizeDependent ? sizeInch : null,
        price,
        qty: 1,
        image: acc.image
      });
    }

    saveCart();
    openCart();
    trackEvent("add_to_cart", { item: { id: itemKey, name: displayName, price } });
    syncCartTelemetry("cart");
  }

  function renderCart() {
    const listEl = document.getElementById("cartItemsList");
    const countBadge = document.getElementById("cartCountBadge");
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const t = TRANSLATIONS[currentLang];

    if (countBadge) countBadge.textContent = totalCount;

    if (!listEl) return;

    if (cart.length === 0) {
      listEl.innerHTML = `<div class="empty-cart-msg">${t.emptyCartMsg}</div>`;
      document.getElementById("cartKamadoSubtotal").textContent = formatEur(0);
      document.getElementById("cartAccSubtotal").textContent = formatEur(0);
      document.getElementById("cartTotal").textContent = formatEur(0);
      document.getElementById("goToCheckoutBtn").disabled = true;
      return;
    }

    document.getElementById("goToCheckoutBtn").disabled = false;
    listEl.innerHTML = "";

    let kamadoSubtotal = 0;
    let accSubtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      if (item.type === "kamado") {
        kamadoSubtotal += itemTotal;
      } else {
        accSubtotal += itemTotal;
      }

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          ${item.colorDisplayName ? `<div class="cart-item-variant">${currentLang === "en" ? "Color" : "Kleur"}: ${item.colorDisplayName}</div>` : ""}
          <div class="cart-item-price">${formatEur(item.price)} ${item.qty > 1 ? `× ${item.qty}` : ""}</div>
        </div>
        <div class="cart-item-actions">
          <button class="cart-remove-btn" aria-label="Verwijderen" data-index="${index}">&times;</button>
        </div>
      `;

      itemEl.querySelector(".cart-remove-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart();
        syncCartTelemetry("cart");
      });

      listEl.appendChild(itemEl);
    });

    const total = kamadoSubtotal + accSubtotal;
    document.getElementById("cartKamadoSubtotal").textContent = formatEur(kamadoSubtotal);
    document.getElementById("cartAccSubtotal").textContent = formatEur(accSubtotal);
    document.getElementById("cartTotal").textContent = formatEur(total);
  }

  function openCart() {
    document.getElementById("cartDrawer")?.classList.add("open");
    document.getElementById("cartBackdrop")?.classList.add("open");
    trackEvent("open_cart", { totalItems: cart.length });
  }

  function closeCart() {
    document.getElementById("cartDrawer")?.classList.remove("open");
    document.getElementById("cartBackdrop")?.classList.remove("open");
  }

  // --- CHECKOUT MODAL ---
  function openCheckout() {
    closeCart();
    const modal = document.getElementById("checkoutModalBackdrop");
    modal?.classList.add("open");

    const kamadoItem = cart.find(i => i.type === "kamado");
    let modelSummaryText = kamadoItem
      ? `${kamadoItem.name} (${kamadoItem.colorDisplayName})`
      : (currentLang === "en" ? "Accessories only" : "Alleen accessoires");

    const kamadoSub = cart.filter(i => i.type === "kamado").reduce((s, i) => s + (i.price * i.qty), 0);
    const accSub = cart.filter(i => i.type === "accessory").reduce((s, i) => s + (i.price * i.qty), 0);
    const total = kamadoSub + accSub;

    document.getElementById("checkoutModelSummary").textContent = modelSummaryText;
    document.getElementById("checkoutKamadoPrice").textContent = formatEur(kamadoSub);
    document.getElementById("checkoutAccPrice").textContent = formatEur(accSub);
    document.getElementById("checkoutTotalAmount").textContent = formatEur(total);
    document.getElementById("formErrors").textContent = "";

    trackEvent("checkout_start", { totalAmount: total, kamadoSub, accSub });
    syncCartTelemetry("checkout");
  }

  function closeCheckout() {
    document.getElementById("checkoutModalBackdrop")?.classList.remove("open");
  }

  function setupContactTracking() {
    const emailInput = document.getElementById("custEmail");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        const val = emailInput.value.trim();
        if (val.includes("@")) {
          checkoutEmailEntered = val;
          trackEvent("contact_complete", { email: val });
          syncCartTelemetry("checkout");
        }
      });
    }
  }

  // --- FINAL PURCHASE INTENT SUBMIT ---
  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById("formErrors");
    errorEl.textContent = "";

    const email = document.getElementById("custEmail").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const name = document.getElementById("custName").value.trim();
    const street = (document.getElementById("custStreet")?.value || "").trim();
    const zip = document.getElementById("custZip").value.trim();
    const city = document.getElementById("custCity").value.trim();

    if (!email || !email.includes("@")) {
      errorEl.textContent = currentLang === "en" ? "Please provide a valid email address." : "Vul een geldig e-mailadres in.";
      return;
    }
    if (!phone || phone.length < 7) {
      errorEl.textContent = currentLang === "en" ? "Please provide a valid phone number." : "Vul een geldig telefoonnummer in.";
      return;
    }
    if (!name) {
      errorEl.textContent = currentLang === "en" ? "Please provide your full name." : "Vul uw volledige naam in.";
      return;
    }
    if (!zip || !city) {
      errorEl.textContent = currentLang === "en" ? "Please enter your postal code and city." : "Vul postcode en woonplaats in.";
      return;
    }

    const submitBtn = document.getElementById("submitIntentBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === "en" ? "Processing..." : "Verwerken...";

    const kamadoItem = cart.find(i => i.type === "kamado") || {};
    const kamadoSub = cart.filter(i => i.type === "kamado").reduce((s, i) => s + (i.price * i.qty), 0);
    const accSub = cart.filter(i => i.type === "accessory").reduce((s, i) => s + (i.price * i.qty), 0);
    const totalAmount = kamadoSub + accSub;

    const paymentOpt = document.querySelector(`input[name="payment_method"]:checked`)?.value || "ideal";

    const payload = {
      sessionId,
      customer: {
        name,
        email,
        phone,
        street,
        postalCode: zip,
        city,
        country: "NL"
      },
      paymentMethod: paymentOpt,
      source: trafficSource,
      landingPage: window.location.pathname + window.location.search,
      initialColor,
      finalColor: currentColor.name,
      modelName: kamadoItem.name || `${activeModelKey}″ CraftKamado`,
      sizeInch: kamadoItem.sizeInch || "23",
      items: cart,
      accessories: cart.filter(i => i.type === "accessory"),
      kamadoPriceEur: kamadoSub,
      accessoriesPriceEur: accSub,
      totalAmountEur: totalAmount
    };

    try {
      const resp = await fetch("/api/market-test/purchase-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(errJson.error || (currentLang === "en" ? "An error occurred while saving." : "Er trad een fout op bij het opslaan."));
      }

      trackEvent("purchase_intent", {
        model: payload.modelName,
        color: payload.finalColor,
        totalEur: totalAmount,
        email
      });

      // Close checkout modal & Open exact Dutch / English demand notice modal
      closeCheckout();
      showDemandNoticeModal(email);

      // Clear cart
      cart = [];
      saveCart();
    } catch (err) {
      errorEl.textContent = err.message || (currentLang === "en" ? "An error occurred. Please try again." : "Er trad een fout op. Probeer het opnieuw.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = TRANSLATIONS[currentLang].submitIntentBtn;
    }
  }

  function showDemandNoticeModal(customerEmail) {
    const noticeModal = document.getElementById("intentNoticeBackdrop");
    const emailContainer = document.getElementById("vipEmailContainer");
    const emailInput = document.getElementById("vipEmailInput");
    const notifyBtn = document.getElementById("vipNotifyBtn");
    const confirmationMsg = document.getElementById("vipConfirmationMsg");
    const t = TRANSLATIONS[currentLang];

    confirmationMsg.style.display = "none";
    notifyBtn.style.display = "block";
    notifyBtn.textContent = t.vipNotifyBtn;

    if (customerEmail) {
      // Email was already provided in checkout! Do NOT ask again!
      emailContainer.style.display = "none";
      notifyBtn.onclick = () => {
        confirmationMsg.innerHTML = t.vipAckMsg.replace("{email}", customerEmail);
        confirmationMsg.style.display = "block";
        notifyBtn.style.display = "none";
      };
    } else {
      // Prompt email if missing
      emailContainer.style.display = "block";
      notifyBtn.onclick = async () => {
        const mail = emailInput.value.trim();
        if (!mail || !mail.includes("@")) {
          alert(currentLang === "en" ? "Please enter a valid email address." : "Vul een geldig e-mailadres in.");
          return;
        }
        confirmationMsg.innerHTML = t.vipAckMsg.replace("{email}", mail);
        confirmationMsg.style.display = "block";
        notifyBtn.style.display = "none";
        emailContainer.style.display = "none";
      };
    }

    noticeModal?.classList.add("open");
  }

  // --- INITIALIZATION ---
  document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    // 1. Language Toggle Buttons
    document.getElementById("btnLangNl")?.addEventListener("click", () => setLanguage("nl"));
    document.getElementById("btnLangEn")?.addEventListener("click", () => setLanguage("en"));

    // 2. Initial Telemetry
    trackEvent("page_view", {
      path: window.location.pathname,
      url: window.location.href,
      lang: currentLang
    });

    // 3. Size Tabs
    const tabs = document.querySelectorAll(".size-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeModelKey = tab.getAttribute("data-model-key");
        updateModelConfigurator();
      });
    });

    // 4. Color dots
    const dots = document.querySelectorAll(".color-dot");
    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        dots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");

        const cid = dot.getAttribute("data-color-id");
        const cObj = COLOR_OPTIONS.find(c => c.id === cid) || {
          id: cid,
          name: dot.getAttribute("data-color-name"),
          displayName: { nl: dot.getAttribute("data-display-name"), en: dot.getAttribute("data-display-name") }
        };

        currentColor = cObj;
        const colorLabel = document.getElementById("selectedColorName");
        if (colorLabel) colorLabel.textContent = cObj.displayName[currentLang] || cObj.displayName.nl || cObj.name;

        trackEvent("select_color", { color: currentColor.name });
      });
    });

    // 5. Cart Drawer Triggers
    document.getElementById("cartBtn")?.addEventListener("click", openCart);
    document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
    document.getElementById("cartBackdrop")?.addEventListener("click", closeCart);

    // 6. Add to cart actions
    document.getElementById("addModelToCartBtn")?.addEventListener("click", addModelToCart);
    document.getElementById("directCheckoutBtn")?.addEventListener("click", () => {
      addModelToCart();
      openCheckout();
    });

    // 7. Checkout triggers
    document.getElementById("goToCheckoutBtn")?.addEventListener("click", openCheckout);
    document.getElementById("closeCheckoutBtn")?.addEventListener("click", closeCheckout);

    // 8. Payment selector in checkout
    document.querySelectorAll(".payment-opt").forEach(opt => {
      opt.addEventListener("click", () => {
        document.querySelectorAll(".payment-opt").forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
      });
    });

    // 9. Form submit & contact tracking
    setupContactTracking();
    document.getElementById("checkoutForm")?.addEventListener("submit", handleCheckoutSubmit);

    // 10. Close notice modal
    document.getElementById("closeNoticeBtn")?.addEventListener("click", () => {
      document.getElementById("intentNoticeBackdrop")?.classList.remove("open");
    });

    // Set initial language & render
    setLanguage(currentLang);
  });
})();
