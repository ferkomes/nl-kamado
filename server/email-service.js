/**
 * Email notification service for new PURCHASE_INTENT
 */

async function sendPurchaseIntentNotification(env, intent) {
  const recipient = env.NOTIFY_EMAIL || 'info@kundikamado.hu';
  const totalFormatted = '€' + Number(intent.totalAmountEur || 0).toLocaleString('nl-NL') + ',-';

  let itemsHtml = (intent.items || []).map(item => {
    let meta = '';
    if (item.type === 'kamado') {
      meta = `<br><small style="color: #666;">Kleur: ${item.colorName || item.colorId} | Afwerking: ${item.textureName || item.textureId}</small>`;
    } else if (item.sizeInch) {
      meta = `<br><small style="color: #666;">Geschikt voor: ${item.sizeInch}″ Kamado</small>`;
    }
    return `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${item.qty}x</strong> ${item.name}${meta}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${Number(item.price * item.qty).toLocaleString('nl-NL')},-</td>
    </tr>`;
  }).join('');

  const subject = `🔥 Nieuwe Aankoopintentie (NL Markt-Test): ${intent.sizeInch}″ Kamado - ${totalFormatted} van ${intent.customer.name}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5;">
      <div style="background-color: #0c0d10; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ff6b35; margin: 0;">KundiKamado Nederland</h2>
        <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">Nieuwe Aankoopintentie Geregistreerd (Marktvalidatie)</p>
      </div>

      <div style="padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; background: #fafafa;">
        <div style="background: #fff; padding: 16px; border-radius: 6px; border-left: 4px solid #ff6b35; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #222;">Klantgegevens (Nederland)</h3>
          <p style="margin: 4px 0;"><strong>Naam:</strong> ${intent.customer.name}</p>
          <p style="margin: 4px 0;"><strong>E-mail:</strong> <a href="mailto:${intent.customer.email}">${intent.customer.email}</a></p>
          <p style="margin: 4px 0;"><strong>Telefoon:</strong> <a href="tel:${intent.customer.phone}">${intent.customer.phone}</a></p>
          <p style="margin: 4px 0;"><strong>Adres:</strong> ${intent.customer.street} ${intent.customer.houseNumber}, ${intent.customer.postalCode} ${intent.customer.city} (NL)</p>
          <p style="margin: 4px 0;"><strong>Gekozen Betaalmethode:</strong> ${(intent.paymentMethod || 'iDEAL').toUpperCase()}</p>
        </div>

        <h3 style="color: #222; margin-bottom: 10px;">Geselecteerde Configuratie & Artikelen</h3>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 8px; text-align: left;">Artikel</th>
              <th style="padding: 8px; text-align: right;">Prijs</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; border-top: 2px solid #ddd;">Totaalbedrag (Hypothetisch):</td>
              <td style="padding: 12px 8px; font-weight: bold; text-align: right; border-top: 2px solid #ddd; color: #ff6b35; font-size: 16px;">${totalFormatted}</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 12px; border-radius: 6px; font-size: 13px; color: #3730a3;">
          ℹ️ <strong>Herinnering Markt-Test:</strong> De klant heeft te zien gekregen dat het product binnenkort beschikbaar is in Nederland en dat er niets in rekening is gebracht. Deze lead is opgeslagen in het admin dashboard onder <code>/admin/market-test</code>.
        </div>
      </div>
    </div>
  `;

  // 1. Try internal/configured mail sender service
  const mailSenderUrl = env.MAIL_SENDER_URL || 'https://mail-sender.ferkomes.workers.dev';
  try {
    const res = await fetch(mailSenderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: subject,
        html: htmlBody,
        text: `Nieuwe aankoopintentie van ${intent.customer.name} (${intent.customer.email}): ${intent.sizeInch}″ Kamado - Totaal: ${totalFormatted}`
      })
    });
    if (res.ok) {
      return { success: true, method: 'mail-sender' };
    }
  } catch (err) {
    console.warn('Mail-sender service error:', err);
  }

  // 2. Fallback: MailChannels API (Cloudflare Worker standard)
  try {
    const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient, name: 'KundiKamado Admin' }] }],
        from: { email: 'noreply@kundikamado.nl', name: 'KundiKamado NL Demand Test' },
        subject: subject,
        content: [{ type: 'text/html', value: htmlBody }]
      })
    });
    if (mcRes.ok) {
      return { success: true, method: 'mailchannels' };
    }
  } catch (err) {
    console.warn('MailChannels fallback error:', err);
  }

  return { success: false, error: 'Could not deliver email via configured gateways' };
}

module.exports = {
  sendPurchaseIntentNotification
};
