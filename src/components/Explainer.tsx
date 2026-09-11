export function Explainer() {
  return (
    <div
      style={{
        marginTop: '24px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '13px',
        color: '#334155',
      }}
    >
      <h4 style={{ margin: '0 0 8px', color: '#0f172a' }}>Why this happens:</h4>
      <ol style={{ paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
        <li>The agent calls <code>set_coupon("SAVE50")</code>.</li>
        <li>
          In React, <code>setCoupon()</code> fires, and <code>useEffect</code> calls <code>fetchCartQuote()</code> in <code>backend.ts</code> (1.5s).
        </li>
        <li>
          <strong>For humans:</strong> The HTML checkout button is disabled (<code>disabled={'{isCalculating}'}</code>), preventing accidental clicks.
        </li>
        <li>
          <strong>For AI agents:</strong> Agents don't click DOM buttons—they invoke WebMCP tools via <code>document.modelContext</code>. Because WebMCP has no <code>ready</code> state, the tool executes anyway!
        </li>
        <li>
          <code>checkout()</code> runs before the discount recalculation returns, charging <strong>$100.00</strong> instead of <strong>$50.00</strong>.
        </li>
      </ol>
    </div>
  );
}
