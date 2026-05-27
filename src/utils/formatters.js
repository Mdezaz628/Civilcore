export function fmt(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function parseMoneyLabel(value) {
  if (!value) return 0;
  const normalized = String(value).replace(/[,\s]/g, '');
  const numeric = parseFloat(normalized.replace(/[^0-9.]/g, '')) || 0;

  if (/cr/i.test(normalized)) return numeric * 10000000;
  if (/l/i.test(normalized)) return numeric * 100000;
  return numeric;
}

export function safeDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
