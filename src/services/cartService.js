/**
 * Reserved for a future shopping cart, checkout page, and Razorpay integration.
 * Phase 1 uses WhatsApp enquiries only. Do not collect payments here.
 */

export function createEmptyCart() {
  return { items: [], coupon: null, totals: { subtotal: 0, discount: 0, payable: 0 } }
}
