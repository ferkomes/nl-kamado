/**
 * Email notification service for new PURCHASE_INTENT
 * Sent ONLY upon final PURCHASE_INTENT submit via the dedicated NL route on mail-sender
 */

async function sendPurchaseIntentNotification(env, intent) {
  const recipient = "ferkomes@gmail.com";
  if (!env || !env.MAIL_SENDER || typeof env.MAIL_SENDER.fetch !== "function") {
    return { success: false, error: "MAIL_NOT_CONFIGURED" };
  }

  const totalFormatted = "€" + Number(intent.totalAmountEur || 0).toLocaleString("nl-NL");
  const kamadoFormatted = "€" + Number(intent.kamadoPriceEur || 0).toLocaleString("nl-NL");
  const accFormatted = "€" + Number(intent.accessoriesPriceEur || 0).toLocaleString("nl-NL");

  const lines = [];
  lines.push((intent.modelName || "Kamado") + " – " + (intent.finalColor || intent.colorName || "Black") + " ×1");

  (intent.accessories || []).forEach(acc => {
    lines.push(acc.name + " ×" + (acc.qty || 1));
  });

  const customerEmail = intent.customer?.email || intent.email || "";
  const customerName = intent.customer?.name || intent.name || "CraftKamado Customer";
  const subject = "New NL Purchase Intent – " + totalFormatted + " (" + (customerEmail || "Geen email") + ")";

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
    "Naam: " + (customerName || "-"),
    "E-mail: " + (customerEmail || "-"),
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
    const res = await env.MAIL_SENDER.fetch("https://mail-sender/nl-kamado/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        subject,
        message: plainText,
        customerEmail,
        targetEmail: recipient
      })
    });
    const result = await res.json();
    if (res.ok && result.success === true && result.recipient === recipient) {
      return { success: true, recipient, method: "mail-sender-binding" };
    }
    return { success: false, error: result.error || "MAIL_SENDER_REJECTED" };
  } catch {
    return { success: false, error: "MAIL_SEND_FAILED" };
  }
}

module.exports = { sendPurchaseIntentNotification };
