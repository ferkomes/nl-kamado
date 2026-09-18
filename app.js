/**
 * SmokeyKamado Netherlands - Market Demand Storefront Logic
 * - Full Dual-Language Support: Dutch (NL) & English (EN)
 * - Non-binding interest registration with indicative shipping costs
 * - Funnel telemetry: visitor -> add_to_cart -> checkout -> purchase_intent
 * - Model selection: 18 Basic, 18 Premium, 21, 23, 27
 * - Color selection: Black, Burgundy, Blue, Green, Orange, Beige, Yellow
 * - Size-specific accessories matrix & attach rates
 * - Legal Dutch/English demand validation notice modal
 */

(function() {
  /* SHIPPING_POLICY */
  /* MEDIA_GALLERY */
  "use strict";

  // --- CATALOG DATA ---
  const KAMADO_MODELS = {
    "18_basic": {
      key: "18_basic",
      name: { nl: "SmokeyKamado 18″ Basic", en: "SmokeyKamado 18″ Basic" },
      sizeInch: "18",
      modelCode: "CK-18BAS",
      badge: { nl: "Compact & Scherp Geprijsd", en: "Compact & Best Value" },
      price: 549,
      rrp: 599,
      grate: "Ø 38.5 cm",
      body: "45.0 cm (17.7″)",
      people: { nl: "2–4 personen", en: "2–4 people" },
      weight: "55.0 kg",
      desc: {
        nl: "Compacte keramische kamado barbecue met uitstekende warmte-isolatie. Ideaal voor balkons, stadstuinen of kleine gezinnen.",
        en: "Compact ceramic kamado BBQ with outstanding thermal insulation. Ideal for balconies, urban gardens or small families."
      },
      image: "/assets/auplex/18-2.jpg",
      thumbs: ["/assets/auplex/18-2.jpg", "/assets/auplex/18-1.jpg", "/assets/auplex/18-3.jpg", "/assets/auplex/18-4.jpg"]
    },
    "18_premium": {
      key: "18_premium",
      name: { nl: "SmokeyKamado 18″ Premium", en: "SmokeyKamado 18″ Premium" },
      sizeInch: "18",
      modelCode: "CK-18PREM",
      badge: { nl: "Compact & Familie", en: "Compact & Family" },
      price: 799,
      rrp: 849,
      grate: "Ø 38.5 cm",
      body: "45.0 cm (17.7″)",
      people: { nl: "2–4 personen", en: "2–4 people" },
      weight: "59.5 kg",
      desc: {
        nl: "Compleet Premium pakket met Strong Hinge, zwarte HDPE zijtafels, Divide & Conquer, RVS aslade en wood-chip feeder, zwarte banden met RVS bevestigingen, onderstel met bodemschap en waterdichte hoes.",
        en: "Complete Premium package with Strong Hinge, black HDPE side tables, Divide & Conquer, stainless-steel ash drawer and wood-chip feeder, black bands with stainless hardware, cart with bottom shelf and waterproof cover."
      },
      image: "/assets/auplex/18-2.jpg",
      thumbs: ["/assets/auplex/18-2.jpg", "/assets/auplex/18-1.jpg", "/assets/auplex/18-3.jpg", "/assets/auplex/18-4.jpg"]
    },
    "21": {
      key: "21",
      name: { nl: "SmokeyKamado 21″ Veelzijdig", en: "SmokeyKamado 21″ Versatile" },
      sizeInch: "21",
      modelCode: "CK-21ALL",
      badge: { nl: "Veelzijdig & Familie+", en: "Versatile & Family+" },
      price: 949,
      rrp: 1099,
      grate: "Ø 47.5 cm",
      body: "53.6 cm (21.1″)",
      people: { nl: "4–6 personen", en: "4–6 people" },
      weight: "75.0 kg",
      desc: {
        nl: "Compleet Premium pakket met Air Hinge, zwarte HDPE zijtafels, Divide & Conquer, RVS aslade en wood-chip feeder, zwarte banden met RVS bevestigingen, onderstel met bodemschap en waterdichte hoes.",
        en: "Complete Premium package with Air Hinge, black HDPE side tables, Divide & Conquer, stainless-steel ash drawer and wood-chip feeder, black bands with stainless hardware, cart with bottom shelf and waterproof cover."
      },
      image: "/assets/auplex/21-1.jpg",
      thumbs: ["/assets/auplex/21-1.jpg"]
    },
    "23": {
      key: "23",
      name: { nl: "SmokeyKamado 23″ Premium", en: "SmokeyKamado 23″ Premium" },
      sizeInch: "23",
      modelCode: "CK-23BEST",
      badge: { nl: "Premium / Air Hinge", en: "Premium / Air Hinge" },
      price: 1049,
      rrp: 1199,
      grate: "Ø 52.3 cm",
      body: "59.5 cm (23.5″)",
      people: { nl: "4–8 personen (Ideaal)", en: "4–8 people (Optimal)" },
      weight: "89.0 kg",
      desc: {
        nl: "Compleet Premium pakket met Air Hinge, zwarte HDPE zijtafels, Divide & Conquer, RVS aslade en wood-chip feeder, zwarte banden met RVS bevestigingen, onderstel met bodemschap en waterdichte hoes.",
        en: "Complete Premium package with Air Hinge, black HDPE side tables, Divide & Conquer, stainless-steel ash drawer and wood-chip feeder, black bands with stainless hardware, cart with bottom shelf and waterproof cover."
      },
      image: "/assets/auplex/23-2.jpg",
      thumbs: ["/assets/auplex/23-2.jpg", "/assets/auplex/23-1.jpg", "/assets/auplex/23-3.jpg", "/assets/auplex/23-4.jpg"]
    },
    "27": {
      key: "27",
      name: { nl: "SmokeyKamado 27″ HoReCa Reus", en: "SmokeyKamado 27″ Heavy Duty Giant" },
      sizeInch: "27",
      modelCode: "CK-27PRO",
      badge: { nl: "Reus / HoReCa & Heavy Duty", en: "Giant / Commercial & Heavy Duty" },
      price: 1199,
      rrp: 1399,
      grate: "Ø 57.5 cm",
      body: "67.7 cm (26.6″)",
      people: { nl: "6–12+ personen", en: "6–12+ people" },
      weight: "94.6 kg",
      desc: {
        nl: "Compleet Premium pakket met Air Hinge, zwarte HDPE zijtafels, Divide & Conquer, RVS aslade en wood-chip feeder, zwarte banden met RVS bevestigingen, onderstel met bodemschap en waterdichte hoes.",
        en: "Complete Premium package with Air Hinge, black HDPE side tables, Divide & Conquer, stainless-steel ash drawer and wood-chip feeder, black bands with stainless hardware, cart with bottom shelf and waterproof cover."
      },
      image: "/assets/auplex/27-2.jpg",
      thumbs: ["/assets/auplex/27-2.jpg", "/assets/auplex/27-1.jpg", "/assets/auplex/27-3.jpg"]
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
      image: "/assets/auplex/cover-2.jpg",
      thumbs: ["/assets/auplex/cover-2.jpg", "/assets/auplex/cover-1.jpg", "/assets/auplex/cover-3.jpg"]
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
      image: "/assets/auplex/rotisserie-1.jpg",
      thumbs: ["/assets/auplex/rotisserie-1.jpg", "/assets/auplex/rotisserie-2.jpg"]
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
      image: "/assets/auplex/cast-iron-1.jpg",
      thumbs: ["/assets/auplex/cast-iron-1.jpg"]
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
      image: "/assets/auplex/pizza-2.jpg",
      thumbs: ["/assets/auplex/pizza-2.jpg", "/assets/auplex/pizza-1.jpg"]
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
      image: "/assets/auplex/starter-1.jpg",
      thumbs: ["/assets/auplex/starter-1.jpg", "/assets/auplex/starter-2.jpg", "/assets/auplex/starter-3.jpg"]
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
      image: "/assets/auplex/gloves-2.jpg",
      thumbs: ["/assets/auplex/gloves-2.jpg", "/assets/auplex/gloves-1.jpg"]
    }
  ];

  const COLOR_OPTIONS = [
    { id: "black", name: "Black", hex: "#171717", displayName: { nl: "Black (Onyx Zwart)", en: "Black (Onyx Black)" } },
    { id: "burgundy", name: "Burgundy", hex: "#781d2e", displayName: { nl: "Burgundy (Bordeaux Rood)", en: "Burgundy (Wine Red)" } },
    { id: "blue", name: "Blue", hex: "#1b3f75", displayName: { nl: "Blue (Marine Blauw)", en: "Blue (Navy Blue)" } },
    { id: "green", name: "Green", hex: "#235338", displayName: { nl: "Green (Bosgroen)", en: "Green (Forest Green)" } },
    { id: "orange", name: "Orange", hex: "#df5417", displayName: { nl: "Orange (Smokey Oranje)", en: "Orange (Smokey Orange)" } },
    { id: "beige", name: "Beige", hex: "#d6cbb6", displayName: { nl: "Beige (Zand Beige)", en: "Beige (Sand Beige)" } },
    { id: "yellow", name: "Yellow", hex: "#dca326", displayName: { nl: "Yellow (Warm Okergeel)", en: "Yellow (Warm Ochre)" } }
  ];

  // --- I18N DICTIONARY ---
  const TRANSLATIONS = {
    nl: {
      topBanner: "🇳🇱 Palletbezorging vanaf €99 incl. btw • Interessepeiling — nog geen verkoop",
      navModellen: "Kamado’s",
      navAllInclusive: "Premium pakket",
      navAccessoires: "Accessoires",
      navWaarom: "Waarom SmokeyKamado?",
      navReviews: "Ervaringen",
      navFaq: "FAQ",
      footerLinkFaq: "Veelgestelde Vragen (FAQ)",
      faqSectionTag: "Kennisbank & Antwoorden",
      faqSectionTitle: "Veelgestelde Vragen over de Kamado BBQ",
      faqSectionDesc: "Alles wat je moet weten over het kiezen, grillen en onderhouden van jouw SmokeyKamado keramische barbecue.",
      faqQ1: "Wat maakt een keramische kamado barbecue superieur aan een gewone barbecue?",
      faqA1: "Een keramische kamado is een houtskoolbarbecue met een dikwandige keramische behuizing. Die houdt warmte vast en is geschikt voor direct grillen, indirect garen, roken en pizza bakken. Temperatuur en brandduur hangen af van de luchttoevoer, brandstof, belading en omstandigheden.",
      faqQ2: "Welke kamado maat (18, 21, 23 of 27 inch) is het meest geschikt voor mij?",
      faqA2: "Kies op basis van de diameter van het grillrooster, je kookstijl en de beschikbare buitenruimte. De 18 inch is beschikbaar als Basic of Premium. De 21, 23 en 27 inch hebben de Premium-uitrusting. Bekijk de vergelijkingstabel voor roosterdiameters en indicatieve aantallen personen; die hangen ook af van het gerecht.",
      faqQ3: "Wat zit er standaard inbegrepen in het SmokeyKamado All-Inclusive pakket?",
      faqA3: "<p>Premium specificatie:</p><ul><li>Zwarte HDPE zijtafels: Massief zwarte, inklapbare HDPE zijtafels met gereedschapshaken.</li><li>Compleet Divide & Conquer: Rek, 2 keramische halve-maan hitteschilden en 2 RVS halve-maan grillroosters.</li><li>2 gietijzeren halve-maan roosters: Gevraagde Premium specificatie: 1 complete set van 2 roosters. Inbegrepen levering nog te bevestigen.</li><li>RVS aslade: Uitschuifbare roestvaststalen aslade.</li><li>RVS wood-chip feeder: Complete buisvormige roestvaststalen wood-chip feeder.</li><li>Waterdichte Oxford hoes: Hoes in de juiste maat, van Oxford-stof met waterdichte PU-laag.</li><li>Premium zwart onderstel: Zwaar zwart onderstel met massief bodemschap en 4 zware wielen, waarvan 2 geremd.</li><li>Zwarte banden, RVS bevestigingen: Zware zwarte metalen banden. RVS schroeven, bouten, moeren, ringen en bevestigingsmateriaal voor de volledige montage.</li><li>Strong Hinge / Air Hinge & sluiting: 18″ Premium: Strong Hinge. 21″/23″/27″: verstelbare Air Hinge. Inclusief dekselsluiting en zwarte handgreep.</li><li>RVS onderste ventilatieschuif: Roestvaststalen luchtregeling aan de onderzijde.</li><li>Zwarte topventilatie: Premium zwarte top vent met dubbele handgreep.</li><li>Zwarte thermometer: Ingebouwde zwarte thermometer.</li><li>Glasvezel pakking: Fiberglass gasket rondom de sluiting.</li><li>Complete keramische vuurbox: Zware meerdelige keramische vuurbox, complete vuurring en zware houtskoolplaat / vuurrooster.</li><li>Matte Bubble Glaze: Matte Bubble Glaze keramische behuizing en deksel in de opgegeven Pantone-kleuren.</li></ul>",
      faqQ4: "Hoe verloopt de bezorging en palletlevering in Nederland?",
      faqA4: "Geplande bezorgkosten op het Nederlandse vasteland: 18″/21″/23″ €99, 27″ €129 incl. btw per kamado. Losse accessoires: €7,95 per bestelling. Levering aan de stoeprand op een bereikbare, verharde plek. Eilanden en bijzondere adressen op offerte. Dit is een interessepeiling; kosten en levertijd worden vóór een eventuele aankoop bevestigd. <a href=\"/support/shipping\">Lees de bezorginformatie</a>.",
      faqQ5: "Kan de keramische kamado het hele jaar door buiten blijven staan in de Nederlandse winter?",
      faqA5: "Bescherm de kamado met een passende hoes wanneer hij is afgekoeld. Houd ventilatie en onderdelen schoon en droog en volg de onderhoudsinstructies. Keramiek en metalen onderdelen kunnen bij onjuist gebruik of onderhoud beschadigen.",

      cartTriggerText: "Winkelwagen",
      heroTitle: "Keramisch Meesterschap.<br><span class=\"highlight\">All-Inclusive</span> Geleverd.",
      heroSubtitle: "Geen verborgen kosten, geen losse accessoires bijkopen. SmokeyKamado levert de meest complete keramische barbecue van Nederland, vervaardigd uit zwaar Mullite keramiek met gepatenteerd Air Hinge scharnier.",
      
      // Modellen Section
      modelsSectionTag: "Formaten & Uitvoeringen",
      modelsSectionTitle: "Maak hem van jou.",
      modelsSectionDesc: "Bekijk de uitvoering en beschikbare kleuren.",
      tabTitle_18_basic: "18″ Basic",
      tabTitle_18_premium: "18″ Premium",
      tabTitle_21: "21″ Veelzijdig",
      tabTitle_23: "23″ Premium",
      tabTitle_27: "27″ HoReCa Reus",
      tabPopularTag: "Meest Gekozen",
      specLabelGrate: "Grillrooster",
      specLabelBody: "Buitendiameter",
      specLabelPeople: "Capaciteit",
      specLabelWeight: "Gewicht",
      colorPickerLabel: "Kies Kleur:",
      modelVatTag: "Incl. 21% btw • bezorging apart, vanaf €99",
      addKamadoBtnText: "In Winkelwagen Leggen",
      
      // All-Inclusive Section
      incSectionTag: "Ongeëvenaarde Waarde",
      incSectionTitle: "Premium. Tot in het detail.",
      incSectionDesc: "Premium specificatie: zwart metaal en RVS functionele onderdelen. Gietijzeren roosters: inbegrepen levering nog te bevestigen.",
      incCardTitle1: "Zwarte HDPE zijtafels",
      incCardDesc1: "Massief zwarte, inklapbare HDPE zijtafels met gereedschapshaken.",
      incCardTitle2: "Compleet Divide & Conquer",
      incCardDesc2: "Rek, 2 keramische halve-maan hitteschilden en 2 RVS halve-maan grillroosters.",
      incCardTitle3: "2 gietijzeren halve-maan roosters",
      incCardDesc3: "Gevraagde Premium specificatie: 1 complete set van 2 roosters. Inbegrepen levering nog te bevestigen.",
      incCardTitle4: "RVS aslade",
      incCardDesc4: "Uitschuifbare roestvaststalen aslade.",
      incCardTitle5: "RVS wood-chip feeder",
      incCardDesc5: "Complete buisvormige roestvaststalen wood-chip feeder.",
      incCardTitle6: "Waterdichte Oxford hoes",
      incCardDesc6: "Hoes in de juiste maat, van Oxford-stof met waterdichte PU-laag.",
      incCardTitle7: "Premium zwart onderstel",
      incCardDesc7: "Zwaar zwart onderstel met massief bodemschap en 4 zware wielen, waarvan 2 geremd.",
      incCardTitle8: "Zwarte banden, RVS bevestigingen",
      incCardDesc8: "Zware zwarte metalen banden. RVS schroeven, bouten, moeren, ringen en bevestigingsmateriaal voor de volledige montage.",

      // Accessories Section
      accSectionTag: "Maatwerk Accessoires",
      accSectionTitle: "Kamado accessoires op maat",
      accSectionDescTemplate: "Prijzen en afmetingen van onderstaande accessoires passen zich automatisch aan op jouw geselecteerde <strong id=\"accSelectedSizeLabel\">{size}″ Kamado</strong>.",
      addAccBtn: "+ Toevoegen",
      addedAccBtn: "✓ Toegevoegd",

      // Waarom Section
      whySectionTag: "Superieure Bouwkwaliteit",
      whySectionTitle: "Ontwikkeld voor Echte BBQ Fanaten",
      whySectionDesc: "SmokeyKamado is ontstaan uit één heldere filosofie: een compromisloze keramische barbecue bouwen met de allerbeste materialen, zónder de torenhoge marketingopslagen van gevestigde merken.",
      whyFeatTitle1: "Speciaal Mullite Keramiek",
      whyFeatDesc1: "De keramische behuizing houdt warmte vast. Volg de gebruiksinstructies en voorkom plotselinge temperatuurwisselingen.",
      whyFeatTitle2: "Warmte vasthouden voor low & slow",
      whyFeatDesc2: "Regel de temperatuur met de boven- en onderventilatie. Gebruik hitteschilden voor indirect garen.",
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
      cartRowDeliveryLabel: "Bezorging (indicatie):",
      cartFreeLabel: "—",
      cartRowTotalLabel: "Totaal (incl. BTW):",
      emptyCartMsg: "Je winkelwagen is nog leeg.",
      goToCheckoutBtn: "Interesse doorgeven",

      // Checkout Modal
      chkModalTitle: "Jouw interesse & gegevens",
      chkStep1Title: "1. Contactgegevens",
      chkLabelEmail: "E-mailadres *",
      chkLabelPhone: "Telefoonnummer *",
      chkStep2Title: "2. Bezorgadres in Nederland",
      chkLabelName: "Volledige Naam *",
      chkLabelStreet: "Straat en huisnummer",
      chkLabelZip: "Postcode *",
      chkLabelCity: "Woonplaats *",
      chkStep3Title: "3. Gewenste betaalmethode bij opening",
      chkIdealSub: "Direct en veilig via Rabobank, ING, ABN AMRO, etc.",
      chkKlarnaSub: "Achteraf betalen binnen 30 dagen",
      chkSumModelLabel: "Gekozen model:",
      chkSumKamadoLabel: "Kamado prijs:",
      chkSumAccLabel: "Accessoires:",
      chkSumShipLabel: "Bezorging (indicatie):",
      chkSumFreeLabel: "—",
      chkSumTotalLabel: "Totaalbedrag:",
      submitIntentBtn: "Interesse vrijblijvend versturen",
      chkSslNotice: "Geen betaling of bestelling. Prijzen en bezorgkosten zijn indicatief.",

      // Notice Modal
      noticeTitle: "Bedankt voor je interesse in SmokeyKamado!",
      noticeBody1: "De door jou gekozen SmokeyKamado is momenteel nog niet beschikbaar in Nederland. We bereiden onze Nederlandse introductie voor.",
      noticeBody2: "Je bestelling is niet geplaatst en er is niets in rekening gebracht.",
      noticePrompt: "Wil je als eerste bericht krijgen zodra jouw gekozen Kamado beschikbaar is?",
      vipNotifyBtn: "Ja, houd mij op de hoogte",
      closeNoticeBtn: "Sluiten",
      vipAckMsg: "✓ Dankjewel! We hebben je e-mailadres (<strong>{email}</strong>) genoteerd. Zodra jouw gekozen Kamado beschikbaar is, ontvang je direct bericht als eerste!",

      // Footer
      footerDesc: "Keramische kamados en accessoires. Ontdek het assortiment en meld vrijblijvend je interesse.",

      incCardTitle9: "Strong Hinge / Air Hinge & sluiting",

      incCardDesc9: "18″ Premium: Strong Hinge. 21″/23″/27″: verstelbare Air Hinge. Inclusief dekselsluiting en zwarte handgreep.",

      incCardTitle10: "RVS onderste ventilatieschuif",

      incCardDesc10: "Roestvaststalen luchtregeling aan de onderzijde.",

      incCardTitle11: "Zwarte topventilatie",

      incCardDesc11: "Premium zwarte top vent met dubbele handgreep.",

      incCardTitle12: "Zwarte thermometer",

      incCardDesc12: "Ingebouwde zwarte thermometer.",

      incCardTitle13: "Glasvezel pakking",

      incCardDesc13: "Fiberglass gasket rondom de sluiting.",

      incCardTitle14: "Complete keramische vuurbox",

      incCardDesc14: "Zware meerdelige keramische vuurbox, complete vuurring en zware houtskoolplaat / vuurrooster.",

      incCardTitle15: "Matte Bubble Glaze",

      incCardDesc15: "Matte Bubble Glaze keramische behuizing en deksel in de opgegeven Pantone-kleuren.",
      footerCopyright: "© 2026 SmokeyKamado Nederland. Alle rechten voorbehouden.",
      footerColQuick: "Snelle Links",
      footerLinkModellen: "Kamado Modellen",
      footerLinkAllInc: "Inbegrepen Pakket",
      footerLinkAcc: "Maatwerk Accessoires",
      footerLinkWaarom: "Onze Filosofie",
      footerColSupport: "Klantenservice",
      footerSupportShip: "Verzending: tarieven en levering",
      footerSupportWarranty: "Garantie: rechten en service",
      footerSupportReturns: "Retourneren: 30 dagen bedenktijd",
      footerColSecurity: "Veiligheid & Betaalmethoden",
      footerSslNote: "🔒 256-bit SSL Beveiligde Verbinding"
    },
    en: {
      topBanner: "🇳🇱 Pallet delivery from €99 incl. VAT • Interest registration — sales not open yet",
      navModellen: "Kamados",
      navAllInclusive: "Premium package",
      navAccessoires: "Accessories",
      navWaarom: "Why SmokeyKamado?",
      navReviews: "Reviews",
      navFaq: "FAQ",
      footerLinkFaq: "Frequently Asked Questions (FAQ)",
      faqSectionTag: "Knowledge Base & FAQ",
      faqSectionTitle: "Frequently Asked Questions About Kamado BBQ",
      faqSectionDesc: "Everything you need to know about choosing, grilling and maintaining your SmokeyKamado ceramic barbecue grill.",
      faqQ1: "What makes a ceramic kamado barbecue superior to a standard grill?",
      faqA1: "A ceramic kamado is a charcoal barbecue with a thick ceramic body that retains heat. It can be used for direct grilling, indirect cooking, smoking and pizza baking. Temperature and burn time depend on airflow, fuel, food load and conditions.",
      faqQ2: "Which kamado size (18, 21, 23 or 27 inch) is best suited for me?",
      faqA2: "Choose by cooking-grid diameter, cooking style and available outdoor space. The 18 inch comes as Basic or Premium; the 21, 23 and 27 inch use the Premium specification. See the comparison table for grid diameters and approximate group sizes, which also depend on the food.",
      faqQ3: "What is included out-of-the-box in the SmokeyKamado All-Inclusive package?",
      faqA3: "<p>Premium specification:</p><ul><li>Solid black HDPE side tables: Folding solid black HDPE side tables with tool hooks.</li><li>Complete Divide & Conquer: Rack, 2 ceramic half-moon deflectors and 2 stainless-steel half-moon cooking grids.</li><li>2 cast-iron half-moon grids: Requested Premium specification: 1 complete set of 2 grids. Inclusion still to be confirmed.</li><li>Stainless-steel ash drawer: Slide-out stainless-steel ash drawer.</li><li>Stainless-steel wood-chip feeder: Complete tubular stainless-steel wood-chip feeder.</li><li>Waterproof Oxford cover: Correct-size Oxford fabric cover with waterproof PU coating.</li><li>Premium black cart: Heavy-duty black cart with solid bottom shelf and 4 heavy-duty wheels, 2 with brakes.</li><li>Black bands, stainless hardware: Heavy-duty black metal bands. Stainless-steel screws, bolts, nuts, washers and hardware for complete assembly.</li><li>Strong Hinge / Air Hinge & lid lock: 18″ Premium: Strong Hinge. 21″/23″/27″: adjustable Air Hinge. Includes lid lock and black front handle.</li><li>Stainless-steel bottom vent: Stainless-steel lower airflow control.</li><li>Black top vent: Premium black double-handle top vent.</li><li>Black thermometer: Built-in black thermometer.</li><li>Fiberglass gasket: Fiberglass gasket around the lid seal.</li><li>Complete ceramic firebox: Heavy-duty multi-piece ceramic firebox, complete fire ring and heavy-duty charcoal plate / fire grate.</li><li>Matte Bubble Glaze: Matte Bubble Glaze ceramic body and lid in the specified Pantone colours.</li></ul>",
      faqQ4: "How does delivery and pallet shipping work in the Netherlands?",
      faqA4: "Planned mainland Netherlands delivery: 18″/21″/23″ €99, 27″ €129 incl. VAT per kamado. Accessories only: €7.95 per order. Kerbside delivery to an accessible, paved location. Islands and special access require a quote. This is an interest survey; costs and delivery dates are confirmed before any purchase. <a href=\"/support/shipping?lang=en\">Read delivery information</a>.",
      faqQ5: "Can the ceramic kamado stay outdoors all year round in winter?",
      faqA5: "Protect the cooled kamado with a correctly sized cover. Keep vents and components clean and dry, and follow the maintenance instructions. Ceramics and metal parts can be damaged by improper use or care.",

      cartTriggerText: "Cart",
      heroTitle: "Ceramic Mastery.<br><span class=\"highlight\">All-Inclusive</span> Delivered.",
      heroSubtitle: "No hidden costs, no separate accessories to purchase. SmokeyKamado delivers the most complete ceramic BBQ in the Netherlands, crafted from heavy-duty Mullite ceramic with patented Air Hinge counter-balance.",
      
      // Modellen Section
      modelsSectionTag: "Sizes & Editions",
      modelsSectionTitle: "Make it yours.",
      modelsSectionDesc: "View the edition and available colours.",
      tabTitle_18_basic: "18″ Basic",
      tabTitle_18_premium: "18″ Premium",
      tabTitle_21: "21″ Versatile",
      tabTitle_23: "23″ Premium",
      tabTitle_27: "27″ HoReCa Giant",
      tabPopularTag: "Most Popular",
      specLabelGrate: "Cooking Grate",
      specLabelBody: "Outer Diameter",
      specLabelPeople: "Capacity",
      specLabelWeight: "Weight",
      colorPickerLabel: "Choose Color:",
      modelVatTag: "Incl. 21% VAT • delivery extra, from €99",
      addKamadoBtnText: "Add to Shopping Cart",
      
      // All-Inclusive Section
      incSectionTag: "Unmatched Value",
      incSectionTitle: "Premium. Down to the last detail.",
      incSectionDesc: "Premium specification: black metal and functional stainless-steel components. Cast-iron grids: inclusion still to be confirmed.",
      incCardTitle1: "Solid black HDPE side tables",
      incCardDesc1: "Folding solid black HDPE side tables with tool hooks.",
      incCardTitle2: "Complete Divide & Conquer",
      incCardDesc2: "Rack, 2 ceramic half-moon deflectors and 2 stainless-steel half-moon cooking grids.",
      incCardTitle3: "2 cast-iron half-moon grids",
      incCardDesc3: "Requested Premium specification: 1 complete set of 2 grids. Inclusion still to be confirmed.",
      incCardTitle4: "Stainless-steel ash drawer",
      incCardDesc4: "Slide-out stainless-steel ash drawer.",
      incCardTitle5: "Stainless-steel wood-chip feeder",
      incCardDesc5: "Complete tubular stainless-steel wood-chip feeder.",
      incCardTitle6: "Waterproof Oxford cover",
      incCardDesc6: "Correct-size Oxford fabric cover with waterproof PU coating.",
      incCardTitle7: "Premium black cart",
      incCardDesc7: "Heavy-duty black cart with solid bottom shelf and 4 heavy-duty wheels, 2 with brakes.",
      incCardTitle8: "Black bands, stainless hardware",
      incCardDesc8: "Heavy-duty black metal bands. Stainless-steel screws, bolts, nuts, washers and hardware for complete assembly.",

      // Accessories Section
      accSectionTag: "Custom Accessories",
      accSectionTitle: "Optional Tailored Accessories",
      accSectionDescTemplate: "Prices and dimensions of the accessories below automatically match your selected <strong id=\"accSelectedSizeLabel\">{size}″ Kamado</strong>.",
      addAccBtn: "+ Add to Cart",
      addedAccBtn: "✓ Added",

      // Waarom Section
      whySectionTag: "Superior Build Quality",
      whySectionTitle: "Engineered for True BBQ Enthusiasts",
      whySectionDesc: "SmokeyKamado was born from a clear principle: build an uncompromising ceramic grill using the finest materials, without the inflated markups of traditional brands.",
      whyFeatTitle1: "Specialized Mullite Ceramic",
      whyFeatDesc1: "The ceramic body retains heat. Follow the operating instructions and avoid sudden temperature changes.",
      whyFeatTitle2: "Heat retention for low & slow",
      whyFeatDesc2: "Control temperature with the top and bottom vents. Use heat deflectors for indirect cooking.",
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
      cartRowDeliveryLabel: "Delivery (estimate):",
      cartFreeLabel: "—",
      cartRowTotalLabel: "Total (incl. VAT):",
      emptyCartMsg: "Your shopping cart is currently empty.",
      goToCheckoutBtn: "Register your interest",

      // Checkout Modal
      chkModalTitle: "Your interest & details",
      chkStep1Title: "1. Contact Details",
      chkLabelEmail: "Email Address *",
      chkLabelPhone: "Phone Number *",
      chkStep2Title: "2. Delivery Address in the Netherlands",
      chkLabelName: "Full Name *",
      chkLabelStreet: "Street and house number",
      chkLabelZip: "Postal Code *",
      chkLabelCity: "City *",
      chkStep3Title: "3. Preferred payment method at launch",
      chkIdealSub: "Fast and secure via Dutch bank transfer (Rabobank, ING, ABN AMRO, etc.)",
      chkKlarnaSub: "Pay later within 30 days",
      chkSumModelLabel: "Selected model:",
      chkSumKamadoLabel: "Kamado price:",
      chkSumAccLabel: "Accessories:",
      chkSumShipLabel: "Delivery (estimate):",
      chkSumFreeLabel: "—",
      chkSumTotalLabel: "Total amount:",
      submitIntentBtn: "Send non-binding interest",
      chkSslNotice: "No payment or order. Prices and delivery costs are estimates.",

      // Notice Modal
      noticeTitle: "Thank you for your interest in SmokeyKamado!",
      noticeBody1: "The SmokeyKamado you selected is currently not yet available in the Netherlands. We are preparing our launch in the Netherlands.",
      noticeBody2: "Your order has not been placed and nothing has been charged.",
      noticePrompt: "Would you like to be the first to know as soon as your chosen Kamado becomes available?",
      vipNotifyBtn: "Yes, keep me updated",
      closeNoticeBtn: "Close",
      vipAckMsg: "✓ Thank you! We have noted your email address (<strong>{email}</strong>). As soon as your chosen Kamado is available, you will be the first to know!",

      // Footer
      footerDesc: "Ceramic kamados and accessories. Explore the range and register your interest without obligation.",

      incCardTitle9: "Strong Hinge / Air Hinge & lid lock",

      incCardDesc9: "18″ Premium: Strong Hinge. 21″/23″/27″: adjustable Air Hinge. Includes lid lock and black front handle.",

      incCardTitle10: "Stainless-steel bottom vent",

      incCardDesc10: "Stainless-steel lower airflow control.",

      incCardTitle11: "Black top vent",

      incCardDesc11: "Premium black double-handle top vent.",

      incCardTitle12: "Black thermometer",

      incCardDesc12: "Built-in black thermometer.",

      incCardTitle13: "Fiberglass gasket",

      incCardDesc13: "Fiberglass gasket around the lid seal.",

      incCardTitle14: "Complete ceramic firebox",

      incCardDesc14: "Heavy-duty multi-piece ceramic firebox, complete fire ring and heavy-duty charcoal plate / fire grate.",

      incCardTitle15: "Matte Bubble Glaze",

      incCardDesc15: "Matte Bubble Glaze ceramic body and lid in the specified Pantone colours.",
      footerCopyright: "© 2026 SmokeyKamado Netherlands. All rights reserved.",
      footerColQuick: "Quick Links",
      footerLinkModellen: "Kamado Models",
      footerLinkAllInc: "Included Gear",
      footerLinkAcc: "Tailored Accessories",
      footerLinkWaarom: "Our Philosophy",
      footerColSupport: "Customer Support",
      footerSupportShip: "Shipping: rates and delivery",
      footerSupportWarranty: "Warranty: rights and support",
      footerSupportReturns: "Returns: 30-day withdrawal period",
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

  // Preserve the acquisition source while navigating between product pages.
  const internalNavigation = document.referrer && new URL(document.referrer).origin === location.origin;
  const previousSource = sessionStorage.getItem('smokey_source');
  const trafficSource = !getUrlParams().utm_source && internalNavigation && previousSource ? previousSource : detectSource();
  sessionStorage.setItem('smokey_source', trafficSource);
  const landingPage = internalNavigation && sessionStorage.getItem('smokey_landing')
    ? sessionStorage.getItem('smokey_landing') : location.pathname + location.search;
  sessionStorage.setItem('smokey_landing', landingPage);

  // --- STATE ---
  let currentLang = new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "nl";
  const routeParts = window.location.pathname.replace(/\/$/, "").split("/");
  const detailModelKey = routeParts[1] === "kamados" ? routeParts[2].replace("-", "_") : null;
  const detailAccessory = routeParts[1] === "accessories" ? ACCESSORIES.find(a => a.id === routeParts[2]) : null;
  let activeModelKey = KAMADO_MODELS[detailModelKey] ? detailModelKey : "23";
  let initialColor = "Not selected";
  let inventory = null;
  let currentColor = { id: null, name: "Not selected", displayName: { nl: "Kleur niet gekozen", en: "Colour not selected" } };
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
            landingPage,
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
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) + shippingAmount(cart);
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
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(amount || 0));
  }

  function navigateLanguage(lang) {
    const url = new URL(location.href);
    if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    location.assign(url.href);
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
    for (let i = 1; i <= 15; i++) {
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
    document.querySelectorAll("a[href^='/support/']").forEach(a => { a.href = a.pathname + "?lang=" + currentLang; });
    setElemText("deliveryEstimateNotice", currentLang === "en" ? "Interest registration only — no purchase or payment. Mainland delivery estimate; islands and special access require a quote. For future purchases: 30-day withdrawal, return freight at your expense (pallet estimate €99–€179)." : "Alleen interesse — geen bestelling of betaling. Bezorgindicatie vasteland; eilanden en bijzondere adressen op offerte. Bij toekomstige aankopen: 30 dagen bedenktijd, retourvracht voor eigen rekening (palletindicatie €99–€179).");
    setElemText("footerColSecurity", t.footerColSecurity);
    setElemText("footerSslNote", t.footerSslNote);

    
    // FAQ Section
    setElemText("navFaq", t.navFaq);
    setElemText("footerLinkFaq", t.footerLinkFaq);
    setElemText("faqSectionTag", t.faqSectionTag);
    setElemText("faqSectionTitle", t.faqSectionTitle);
    setElemText("faqSectionDesc", t.faqSectionDesc);
    setElemText("faqQ1", t.faqQ1);
    setElemHtml("faqA1", t.faqA1);
    setElemText("faqQ2", t.faqQ2);
    setElemHtml("faqA2", t.faqA2);
    setElemText("faqQ3", t.faqQ3);
    setElemHtml("faqA3", t.faqA3);
    setElemText("faqQ4", t.faqQ4);
    setElemHtml("faqA4", t.faqA4);
    setElemText("faqQ5", t.faqQ5);
    setElemHtml("faqA5", t.faqA5);

    document.querySelectorAll('[data-nl][data-en]').forEach(el => {
      el.textContent = el.dataset[currentLang];
    });
    updateModelConfigurator();
    renderCart();
    renderAccessoryDetail();
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const target = new URL(link.href);
      if (target.pathname === '/' || target.pathname.startsWith('/kamados/') || target.pathname.startsWith('/accessories/')) {
        if (currentLang === 'en') target.searchParams.set('lang', 'en'); else target.searchParams.delete('lang');
        link.href = target.pathname + target.search + target.hash;
      }
    });
    if (!detailModelKey && !detailAccessory && publishedMedia['/']?.videos?.length) renderMediaGallery('homeVideoImage', 'homeVideoThumbs', [], '/', 'SmokeyKamado');
    if (detailModelKey) {
      document.getElementById('modelsSectionTitle').textContent = KAMADO_MODELS[activeModelKey].name[currentLang];
      // Document title is supplied by the server for this URL.
    }
  }

  function renderAccessoryDetail() {
    if (!detailAccessory) return;
    const acc = detailAccessory;
    const size = document.getElementById('detailAccessorySize').value;
    const en = currentLang === 'en';
    document.getElementById('detailAccessoryName').textContent = acc.name[currentLang];
    // Document title is supplied by the server for this URL.
    document.getElementById('detailAccessoryDesc').textContent = acc.desc[currentLang];
    document.getElementById('detailAccessoryImage').src = acc.image;
    document.getElementById('detailAccessoryImage').alt = acc.name[currentLang];
    renderMediaGallery('detailAccessoryImage', 'detailAccessoryThumbs', acc.thumbs || [acc.image], '/accessories/' + acc.id, acc.name[currentLang]);
    document.getElementById('detailSizeField').hidden = !acc.isSizeDependent;
    document.getElementById('detailAccessoryFit').textContent = acc.isSizeDependent
      ? (en ? 'Selected size: ' : 'Gekozen maat: ') + size + '″'
      : (en ? 'Universal accessory — no size selection needed.' : 'Universeel accessoire — geen maatkeuze nodig.');
    document.getElementById('detailAccessoryPrice').textContent = formatEur(acc.isSizeDependent ? acc.sizePrices[size] : acc.price);
    document.getElementById('detailAccessoryIncluded').textContent = acc.id === 'cover'
      ? (en ? 'Already included in the Premium kamado package. Order here as an extra or replacement.' : 'Al inbegrepen in het Premium kamadopakket. Bestel hier een extra of vervangend exemplaar.') : '';
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
    document.getElementById('modelPriceLabel').textContent = currentLang === 'en' ? 'Introductory price' : 'Introductieprijs';
    document.getElementById('modelRrp').textContent = (currentLang === 'en' ? 'RRP: ' : 'Adviesprijs: ') + formatEur(model.rrp);
    document.getElementById('modelRrpNote').textContent = currentLang === 'en' ? 'RRP is the recommended list price set by SmokeyKamado, not a previous selling price.' : 'Adviesprijs is de door SmokeyKamado vastgestelde aanbevolen lijstprijs, geen eerdere verkoopprijs.';
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
    if (activeImg) { activeImg.src = model.image; activeImg.alt = mName; }
    const elBadge = document.getElementById("activeModelBadge");
    if (elBadge) elBadge.textContent = mBadge;

    renderMediaGallery('activeModelImg', 'galleryThumbs', model.thumbs, '/kamados/' + activeModelKey.replace('_', '-'), mName);

    const accDescEl = document.getElementById("accSectionDesc");
    if (accDescEl && TRANSLATIONS[currentLang]) {
      accDescEl.innerHTML = TRANSLATIONS[currentLang].accSectionDescTemplate.replace("{size}", model.sizeInch);
    }

    const colorDisp = currentColor.displayName[currentLang] || currentColor.displayName.nl;
    const colorLabel = document.getElementById("selectedColorName");
    if (colorLabel) colorLabel.textContent = colorDisp;

    document.querySelectorAll('.size-tab').forEach(tab => {
      const selected = tab.dataset.modelKey === activeModelKey;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    renderAccessories();
    renderInventory();
  }

  function quantityFor(key) {
    return Object.values(inventory?.stock[key] || {}).reduce((sum, qty) => sum + qty, 0);
  }

  function renderInventory() {
    const en = currentLang === 'en';
    const list = document.getElementById('availableColors');
    list.replaceChildren();
    const qty = quantityFor(activeModelKey);
    if (inventory) {
      for (const [color, quantity] of Object.entries(inventory.stock[activeModelKey] || {})) {
        if (quantity <= 0) continue;
        const meta = inventory.colors[color];
        const item = document.createElement('li');
        const swatch = document.createElement('span');
        swatch.className = 'availability-swatch'; swatch.style.backgroundColor = meta.hex;
        item.append(swatch, document.createTextNode(meta[currentLang] + ' · Pantone ' + meta.pantone));
        list.appendChild(item);
      }
    }
    document.getElementById('stockMessage').textContent = !inventory
      ? (en ? 'Checking availability…' : 'Beschikbaarheid controleren…')
      : qty > 0 ? '' : (en ? 'This model is currently unavailable.' : 'Dit model is momenteel niet beschikbaar.');
    document.getElementById('addModelToCartBtn').disabled = !inventory || qty <= 0;
    document.getElementById('directCheckoutBtn').disabled = !inventory || qty <= 0;
    const is18 = activeModelKey.startsWith('18_');
    document.getElementById('editionSwitch').hidden = !is18;
    document.getElementById('basicNotice').hidden = activeModelKey !== '18_basic';
    document.body.classList.toggle('edition-basic', activeModelKey === '18_basic');
    document.querySelectorAll('[data-edition]').forEach(link => {
      link.hidden = Boolean(inventory) && quantityFor(link.dataset.edition) <= 0;
      if (link.dataset.edition === activeModelKey) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('.product-card').forEach(card => {
      const key = card.dataset.modelKey;
      const isSmall = key === '18_premium';
      card.hidden = Boolean(inventory) && (isSmall ? quantityFor('18_basic') + quantityFor('18_premium') : quantityFor(key)) <= 0;
      if (isSmall) {
        card.querySelector(".product-edition").firstChild.textContent = "BASIC / PREMIUM ";
        card.href = (inventory && quantityFor('18_premium') <= 0 ? '/kamados/18-basic' : '/kamados/18-premium') + (en ? '?lang=en' : '');
        card.querySelector('.product-included').textContent = inventory && quantityFor('18_basic') <= 0 ? 'Premium' : inventory && quantityFor('18_premium') <= 0 ? 'Basic' : 'Basic / Premium';
        card.querySelector('.product-bottom strong').textContent = (en ? 'From ' : 'Vanaf ') + (inventory && quantityFor('18_basic') <= 0 ? '€799' : '€549');
        card.querySelector('.product-audience').textContent = en ? '2–4 people · Choose your edition' : '2–4 personen · Kies je uitvoering';
      }
      const displayed = KAMADO_MODELS[isSmall ? (inventory && quantityFor('18_basic') <= 0 ? '18_premium' : '18_basic') : key];
      card.querySelector('.card-price-label').textContent = en ? 'Introductory price' : 'Introductieprijs';
      card.querySelector('.card-rrp').textContent = (en ? 'RRP: ' : 'Adviesprijs: ') + formatEur(displayed.rrp);

    });
  }

  async function refreshInventory() {
    try {
      const response = await fetch('/api/inventory', { cache: 'no-store' });
      if (!response.ok) throw new Error('Inventory unavailable');
      inventory = await response.json();
      if (!inventory.stock || !inventory.colors) throw new Error('Invalid inventory');
      renderInventory();
    } catch {
      inventory = null; renderInventory();
      document.getElementById('stockMessage').textContent = currentLang === 'en'
        ? 'Availability could not be loaded. Please reload the page.' : 'Beschikbaarheid kon niet worden geladen. Vernieuw de pagina.';
    }
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

      const card = document.createElement("a");
      card.className = "acc-card";
      card.href = "/accessories/" + acc.id + (acc.isSizeDependent ? "?size=" + currentSize : "") + (currentLang === "en" ? (acc.isSizeDependent ? "&" : "?") + "lang=en" : "");
      card.innerHTML = `
        <div class="acc-img-wrap"><img src="${acc.image}" alt="${accName}" class="acc-img" loading="lazy" decoding="async" width="400" height="400">${sizeBadge}</div>
        <div class="acc-body"><h4 class="acc-title">${accName}</h4><p class="acc-desc">${accDesc}</p>
          <div class="acc-footer"><div class="acc-price">${formatEur(price)}</div>
          <span class="btn btn-secondary">${currentLang === 'en' ? 'View details ↗' : 'Bekijk details ↗'}</span></div>
        </div>`;

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
      if (!Array.isArray(cart)) cart = [];
      cart.forEach(item => {
        const product = item.type === 'kamado' ? KAMADO_MODELS[item.modelKey || String(item.id || '').replace(/^kamado_/, '')] : ACCESSORIES.find(a => a.id === item.accessoryId);
        if (product) { item.image = product.image; if (item.type === "kamado") item.price = product.price; }
        if (item.type === 'kamado') { item.colorId = null; item.colorName = 'Not selected'; item.colorDisplayName = currentLang === 'en' ? 'Colour not selected' : 'Kleur niet gekozen'; }
        if (typeof item.name === "string") item.name = item.name.replace(/CraftKamado|KundiKamado/g, "SmokeyKamado");
        if (typeof item.colorDisplayName === "string") item.colorDisplayName = item.colorDisplayName.replace("Craft ", "Smokey ");
      });
    } catch (e) {
      cart = [];
    }
  }

  function addModelToCart() {
    const model = KAMADO_MODELS[activeModelKey];
    if (!model || !inventory || quantityFor(activeModelKey) <= 0) return;

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
      document.getElementById("cartFreeLabel").textContent = "—";
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

    const total = kamadoSubtotal + accSubtotal + shippingAmount(cart);
    document.getElementById("cartFreeLabel").textContent = formatEur(shippingAmount(cart));
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
    const total = kamadoSub + accSub + shippingAmount(cart);
    document.getElementById("chkSumFreeLabel").textContent = formatEur(shippingAmount(cart));

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
    if (submitBtn.disabled) return;
    if (!cart.length) {
      errorEl.textContent = currentLang === "en" ? "Your cart is empty." : "Je winkelwagen is leeg.";
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === "en" ? "Processing..." : "Verwerken...";

    const kamadoItem = cart.find(i => i.type === "kamado") || {};
    const kamadoSub = cart.filter(i => i.type === "kamado").reduce((s, i) => s + (i.price * i.qty), 0);
    const accSub = cart.filter(i => i.type === "accessory").reduce((s, i) => s + (i.price * i.qty), 0);
    const totalAmount = kamadoSub + accSub + shippingAmount(cart);

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
      landingPage,
      initialColor: "Not selected",
      finalColor: kamadoItem.colorName || currentColor.name,
      modelName: kamadoItem.name || `${activeModelKey}″ SmokeyKamado`,
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
        confirmationMsg.textContent = t.vipAckMsg.replace(/<\/?strong>/g, "").replace("{email}", customerEmail);
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
        confirmationMsg.textContent = t.vipAckMsg.replace(/<\/?strong>/g, "").replace("{email}", mail);
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
    document.getElementById("btnLangNl")?.addEventListener("click", () => navigateLanguage("nl"));
    document.getElementById("btnLangEn")?.addEventListener("click", () => navigateLanguage("en"));

    // 2. Initial Telemetry
    trackEvent("page_view", {
      path: window.location.pathname,
      url: window.location.href,
      lang: currentLang
    });

    // Product cards navigate to their own detail pages.
    if (detailAccessory) {
      const sizeInput = document.getElementById('detailAccessorySize');
      const requestedSize = new URLSearchParams(location.search).get('size');
      sizeInput.value = ['18','21','23','27'].includes(requestedSize) ? requestedSize : '23';
      sizeInput.addEventListener('change', () => {
        const url = new URL(location.href);
        url.searchParams.set('size', sizeInput.value);
        history.replaceState(null, '', url);
        renderAccessoryDetail();
      });
      document.getElementById('detailAccessoryAdd').addEventListener('click', () => {
        const size = sizeInput.value;
        const acc = detailAccessory;
        addAccessoryToCart(acc, acc.isSizeDependent ? acc.sizePrices[size] : acc.price, acc.isSizeDependent ? size : null);
        openCart();
      });
    }
    const rail = document.getElementById("sizeTabs");
    document.querySelectorAll('[data-slide]').forEach(button => {
      button.addEventListener('click', () => rail.scrollBy({
        left: Number(button.dataset.slide) * (rail.querySelector('.size-tab').offsetWidth + 20),
        behavior: 'smooth'
      }));
    });

    // 5. Cart Drawer Triggers
    document.getElementById("cartBtn")?.addEventListener("click", openCart);
    document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
    document.getElementById("cartBackdrop")?.addEventListener("click", closeCart);

    // 6. Add to cart actions
    document.getElementById("addModelToCartBtn")?.addEventListener("click", addModelToCart);
    document.getElementById("directCheckoutBtn")?.addEventListener("click", () => {
      if (!inventory || quantityFor(activeModelKey) <= 0) return;
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
    refreshInventory();
    loadPublishedMedia();
    window.addEventListener('pageshow', refreshInventory);
    setInterval(() => { if (!document.hidden) refreshInventory(); }, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshInventory(); });
  });
})();
