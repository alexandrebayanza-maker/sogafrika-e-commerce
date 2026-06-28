import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export function getStripeAmountForCurrency(amount: number, currency: string): number {
  // XOF (CFA Franc) is a zero-decimal currency
  const zeroDecimalCurrencies = ['xof', 'xaf', 'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv'];
  
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount);
  }
  // For standard currencies, Stripe expects amounts in cents
  return Math.round(amount * 100);
}

export function getDisplayAmountFromStripe(amount: number, currency: string): number {
  const zeroDecimalCurrencies = ['xof', 'xaf', 'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv'];
  
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return amount;
  }
  return amount / 100;
}
