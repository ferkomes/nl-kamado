/**
 * Email notification service for new PURCHASE_INTENT
 * Sent ONLY upon final PURCHASE_INTENT submit via mail-sender
 */

async function sendPurchaseIntentNotification(env, intent) {
  const recipient = env.NOTIFY_EMAIL || "info@kundikamado.hu";
  const totalFormatted = "€" + Number(intent.totalAmountEur || 0).toLocaleString("nl-NL");
  const kamadoFormatted = "€" + Number(intent.kamadoPriceEur || 0).toLocaleString("nl-NL");
  const accFormatted = "€" + Number(intent.accessoriesPriceEur || 0).toLocaleString("nl-NL");

  const lines = [];
  lines.push((intent.modelName || "Kamado") + " – " + (intent.finalColor || intent.colorName || "Black") + " ×1");

  (intent.accessories || []).forEach(acc => {
    lines.push(acc.name + " ×" + (acc.qty || 1));
  });

  const subject = "New NL Purchase Intent – " + totalFormatted + " (" + (intent.customer?.email || intent.email || "Geen email") + ")";

  const plainText = [
    "=== NIEUWE NEDERLANDSE AANKOOPINTENTIE (MARKET TEST) ===",
    "",
    "Totaalbedrag: " + totalFormatted,
    "Kamado model: " + (intent.modelName || "Kamado"),
    "Gekozen kleur: " + (intent.finalColor || intent.colorName || "Black"),
    "Kamado prijs: " + kamadoFormatted,
    "Accessoires (" + (intent.accessories?.length || 0) + "): " + accFormatted,
    lines.map(l => "  • " + l).join("\n"),
    "",
    "--- KLANTGEGEVENS ---",
    "Naam: " + (intent.customer?.name || intent.name || "-"),
    "E-mail: " + (intent.customer?.email || intent.email || "-"),
    "Telefoon: " + (intent.customer?.phone || intent.phone || "-"),
    "Adres: " + (intent.customer?.street || intent.street || "-") + ", " + (intent.customer?.postalCode || intent.postalCode || "") + " " + (intent.customer?.city || intent.city || "") + " (NL)",
    "Betaalmethode intentie: " + (intent.paymentMethod || "ideal"),
    "",
    "--- ATTRIBUTIE & SESSIE ---",
    "Bron (Traffic Source): " + (intent.source || "Direct"),
    "Landing page: " + (intent.landingPage || "/"),
    "Eerste kleurkeuze: " + (intent.initialColor || "-") + " -> Definitieve kleur: " + (intent.finalColor || "-"),
    "Sessie ID: " + (intent.sessionId || "-"),
    "Tijdstip: " + new Date().toISOString(),
    "",
    "Bekijk live dashboard: https://nl-kamado.ferkomes.workers.dev/admin/market-test"
  ].join("\n");

  try {
    const fd = new FormData();
    fd.append("name", intent.customer?.name || intent.name || "CraftKamado Lead");
    fd.append("email", intent.customer?.email || intent.email || recipient);
    fd.append("phone", intent.customer?.phone || intent.phone || "-");
    fd.append("productName", (intent.modelName || "Kamado") + " (" + (intent.finalColor || "Black") + ") – Totaal: " + totalFormatted);
    fd.append("subject", subject);
    fd.append("message", plainText);

    let res;
    if (env && env.MAIL_SENDER && typeof env.MAIL_SENDER.fetch === "function") {
      res = await env.MAIL_SENDER.fetch("https://mail-sender/", {
        method: "POST",
        body: fd
      });
    } else {
      res = await fetch("https://mail-sender.ferkomes.workers.dev/", {
        method: "POST",
        body: fd
      });
    }

    if (res && res.ok) {
      return { success: true, method: "mail-sender" };
    }
  } catch (err) {
    console.warn("Mail-sender error:", err);
  }

  return { success: false, error: "Could not deliver notification email" };
}

module.exports = {
  sendPurchaseIntentNotification
};
