/**
 * Stripe configuration.
 *
 * Replace the placeholder below with your real Stripe **publishable** key
 * (starts with `pk_test_...` in test mode, `pk_live_...` in production).
 * The publishable key is safe to ship in the app. The SECRET key must NEVER
 * live in the app — it stays on the backend that creates the PaymentIntent.
 */
export const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51TFbNSPSkoro2k3lw5DL6X3ZdDRWPD0Wq0NaDFAJYtLhUz90hWRrXa2pwQsWEHa1eu5SmX3kdrlPDJejJNKnypYq006thkTFlC';

/**
 * Shown to the user in the Stripe payment sheet (e.g. "Tonefit").
 */
export const STRIPE_MERCHANT_NAME = 'Tonefit';
