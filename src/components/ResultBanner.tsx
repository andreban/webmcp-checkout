export interface OrderResult {
  orderId: string;
  charged: number;
  expected: number;
  isOvercharged: boolean;
}

interface ResultBannerProps {
  result: OrderResult | null;
}

export function ResultBanner({ result }: ResultBannerProps) {
  if (!result) return null;

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '18px 20px',
        borderRadius: '8px',
        backgroundColor: result.isOvercharged ? '#fff1f2' : '#f0fdf4',
        border: `2px solid ${result.isOvercharged ? '#f43f5e' : '#22c55e'}`,
        color: result.isOvercharged ? '#9f1239' : '#166534',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
          {result.isOvercharged
            ? '🚨 RACE CONDITION: ORDER OVERCHARGED'
            : '✅ ORDER CONFIRMED WITH DISCOUNT'}
        </h3>
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '12px',
            backgroundColor: 'rgba(0,0,0,0.06)',
            padding: '3px 8px',
            borderRadius: '4px',
          }}
        >
          {result.orderId}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid rgba(0,0,0,0.08)',
          fontSize: '13px',
          margin: '10px 0',
          color: '#0f172a',
        }}
      >
        <div>
          <span style={{ color: '#64748b' }}>Expected Price:</span>{' '}
          <strong style={{ color: '#16a34a' }}>${result.expected}.00</strong>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Actual Billed:</span>{' '}
          <strong style={{ color: result.isOvercharged ? '#e11d48' : '#16a34a' }}>
            ${result.charged}.00
          </strong>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
        {result.isOvercharged ? (
          <span>
            <strong>The user was overcharged by ${result.charged - result.expected}.00!</strong>{' '}
            The agent called <code>checkout</code> before <code>backend.ts</code> finished calculating the coupon, so the order was finalized at the full un-discounted price.
          </span>
        ) : (
          <span>The order was accurately finalized with the 50% discount applied.</span>
        )}
      </p>
    </div>
  );
}
