// Planned mainland-NL rates, incl. VAT; indicative until carrier quotes are confirmed.
function shippingAmount(items) {
  if (!items.length) return 0;
  const kamados = items.filter(item => item.type === 'kamado');
  if (!kamados.length) return 7.95;
  return kamados.reduce((sum, item) => {
    const size = String(item.sizeInch || item.modelKey || item.id || item.name || '');
    return sum + (/27/.test(size) ? 129 : 99) * (item.qty || 1);
  }, 0);
}
