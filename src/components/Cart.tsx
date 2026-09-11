import { useState } from 'react';

interface CartProps {
  basePrice: number;
  coupon: string;
  total: number;
  isCalculating: boolean;
  isCheckingOut: boolean;
  onApplyCoupon: (code: string) => void;
  onCheckout: () => void;
}

export function Cart({
  basePrice,
  coupon,
  total,
  isCalculating,
  isCheckingOut,
  onApplyCoupon,
  onCheckout,
}: CartProps) {
  const [inputCode, setInputCode] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onApplyCoupon(inputCode.trim());
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 14px', color: '#0f172a' }}>
        Shopping Cart
      </h2>

      {/* Cart Item */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15px' }}>
        <span>Mechanical Keyboard:</span>
        <strong style={{ color: '#0f172a' }}>${basePrice}.00</strong>
      </div>

      {/* Applied Coupon Display */}
      {coupon && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '14px',
            color: '#16a34a',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <span>Applied Coupon ({coupon}):</span>
          <span>-${basePrice - total}.00</span>
        </div>
      )}

      {/* Coupon Input Form (UI Control) */}
      <form onSubmit={handleApply} style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
        <input
          type="text"
          placeholder="Promo code (e.g. SAVE50)"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            fontFamily: 'monospace',
          }}
        />
        <button
          type="submit"
          disabled={isCalculating || !inputCode.trim()}
          style={{
            padding: '8px 14px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isCalculating || !inputCode.trim() ? 'not-allowed' : 'pointer',
            opacity: isCalculating || !inputCode.trim() ? 0.6 : 1,
          }}
        >
          Apply
        </button>
      </form>

      {/* Application Readiness Status */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          backgroundColor: isCalculating ? '#fef3c7' : '#f1f5f9',
          color: isCalculating ? '#92400e' : '#475569',
          fontSize: '13px',
          fontWeight: 600,
          margin: '14px 0',
        }}
      >
        {isCalculating
          ? '⏳ React useEffect is calling backend.ts in background (1.5s)... [UNREADY]'
          : '🟢 Application idle [READY]'}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

      {/* Cart Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
        <span>Total:</span>
        <span style={{ color: '#0f172a' }}>${total}.00</span>
      </div>

      {/* Checkout Button (UI Control) */}
      <button
        onClick={onCheckout}
        disabled={isCalculating || isCheckingOut}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: isCalculating || isCheckingOut ? '#94a3b8' : '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: isCalculating || isCheckingOut ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {isCheckingOut
          ? 'Processing Payment with backend.ts...'
          : isCalculating
          ? 'Checkout Disabled (Recalculating price...)'
          : `Checkout Now ($${total}.00)`}
      </button>

      {isCalculating && (
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
          🔒 Button is disabled for humans, but AI agents bypass DOM buttons and call WebMCP tools directly!
        </div>
      )}
    </div>
  );
}
