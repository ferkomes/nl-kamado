# KundiKamado Nederland - Marktvalidatie Webshop (Cloudflare Worker)

Geïsoleerde Nederlandse vraagvalidatie-applicatie (~1 maand markt-test) voor **KundiKamado** in Nederland.

- **GitHub Repository**: [https://github.com/ferkomes/nl-kamado](https://github.com/ferkomes/nl-kamado)
- **Taal**: 100% Nederlands (`nl`)
- **Valuta**: Euro (`€`, EUR)
- **Platform**: Cloudflare Workers, Cloudflare D1 Database (`nl_kamado_db`), Cloudflare R2 (`nl-kamado-assets`).

---

## 🎯 Doel van het Markt-Test Project

1. **Reële Marktvalidatie**: Klanten kunnen een realistisch model, formaat (18″, 21″, 23″, 27″), kleur en formaat-afhankelijke accessoires configureren en in hun winkelwagen plaatsen.
2. **Realistisch Afrekenproces**: Volledige Nederlandse adresvelden (straatnaam, huisnummer, postcode `1234 AB`, woonplaats) en vertrouwde betaalopties (iDEAL, Creditcard, Klarna).
3. **Geen Echte Betalingen**: Geen Stripe, iDEAL-transactie of facturatie.
4. **Aankoopintentie Registratie (`PURCHASE_INTENT`)**: Bij de definitieve klik op **„Doorgaan naar betaling”** wordt de aankoopintentie vastgelegd in Cloudflare D1 en ontvangt de klant een transparante en vriendelijke melding dat KundiKamado de Nederlandse marktintroductie voorbereidt, niets in rekening is gebracht en de klant als dank 10% VIP introductiekorting reserveert.
5. **E-mailnotificaties**: Voor elke nieuwe aankoopintentie wordt direct een e-mail verstuurd naar de beheerder (`ferkomes@gmail.com`) met alle klant- en besteldetails.
6. **Analytisch Dashboard (`/admin/market-test`)**: Realtime inzicht in trechterconversie, populariteit van modellen, kleuren, accessoires, topcombinaties, hypothetische omzet en verlaten winkelwagens.

---

## 💶 Prijsstructuur (EUR)

### Kamado Modellen (All-Inclusive)
- **18″ Compact**: €699,- *(adviesprijs €898,-)*
- **21″ Veelzijdig**: €889,- *(adviesprijs €1.108,-)*
- **23″ Bestseller**: €1.019,- *(adviesprijs €1.178,-)*
- **27″ HoReCa Reus**: €1.319,- *(adviesprijs €1.410,-)*

*Alle modellen worden All-Inclusive geleverd met zwaar onderstel met wielen, inklapbare bamboe zijtafels, Air Hinge veerscharnier, Divide & Conquer systeem, gietijzeren rooster, aslade, beschermhoes en rookhout-inlaat.*

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
