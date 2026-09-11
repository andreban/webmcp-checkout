# WebMCP Checkout Demo

A React demonstration exploring the interaction between web application lifecycle states and the [WebMCP](https://github.com/webmachinelearning/webmcp) (Web Model Context Protocol) specification.

Specifically, this project demonstrates why AI agents experience **race conditions, stale state reads, and overcharges** when calling tools without an operational **`ready`** state synchronization mechanism.

---

## Background & Problem Statement

In React web applications, business logic is frequently asynchronous and decoupled from UI event handlers:

1. **`setState` is fire-and-forget:** Calling `setCoupon(code)` returns immediately (`void`).
2. **Side-effects run in `useEffect` or React Query:** Network recalculations (taxes, shipping, discounts) execute asynchronously in the background.
3. **The DOM protects human users:** Human users are protected by disabled buttons (`<button disabled={isCalculating}>Checkout</button>`).
4. **AI Agents bypass DOM buttons:** When an AI agent interacts via WebMCP, it invokes tools directly through `document.modelContext` (or React hooks like [`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool)).
5. **The Race Condition:** Because WebMCP currently lacks an operational **`ready`** state to indicate that the application is busy recalculating, the agent immediately fires `checkout` while the background request is still in flight, finalizing the order at the un-discounted, stale price.

---

## Architecture

* **[`src/backend.ts`](./src/backend.ts):** Simulates remote backend services (`fetchCartQuote` for coupon calculation with 1.5s latency, and `submitOrder` for payment processing).
* **[`src/App.tsx`](./src/App.tsx):** Root React component exposing WebMCP tools via `useWebMCP`:
  * `set_coupon`: Sets the promo code in state and triggers decoupled recalculation.
  * `checkout`: Submits the order at the current cart total.
* **[`src/components/`](./src/components/):**
  * `Cart.tsx`: Interactive cart with item, promo code input, and checkout button.
  * `PromptBox.tsx`: Suggested agent prompt with a 1-click clipboard copy button.
  * `ExperimentToggle.tsx`: Toggle to experiment with `enabled: !isCalculating` vs `enabled: true`.
  * `ResultBanner.tsx`: Order receipt displaying actual billed vs expected price.
  * `Explainer.tsx`: Step-by-step technical breakdown of the race condition.

---

## Getting Started

### Prerequisites
* Node.js (v18+)
* A browser with WebMCP support (e.g. Chrome with WebMCP extension or native flag)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
```bash
npm run build
```
*(The build is configured with `base: './'`, allowing it to run from any subdirectory or hosting path).*

---

## Testing with an AI Agent

Prompt your browser agent:
> *"Apply the coupon 'SAVE50' to my cart and then checkout right away."*

* **Status Quo (Toggle unchecked):** The agent invokes `set_coupon` and immediately calls `checkout`. Because WebMCP has no `ready` state to await, the user is charged **$100.00** instead of **$50.00**.
* **Enabled/Disabled Experiment (Toggle checked):** `checkout` has `enabled: !isCalculating`, unregistering from `document.modelContext` for 1.5s while the backend recalculates. Observe how your agent handles a tool disappearing.
