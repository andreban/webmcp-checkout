interface ExperimentToggleProps {
  disableOnCalc: boolean;
  onToggle: (val: boolean) => void;
  isCheckoutRegistered: boolean;
}

export function ExperimentToggle({
  disableOnCalc,
  onToggle,
  isCheckoutRegistered,
}: ExperimentToggleProps) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={disableOnCalc}
            onChange={(e) => onToggle(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }}
          />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
              Experiment: Use <code>enabled: false</code> while recalculating
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {disableOnCalc
                ? 'Active: checkout tool will unregister from WebMCP for 4.0s during backend recalculation.'
                : 'Inactive (Default): checkout tool stays registered (enabled: true), triggering the race condition.'}
            </div>
          </div>
        </label>

        {/* Live Tool Status Badge */}
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isCheckoutRegistered ? '#dcfce7' : '#fee2e2',
            color: isCheckoutRegistered ? '#15803d' : '#b91c1c',
            border: `1px solid ${isCheckoutRegistered ? '#bbf7d0' : '#fecaca'}`,
            whiteSpace: 'nowrap',
          }}
        >
          checkout: {isCheckoutRegistered ? '🟢 Registered' : '🔴 Unregistered'}
        </span>
      </div>
    </div>
  );
}
