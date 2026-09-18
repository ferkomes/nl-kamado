# SmokeyKamado Nederland - Marktvalidatie Webshop (Cloudflare Worker)

Geïsoleerde Nederlandse vraagvalidatie-applicatie (~1 maand markt-test) voor **SmokeyKamado** in Nederland.

- **GitHub Repository**: [https://github.com/ferkomes/nl-kamado](https://github.com/ferkomes/nl-kamado)
- **Taal**: 100% Nederlands (`nl`)
- **Valuta**: Euro (`€`, EUR)
- **Platform**: Cloudflare Workers, Cloudflare D1 Database (`nl_kamado_db`), Cloudflare R2 (`nl-kamado-assets`).

---

## 🎯 Doel van het Markt-Test Project

1. **Reële Marktvalidatie**: Klanten kunnen een realistisch model, formaat (18″, 21″, 23″, 27″), kleur en formaat-afhankelijke accessoires configureren en in hun winkelwagen plaatsen.
2. **Realistisch Afrekenproces**: Volledige Nederlandse adresvelden (straatnaam, huisnummer, postcode `1234 AB`, woonplaats) en vertrouwde betaalopties (iDEAL, Creditcard, Klarna).
3. **Geen Echte Betalingen**: Geen Stripe, iDEAL-transactie of facturatie.
4. **Aankoopintentie Registratie (`PURCHASE_INTENT`)**: Bij de definitieve klik op **„Doorgaan naar betaling”** wordt de aankoopintentie vastgelegd in Cloudflare D1 en ontvangt de klant een transparante en vriendelijke melding dat SmokeyKamado de Nederlandse marktintroductie voorbereidt, niets in rekening is gebracht en de klant als dank 10% VIP introductiekorting reserveert.
5. **E-mailnotificaties**: Voor elke nieuwe aankoopintentie wordt direct een e-mail verstuurd naar de beheerder (`ferkomes@gmail.com`) met alle klant- en besteldetails.
6. **Analytisch Dashboard (`/admin/market-test`)**: Realtime inzicht in trechterconversie, populariteit van modellen, kleuren, accessoires, topcombinaties, hypothetische omzet en verlaten winkelwagens.

---

## 💶 Prijsstructuur (EUR)

### Kamado Modellen (All-Inclusive)
- **18″ Compact**: €699,- *(adviesprijs €898,-)*
- **21″ Veelzijdig**: €889,- *(adviesprijs €1.108,-)*
- **23″ Bestseller**: €1.019,- *(adviesprijs €1.178,-)*
- **27″ HoReCa Reus**: €1.319,- *(adviesprijs €1.410,-)*

*Alle modellen worden All-Inclusive geleverd met zwaar onderstel met wielen, inklapbare zwarte HDPE zijtafels, Strong Hinge (18″ Premium) of Air Hinge (21″/23″/27″), Divide & Conquer systeem, gietijzeren rooster, aslade, beschermhoes en rookhout-inlaat.*

### Formaat-afhankelijke Accessoires Matrix
| Accessoire | 18″ | 21″ | 23″ | 27″ |
|---|---|---|---|---|
| **All-Weather Beschermhoes** | €39,- | €45,- | €49,- | €59,- |
| **Draaispit / Rotisserie met motor** | €139,- | €159,- | €159,- | €189,- |
| **Gietijzeren Halve Maan Rooster / Plancha** | €49,- | €59,- | €69,- | €79,- |
| **Cordieriet Pizzasteen (Extra Dik)** | €49,- | €59,- | €69,- | €79,- |

### Universele Accessoires
- Elektrische Houtskoolaansteker (2000W, CE): **€59,-**
- Hittebestendige Siliconen BBQ Handschoenen (350°C): **€32,-**
- Pulled Pork Vleesklauwen Set: **€16,-**
- RVS Roostertang & Lifter: **€14,-**
- RVS Aslade & Schraper Kit: **€22,-**

---

## 📊 Beheerdersdashboard: `/admin/market-test`

Beveiligd met de Worker-secret `ADMIN_PASSWORD`. Er zijn geen standaardwachtwoorden.

- **KPI Overzicht**:
  - Unieke bezoekers
  - Aantal winkelwagens & conversie %
  - Aantal checkouts & conversie %
  - Aankoopintenties & overall conversie %
  - Hypothetische totale omzet & gemiddelde bestelwaarde (AOV)
  - Totale kamado-eenheden gevraagd
  - Verlaten winkelwagens & potentieel verloren omzet
- **Trechter Conversie (Funnel Visualizer)**:
  `Bezoeker ➔ In Winkelwagen ➔ Naar Kassa ➔ Aankoopintentie` (inclusief drop-off per stap).
- **Populariteitsanalyses**:
  - Formaten (18″ vs 21″ vs 23″ vs 27″)
  - Kleuren (Onyx Zwart, Robijn Rood, Bosgroen, Parel Crème, Marine Blauw) en afwerking (Bubble Glaze vs Hoogglans)
  - Accessoires Attachment Rate (welke accessoires worden het vaakst meegekozen)
  - Populairste combinatiematrix
- **Tijdlijn**: Dagelijkse en wekelijkse statistieken.
- **Leads & Verlaten Carts**: Realtime overzicht van alle binnengekomen intenties en verlaten winkelwagens.
- **CSV Export**: Met één klik downloaden van alle intenties (`/api/market-test/export-intents.csv`).

---

## 🛠️ Lokale Ontwikkeling & Uitrol

### Installatie
```bash
cd nl-kamado
npm install
```

### Tests Uitvoeren
```bash
npm test
```

### Lokaal Draaien met Wrangler
```bash
npm run dev
```

### Uitrollen naar Cloudflare
1. Maak de D1 database aan in Cloudflare (eenmalig):
   ```bash
   npx wrangler d1 create nl_kamado_db
   ```
   *Kopieer het gegenereerde `database_id` naar `wrangler.toml`.*

2. Voer het databaseschema uit:
   ```bash
   npx wrangler d1 execute nl_kamado_db --file=schema.sql
   ```

3. Maak de R2 bucket aan (eenmalig):
   ```bash
   npx wrangler r2 bucket create nl-kamado-assets
   ```

4. Deploy de Worker:
   ```bash
   npm run deploy
   ```


## Értesítések és élesítés (javítás után)

A `worker.js` generált fájl: a források módosítása után `npm run build` szükséges.
A mostani folyamat vásárlási szándékot rögzít; nem indít fizetést vagy előrendelést.
A látogatók és konverziók böngészőazonosítók alapján számolódnak, nem ellenőrzött személyek alapján.
Az azonos böngészőből, azonos e-maillel és kosárral ismételt beküldés egy érdeklődésnek számít.

A meglévő közös `mail-sender` és az ott már beállított Mailjet-fiók/feladócím
marad használatban. **Nem kell új Mailjet-kulcs vagy új feladó a holland Workerhez.**
A holland oldal a `/nl-kamado/intent` végpontot hívja, amelynek egyetlen címzettje
**ferkomes@gmail.com**. A vásárló címe válaszcímként szerepel, nem címzettként.
Az általános traktoros végpontra nincs visszaesés, mert az más címzetteket is használ.

A közös küldő helyi forrásában (`../kundikamado/integrations/mail-sender.js`)
a holland végpont már szerepel. Éles használathoz ennek a verziónak kell futnia
a `mail-sender` szolgáltatásban is; a helyi tesztek nem igazolják az éles verziót.

A holland oldalon `npm test`, majd `npm run deploy` készíti el és tölti fel a Workert.
Az adminhoz a `ADMIN_PASSWORD` Worker-secret szükséges; a korábbi, Gitbe került
jelszó helyett új jelszót használj (`npx wrangler secret put ADMIN_PASSWORD`).

Küldési hibánál az érdeklődés megmarad, a hiba a `notification_error` mezőbe kerül
és az adminfelületen látható. Nincs automatikus újraküldés. A tesztek nem küldenek
valódi levelet.


## SmokeyKamado arculat

A nyilvános domain: **https://smokeykamado.nl**. A holland és angol felület,
a keresőadatok, az admin és az értesítések SmokeyKamado néven jelennek meg.
A kapcsolati cím továbbra is ferkomes@gmail.com.
Az új SVG-emblémát a Worker közvetlenül szolgálja ki, nem kell külön R2-be feltölteni.
A Worker, D1 és R2 technikai neve változatlan; a meglévő adatok megmaradnak.
A közös levélküldő holland sablonjának márkázása a szomszédos
`../kundikamado/integrations/mail-sender.js` fájlban frissült, ezért az e-mail
feladónevének és fejlécének éles váltásához azt a Workert is telepíteni kell.


### Átmeneti tesztcím a DNS-frissülésig

Jelenleg: https://nl-kamado.ferkomes.workers.dev (SmokeyKamado márkával).
A `wrangler.toml` `SITE_URL` értéke ezt a működő címet használja a keresőadatokban,
a sitemapben és az értesítések adminlinkjében. Nincs átirányítás az új domainre.
Amikor az új domain már a Workerhez van kapcsolva és HTTPS-en elérhető,
állítsd a `SITE_URL` értékét `https://smokeykamado.nl`-re, majd telepítsd újra.


### Premium collectie — vernieuwde winkelpagina

Bovenaan staan vier Premium modellen (18, 21, 23 en 27 inch). De 18-inch kaart
is de Premium van €699; Basic maakt geen deel uit van deze collectie.
Op kleinere schermen is de rij met aanraken of pijlen horizontaal te verschuiven.
Een kaart opent de eigen productpagina met kleurkeuze en winkelwagenknop.
De vijftien meegeleverde onderdelen staan in het Nederlands en Engels op de pagina.
De huidige productfoto’s zijn voorlopig; vervang ze door foto’s van de definitieve
HDPE/RVS Premium uitvoering zodra beschikbaar.


### Saját termékoldalak

Kamado oldalak: `/kamados/18-premium`, `/kamados/21`, `/kamados/23`, `/kamados/27`.
A hat kiegészítő saját `/accessories/<termékazonosító>` oldalt kapott.
A méretfüggő tartozékoknál 18/21/23/27 választható; az ár a választáshoz igazodik,
és a `?size=` paraméter megőrzi a méretet újratöltéskor. A kosár közös az oldalak között.
A részletoldalak közvetlenül megnyithatók, saját címmel, canonical URL-lel és termékadatokkal.
A termékadatok és útvonalak az `app.js` katalógusából épülnek a build során.


### Auplex termékfotók

A négy kamado és a hat kiegészítő eredeti gyártói fotói az `assets/auplex/` mappában
vannak. Az egyes képek pontos forrásoldala és kép-URL-je a `sources.json` fájlban szerepel.
Forrás: https://www.auplexbbq.com/orange-peel-pattern/ és az Auplex tartozékoldalai.
A 23″ SmokeyKamado az Auplex 23,5″ termékfotóit használja; a fotókon látható szín
illusztráció, nem a színválasztó előnézete. A fotók a saját R2-tárból töltődnek be.


### Készlet és 18″ változatok

Az `inventory.json` az induló színbontás (139 db) és a Pantone-referenciák forrása.
A HEX értékek csak közelítő képernyőszínek, nem hivatalos Pantone-konverziók.
Az első kérés a D1 `product_inventory` táblájába importálja a készletet; a későbbi
build/deploy nem írja felül az adminban módosított darabszámokat.

Admin → **Inventory — sizes, editions & colours**: írd át a darabszámot, majd Save.
Nullánál a szín eltűnik. Ha minden szín nulla, az adott változat nem küldhető be,
és a teljesen elfogyott méret kártyája is eltűnik. A nyitott oldalak percenként,
visszatéréskor és újratöltéskor frissítik az elérhetőséget. Párhuzamos szerkesztésnél
az admin ütközést jelez, nem írja felül csendben a másik módosítást.

A színek nem kattinthatók; az érdeklődéshez **Not selected** kerül színként.
Az érdeklődés beküldése nem valódi eladás és nem von le készletet. A darabszámot
az adminban kell frissíteni tényleges fogyáskor; külső raktárszinkron jelenleg nincs.
18″-nál Basic (€599) és Premium (€699) között lehet váltani, külön megosztható URL-lel.
A Basic nem kap Premium felszereltségi ígéretet. Az eurós eladási árak változatlanok.

A gyártói képek referenciafotók: a tényleges Premium RVS aslade/wood-chip feeder
nem látszik minden fotón. A specifikáció fekete pántokat és RVS kötőelemeket ír elő.
A két gietijzer félrács csomagba tartozása a megadott specifikáció szerint még
visszaigazolásra vár; ezt a termékleírás is jelzi.

## Ügyfélszolgálat és tervezett szállítás

Nyilvános kapcsolattartás: **info@smokeykamado.nl**. A tulajdonosi értesítések továbbra is kizárólag **ferkomes@gmail.com** címre mennek a meglévő Mailjet / mail-sender integráción keresztül.

Külön, holland és angol tájékoztatók:
- `/support/shipping` — szállítás; angol: `?lang=en`
- `/support/warranty` — törvényes garancia és ügyintézés
- `/support/returns` — tervezett 30 napos elállás, visszaküldési költség, mintanyilatkozat

Az oldal jelenleg érdeklődésmérés: nincs rendelés vagy fizetés. A szállítási díjak **tervezési becslések hollandiai feladással és holland szárazföldi kézbesítéssel**, nem igazolt fuvarozói ajánlatok. A feladási hely még megerősítendő. Magyarországi közvetlen szállításra ezeket ne használd ajánlat nélkül.

| Tétel | Tesztben szereplő díj, áfával |
| --- | --- |
| 18″ Basic/Premium, 21″, 23″ | €99 / kamado |
| 27″ | €129 / kamado |
| Csak kiegészítők | €7,95 / rendelés |
| Kamadóval együtt küldött kiegészítők | nincs további díj |

A díj bekerül a kosárba, az érdeklődés végösszegébe, adatbázisába (`shipping_amount_eur`), CSV-exportjába és értesítő emailjébe. A szerver újraszámolja a szállítást; a kliens által beküldött szállítási díjat nem fogadja el. Régi érdeklődéseknél a szállítás mező 0 marad; korábbi végösszeget nem módosítunk. A képlet közös forrása `shipping-policy.js`; díjmódosításkor a tájékoztató és fordítások összegeit is frissíteni kell.

Ellenőrzött összehasonlítások (2026-09-18; nem statisztikai piaci átlag):
- [Hofstra Tijnje](https://hofstra-tijnje.nl/verzendkosten/): 150 kg-ig €81,76; egy raklap €88,15, áfával.
- [KamadoCompleet](https://kamadocompleet.nl/klantenservice/): összeszerelt kamado kiszállítása Frieslandon kívül Hollandiában €99, helyszínre állítással; eltérő szolgáltatás a sima raklapos fuvartól.
- [BBQdirect](https://bbqdirect.nl/verzend-en-retourbeleid/): kisebb kamado mini-raklapon €29,95; közepes és nagy kamadóknál átvállalt szállítás; normál csomag €7,95 a díjmentességi határ alatt. Az ingyenes fogyasztói ár nem mutatja a kereskedő fuvarozási önköltségét.

A €99/€129 induló üzleti becslés, nem a fenti eltérő szolgáltatások számtani átlaga. Az egyedi visszafuvarra feltüntetett €99–€179 szintén előzetes költségkeret. Éles eladás előtt kérj írásos ajánlatot: feladási és célirányítószám, csomagolt méretek, raklappal együtt mért bruttó tömeg, nem rakásolható/törékeny kerámia, lakossági cím, emelőhátfal, időpont-egyeztetés, üzemanyag- és egyéb pótdíjak, áfa, teljes értékű sérülésfedezet és önrész. A 27″ 150 kg-os szállítási tömege nincs ellenőrizve. Fuvarozói korlátozott felelősség nem azonos a teljes értékű biztosítással.

A KundiKamado korábbi mintájából nem vettünk át helykitöltő cégadatokat vagy magyar jogra szabott rendelkezéseket. Éles értékesítéshez még kell: jogi eladó neve, valós székhely és visszaküldési cím, nyilvántartási és áfaadatok, végleges szállítási feltételek és eladási/adatkezelési tájékoztatók. Az élettartam/5 éves kereskedelmi garancia igazolás nélkül nincs megígérve; a törvényes jogok megmaradnak. Források: [ACM garancia](https://consument.acm.nl/garantie-reparatie-geld-terug/garantie), [ACM elállás](https://consument.acm.nl/aankoop-dienst-annuleren/bedenktijd).

## Cloudflare: info@smokeykamado.nl → ferkomes@gmail.com

Ez a bejövő levelek továbbítása; nem változtatja meg a meglévő Mailjet küldést. A DNS- vagy email-routing beállításokat a kód telepítése nem kapcsolja be.

1. Ellenőrizd, hogy a **smokeykamado.nl** domain Cloudflare státusza **Active**, és a regisztrátornál a Cloudflare által megadott nameserverek élnek.
2. Cloudflare dashboard: **Compute → Email Service → Email Routing**; egyes felületeken a domainen belül **Email → Email Routing**. Válaszd a smokeykamado.nl domaint és a beállítás indítását.
3. **Destination addresses**: add hozzá a `ferkomes@gmail.com` címet. Nyisd meg a Gmailbe érkező ellenőrző levelet és igazold a címet.
4. A varázslóval add hozzá az Email Routinghoz szükséges **MX és TXT** rekordokat. Meglévő levelezőszolgáltatás MX rekordjait csak tudatos áttéréskor cseréld. A Mailjet DKIM rekordokat tartsd meg; egy domainen ne legyen két külön `v=spf1` rekord, a szükséges engedélyeket egy SPF rekordban kell összefogni.
5. **Routing rules → Create address**: custom address `info@smokeykamado.nl` → action **Send to an email** → destination `ferkomes@gmail.com` → mentés, szabály engedélyezése.
6. Ha *minden* `@smokeykamado.nl` címre érkező levelet kérsz: **Catch-all address → Send to an email → ferkomes@gmail.com → Enable**. Ellenőrizd a többi egyedi szabályt is, mert a catch-all csak a más szabállyal nem kezelt címekre vonatkozik.
7. Egy másik email-fiókból küldj tesztet az `info@smokeykamado.nl` címre, majd catch-all esetén egy másik címre is. Ellenőrizd a Gmail beérkező/spam mappáit és a Cloudflare routing naplóját. A tényleges kézbesítés csak ezután igazolt.

Ez önmagában nem állít be Gmailből `info@smokeykamado.nl` feladóval küldést: a Gmail válasz alapból a Gmail-címedről megy. A saját domaines feladóhoz külön hitelesített SMTP/szolgáltató és Gmail „Send mail as” beállítás kell; most a már működő Mailjet küldést megtartjuk.

Hivatalos útmutató: [Cloudflare email routing szabályok és catch-all](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/).

## YouTube videók az adminból

Az `/admin` oldalon a **YouTube videos** részben válaszd ki a kezdőlapot vagy a konkrét kamado/kiegészítő oldalát. Soronként egy YouTube-linket adhatsz meg, legfeljebb ötöt. A sorok sorrendje a megjelenési sorrend. A **Save videos** menti D1-be; nem kell új build. Üres listával mentve minden videót eltávolítasz az adott helyről. Másik adminablak időközbeni módosítását a mentés nem írja felül.

A videót előbb YouTube-ra töltsd fel (nyilvános vagy nem listázott, beágyazás engedélyezve). Ez YouTube-linkkezelés, nem helyi MP4-fájlfeltöltés. A termékgalériában a videók a fotók után jelennek meg. Videó nélkül nincs videóhelykitöltő; a kezdőlapi videós rész teljesen rejtett. Egyetlen fotónál nincs felesleges lapozó. Több médiánál nyilak, számláló, billentyűzetes bal/jobb navigáció és mobilos lapozás működik. A YouTube-lejátszó csak a lejátszás gomb megnyomására töltődik be; a média elváltásakor leáll.

## Publikálás és Google Search Console

Van automatikus **`/sitemap.xml`** és **`/robots.txt`**. A sitemap tartalmazza a főoldalt és mind az 5 kamado-, illetve 6 kiegészítőoldalt. Az admin/API nincs benne. A support-oldalak jelenleg `noindex` állapotú előzetes tájékoztatók, ezért nincsenek a sitemapben. Nem adunk minden kérésnél hamis frissítési dátumot.

Érdemes a valós domainen publikálni az őszintén érdeklődésmérésként megjelölt kínálatot, de Google-indexelést csak a végleges domain beállítása után kérj:

1. A `smokeykamado.nl` Cloudflare-státusza legyen Active; rendeld a domaint az `nl-kamado` Workerhez, és ellenőrizd a HTTPS elérést.
2. A `wrangler.toml` `SITE_URL` értékét állítsd `https://smokeykamado.nl` címre, majd build/deploy. Ez frissíti a canonical URL-eket, a sitemap linkjeit és az email dashboard-linkjét is. Addig a tesztcím marad működőképes.
3. Ellenőrizd a kezdőlap és egy termékoldal canonical címét, a `/sitemap.xml` URL-jeit, valamint hogy a végleges oldalon nincs `X-Robots-Tag: noindex` fejléc. A Workers tesztdomain mindig `noindex`; a végleges domain is az marad, amíg a konfiguráció tesztcímre mutat. Az admin mindig `noindex`.
4. Search Console → **Add property → Domain → smokeykamado.nl**. A Google által megadott TXT rekordot add hozzá a Cloudflare DNS-ben, majd Verify.
5. **Sitemaps** → küldd be a `https://smokeykamado.nl/sitemap.xml` címet. **URL Inspection** alatt a főoldalra kérhetsz indexelést; a többi URL-t a sitemap alapján fedezheti fel Google. A beküldés nem garantál indexelést vagy rangsorolást.

Forrás: [Google sitemap útmutató](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [újrafeltérképezés kérése](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
