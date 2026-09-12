export function Footer() {
  return (
    <footer
      style={{
        marginTop: '60px',
        borderTop: '1px solid #e2e8f0',
        padding: '24px 20px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 6px' }}>
          &copy; 2026 Keyboards & Co. Built with React 19 & WebMCP.
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
          Demonstration of decoupled state synchronization challenges in browser-based AI agents.
        </p>
      </div>
    </footer>
  );
}
