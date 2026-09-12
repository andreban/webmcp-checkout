import { useState, useEffect } from 'react';
import { useWebMCP } from 'use-webmcp-tool';
import { fetchCartQuote, submitOrder } from '../backend';
import { Cart } from './Cart';
import { ExperimentToggle } from './ExperimentToggle';
import { type OrderResult } from './ResultBanner';

const BASE_PRICE = 100;

interface CheckoutProps {
  onOrderComplete: (result: OrderResult) => void;
}

export function Checkout({ onOrderComplete }: CheckoutProps) {
  const [coupon, setCoupon] = useState<string>('');
  const [total, setTotal] = useState<number>(BASE_PRICE);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [disableCheckoutWhileCalculating, setDisableCheckoutWhileCalculating] = useState<boolean>(false);

  // Decoupled React side-effect: triggers async recalculation via backend.ts
  useEffect(() => {
    if (!coupon) return;

    setIsCalculating(true);

    fetchCartQuote({ coupon, basePrice: BASE_PRICE })
      .then((quote) => {
        setTotal(quote.newTotal);
      })
      .catch((err) => {
        console.error('Backend API error:', err);
      })
      .finally(() => {
        setIsCalculating(false);
      });
  }, [coupon]);

  // Shared checkout handler (plain async function)
  const processCheckout = async () => {
    setIsCheckingOut(true);

    const amountToCharge = total;
    // Call payment gateway on backend.ts
    const order = await submitOrder(amountToCharge);

    // Check if overcharged due to race condition
    const wasOvercharged = isCalculating || amountToCharge !== 50;

    const result: OrderResult = {
      orderId: order.orderId,
      charged: order.amountCharged,
      expected: 50,
      isOvercharged: wasOvercharged,
    };

    onOrderComplete(result);
    setIsCheckingOut(false);

    return {
      success: true,
      orderId: order.orderId,
      amountCharged: order.amountCharged,
      status: order.status,
      message: `Order ${order.orderId} placed successfully. Charged $${order.amountCharged}.00.`,
    };
  };

  // WebMCP Tool 1: set_coupon (Fire-and-forget state update)
  useWebMCP<{ code: string }, any>({
    name: 'set_coupon',
    description: 'Applies a discount coupon code to recalculate the cart total.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Coupon code (e.g. "SAVE50")' },
      },
      required: ['code'],
    },
    execute: async ({ code }) => {
      setCoupon(code);
      return { success: true, message: `Coupon code '${code}' set.` };
    },
  });

  // WebMCP Tool 2: checkout (Calls backend to process payment and reports back amount)
  // Controlled by the experiment toggle: if active, enabled is false while calculating!
  const isCheckoutEnabled = disableCheckoutWhileCalculating ? !isCalculating : true;

  const checkoutToolState = useWebMCP({
    name: 'checkout',
    description: 'Finalizes purchase and charges payment for the current cart total. If applying discounts or modifying the cart, invoke this in a separate step afterwards.',
    inputSchema: { type: 'object', properties: {} },
    enabled: isCheckoutEnabled,
    execute: async () => {
      return await processCheckout();
    },
  });

  return (
    <div>
      <ExperimentToggle
        disableOnCalc={disableCheckoutWhileCalculating}
        onToggle={setDisableCheckoutWhileCalculating}
        isCheckoutRegistered={checkoutToolState.registered}
      />

      <Cart
        basePrice={BASE_PRICE}
        coupon={coupon}
        total={total}
        isCalculating={isCalculating}
        isCheckingOut={isCheckingOut}
        onApplyCoupon={setCoupon}
        onCheckout={processCheckout}
      />
    </div>
  );
}
