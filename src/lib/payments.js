// Payment Gateway Utilities & Card Validation Engine for Horology Luxury Watches

/**
 * Detect card network/brand from number
 */
export function detectCardBrand(number = '') {
  const clean = number.replace(/\D/g, '');
  if (!clean) return 'generic';

  // Mada detection (Saudi BIN ranges)
  const madaPrefixes = [
    '588845', '440647', '440795', '446404', '457865', '457997', '484783', '968201', '968202',
    '968203', '968204', '968205', '968206', '968207', '968208', '968209', '968210', '968211',
    '588982', '588983', '589005', '589206', '535825', '543357', '529415', '536023', '524130'
  ];
  if (madaPrefixes.some(p => clean.startsWith(p))) {
    return 'mada';
  }

  // Visa
  if (/^4/.test(clean)) return 'visa';

  // Mastercard
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return 'mastercard';

  // American Express
  if (/^3[47]/.test(clean)) return 'amex';

  // Discover
  if (/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5])|64[4-9]|65)/.test(clean)) return 'discover';

  return 'generic';
}

/**
 * Format credit card number with spaces (4-4-4-4)
 */
export function formatCardNumber(value = '') {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
}

/**
 * Format expiration date as MM/YY
 */
export function formatCardExpiry(value = '') {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 2) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
}

/**
 * Luhn algorithm validation for credit cards
 */
export function validateLuhn(number = '') {
  const clean = number.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Validate card expiry date (MM/YY)
 */
export function validateExpiry(expiry = '') {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + 20) return false;

  return true;
}

/**
 * Validate CVV (3 or 4 digits)
 */
export function validateCVV(cvv = '', brand = 'generic') {
  const clean = cvv.replace(/\D/g, '');
  if (brand === 'amex') {
    return clean.length === 4;
  }
  return clean.length === 3;
}

/**
 * Sandbox Test Card Credentials
 */
export const sandboxTestCards = [
  {
    brand: 'visa',
    name: 'VIP Visa Infinite',
    number: '4242 4242 4242 4242',
    expiry: '12/29',
    cvv: '123',
    badge: 'Success Test'
  },
  {
    brand: 'mada',
    name: 'Mada VIP Royal',
    number: '5888 4500 1234 5678',
    expiry: '08/30',
    cvv: '888',
    badge: 'Mada Direct'
  },
  {
    brand: 'mastercard',
    name: 'Mastercard World Elite',
    number: '5555 5555 5555 4444',
    expiry: '10/28',
    cvv: '777',
    badge: 'Mastercard 3DS'
  },
  {
    brand: 'amex',
    name: 'Amex Centurion Black',
    number: '3782 822463 10005',
    expiry: '11/27',
    cvv: '1234',
    badge: 'Amex Centurion'
  }
];
