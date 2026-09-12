import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PromptBox } from './components/PromptBox';
import { Checkout } from './components/Checkout';
import { ResultBanner, type OrderResult } from './components/ResultBanner';

export default function App() {
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [checkoutKey, setCheckoutKey] = useState<number>(0);

  const handleReset = () => {
    setOrderResult(null);
    setCheckoutKey((k) => k + 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
      }}
    >
      <Header />

      <main
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 20px',
          flex: 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
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

        <Checkout key={checkoutKey} onOrderComplete={setOrderResult} />

        <ResultBanner result={orderResult} />
      </main>

      <Footer />
    </div>
  );
}
