/**
 * Email notification service for new PURCHASE_INTENT
 * Sent ONLY upon final PURCHASE_INTENT submit
 */

async function sendPurchaseIntentNotification(env, intent) {
  const recipient = env.NOTIFY_EMAIL || 'info@kundikamado.hu';
  const totalFormatted = '€' + Number(intent.totalAmountEur || 0).toLocaleString('nl-NL');
  const kamadoFormatted = '€' + Number(intent.kamadoPriceEur || 0).toLocaleString('nl-NL');
  const accFormatted = '€' + Number(intent.accessoriesPriceEur || 0).toLocaleString('nl-NL');

  const lines = [];
  lines.push(`${intent.modelName || 'Kamado'} – ${intent.finalColor || intent.colorName || 'Black'} ×1`);

  (intent.accessories || []).forEach(acc => {
    lines.push(`${acc.name} ×${acc.qty || 1}`);
  });

  const subject = `New NL Purchase Intent – ${totalFormatted}`;

  const plainText = `
New NL Purchase Intent – ${totalFormatted}

${lines.join('\n')}

Kamado: ${kamadoFormatted} | Accessories: ${accFormatted} | Total: ${totalFormatted}
Customer: ${intent.customer?.email || intent.email || 'Geen email'}
Name: ${intent.customer?.name || intent.name || '-'}
Phone: ${intent.customer?.phone || intent.phone || '-'}
Region: ${intent.customer?.postalCode || intent.postalCode || ''} ${intent.customer?.city || intent.city || ''} (NL)
Source: ${intent.source || 'Direct'}
Landing page: ${intent.landingPage || '/'}
Initial color: ${intent.initialColor || '-'} | Final color: ${intent.finalColor || intent.colorName || '-'}
  `.trim();

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; line-height: 1.6;">
      <div style="background-color: #0c0d10; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ff6b35; margin: 0; font-size: 20px;">CraftKamado Nederland – New Purchase Intent</h2>
        <p style="color: #bbb; margin: 6px 0 0 0; font-size: 14px;">Marktvalidatie Inzending (~1 Maand Vraagtest)</p>
      </div>

      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
        <div style="font-size: 18px; font-weight: bold; color: #ff6b35; margin-bottom: 16px;">
          Totaalwaarde: ${totalFormatted}
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #ff6b35; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #111;">Gekozen Configuratie:</h4>
          <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 6px;">
            ${intent.modelName || 'Kamado'} – ${intent.finalColor || intent.colorName || 'Black'} ×1
          </div>
          ${(intent.accessories || []).map(a => `<div style="font-size: 14px; color: #475569;">+ ${a.name} ×${a.qty || 1}</div>`).join('')}
          <div style="margin-top: 10px; font-size: 13px; color: #64748b;">
            Kamado: <strong>${kamadoFormatted}</strong> | Accessoires: <strong>${accFormatted}</strong> | Totaal: <strong>${totalFormatted}</strong>
          </div>
        </div>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Klant:</td>
            <td style="padding: 6px 0;"><strong>${intent.customer?.name || intent.name || '-'}</strong> (<a href="mailto:${intent.customer?.email || intent.email}">${intent.customer?.email || intent.email}</a>)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Telefoon:</td>
            <td style="padding: 6px 0;"><a href="tel:${intent.customer?.phone || intent.phone}">${intent.customer?.phone || intent.phone || '-'}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Regio:</td>
            <td style="padding: 6px 0;"><strong>${intent.customer?.postalCode || intent.postalCode || ''} ${intent.customer?.city || intent.city || ''} (NL)</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Herkomst (Source):</td>
            <td style="padding: 6px 0;"><strong style="color: #2563eb;">${intent.source || 'Direct'}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Landing Page:</td>
            <td style="padding: 6px 0;"><code>${intent.landingPage || '/'}</code></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Kleurkeuze verloop:</td>
            <td style="padding: 6px 0;">Eerste: <em>${intent.initialColor || '-'}</em> ➔ Definitief: <strong>${intent.finalColor || intent.colorName || '-'}</strong></td>
          </tr>
        </table>

        <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          Dit is een automatische notificatie van de Nederlandse vraagtest. Alle statistieken zijn te vinden op <a href="https://nl-kamado.ferkomes.workers.dev/admin/market-test">/admin/market-test</a>.
        </div>
      </div>
    </div>
  `;

  // 1. Try configured mail sender service
  const mailSenderUrl = env.MAIL_SENDER_URL || 'https://mail-sender.ferkomes.workers.dev';
  try {
    const res = await fetch(mailSenderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: subject,
        html: htmlBody,
        text: plainText
      })
    });
    if (res.ok) return { success: true, method: 'mail-sender' };
  } catch (err) {
    console.warn('Mail-sender error:', err);
  }

  // 2. MailChannels fallback
  try {
    const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient, name: 'CraftKamado Admin' }] }],
        from: { email: 'noreply@craftkamado.nl', name: 'CraftKamado NL Demand Test' },
        subject: subject,
        content: [
          { type: 'text/plain', value: plainText },
          { type: 'text/html', value: htmlBody }
        ]
      })
    });
    if (mcRes.ok) return { success: true, method: 'mailchannels' };
  } catch (err) {
    console.warn('MailChannels error:', err);
  }

  return { success: false, error: 'Could not deliver notification email' };
}

module.exports = {
  sendPurchaseIntentNotification
};
