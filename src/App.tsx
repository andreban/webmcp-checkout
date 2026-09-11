import { useState, useEffect } from 'react';
import { useWebMCP } from 'use-webmcp-tool';
import { fetchCartQuote, submitOrder } from './backend';
import { Cart } from './components/Cart';
import { ResultBanner, type OrderResult } from './components/ResultBanner';
import { PromptBox } from './components/PromptBox';
import { ExperimentToggle } from './components/ExperimentToggle';

const BASE_PRICE = 100;

export default function App() {
  const [coupon, setCoupon] = useState<string>('');
  const [total, setTotal] = useState<number>(BASE_PRICE);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [disableCheckoutWhileCalculating, setDisableCheckoutWhileCalculating] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

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

    setOrderResult(result);
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
    description: 'Set discount coupon code (e.g. "SAVE50").',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Coupon code' },
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
    description: 'Finalize purchase and charge payment at current total.',
    inputSchema: { type: 'object', properties: {} },
    enabled: isCheckoutEnabled,
    execute: async () => {
      return await processCheckout();
    },
  });

  const handleReset = () => {
    setCoupon('');
    setTotal(BASE_PRICE);
    setIsCalculating(false);
    setOrderResult(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
          WebMCP Demo: Missing "Ready" State
        </h1>
        {orderResult && (
          <button
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              backgroundColor: '#e2e8f0',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset Order
          </button>
        )}
      </div>

      <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>
        Demonstrating the race condition between decoupled React <code>useEffect</code> backend calls and tool invocations.
      </p>

      <PromptBox />

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

      <ResultBanner result={orderResult} />
    </div>
  );
}
