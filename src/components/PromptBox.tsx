import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const SUGGESTED_PROMPT = "Apply the coupon 'SAVE50' to my cart and then checkout right away.";

export function PromptBox() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUGGESTED_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt to clipboard', err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Suggested Prompt for your Browser Agent
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            backgroundColor: copied ? '#10b981' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '10px 12px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#0f172a',
          userSelect: 'all',
        }}
      >
        "{SUGGESTED_PROMPT}"
      </div>
    </div>
  );
}
