export interface CartQuoteRequest {
  coupon: string;
  basePrice: number;
}

export interface CartQuoteResponse {
  coupon: string;
  valid: boolean;
  discount: number;
  newTotal: number;
}

/**
 * Simulated Backend API endpoint (e.g. POST /api/cart/quote)
 *
 * In a real production system, this function calls the remote server to:
 * - Validate the coupon code against a database
 * - Check expiration date and user eligibility
 * - Recalculate taxes and shipping rates
 * - Return the authoritative new cart total
 */
export async function fetchCartQuote(req: CartQuoteRequest): Promise<CartQuoteResponse> {
  // Simulate 1.5s network round-trip latency to the backend
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const code = req.coupon.trim().toUpperCase();
  const isValid = code === 'SAVE50';
  const discount = isValid ? 50 : 0;
  const newTotal = req.basePrice - discount;

  return {
    coupon: req.coupon,
    valid: isValid,
    discount,
    newTotal,
  };
}

export interface OrderResponse {
  orderId: string;
  amountCharged: number;
  status: string;
}

/**
 * Simulated Backend API endpoint (e.g. POST /api/orders/checkout)
 * Charges payment gateway (Stripe/PayPal) and commits order to database.
 */
export async function submitOrder(amount: number): Promise<OrderResponse> {
  // Simulate 500ms network round-trip for payment gateway
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    amountCharged: amount,
    status: 'COMPLETED',
  };
}
