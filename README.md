# WebMCP Checkout Demo

A React demonstration exploring the interaction between web application lifecycle states and the [WebMCP](https://github.com/webmachinelearning/webmcp) (Web Model Context Protocol) specification.

Live Demo: **[https://andreban.github.io/webmcp-checkout/](https://andreban.github.io/webmcp-checkout/)**

---

## Background & Problem Statement

In modern React web applications, business logic is asynchronous and decoupled from event handlers:

1. **`setState` is fire-and-forget:** Calling `setCoupon(code)` returns immediately (`void`).
2. **Side-effects run in `useEffect` or React Query:** Network recalculations (taxes, shipping, discounts) execute asynchronously in the background.
3. **The DOM protects human users:** Human users are protected by disabled buttons (`<button disabled={isCalculating}>Checkout</button>`).
4. **AI Agents bypass DOM buttons:** When an AI agent interacts via WebMCP, it invokes tools directly through `document.modelContext` (or React hooks like [`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool)).
5. **The Missing Primitive:** WebMCP currently has no mechanism to communicate that an application is temporarily unready / busy with an async transition.

---

## The Core Experiment: Comparing Existing Approaches

This demo provides a live toggle to compare the two ways developers can handle this with existing WebMCP capabilities:

| Approach | Behavior | Agent Experience |
| :--- | :--- | :--- |
| **1. Without the Flag (Always Enabled)** | `checkout` remains registered with `enabled: true`. | 🚨 **Silent Overcharge:** Agent fires `checkout` before backend recalculation completes. Charges $100.00 instead of $50.00. |
| **2. With the Flag (`enabled: !isCalculating`)** | `checkout` is unregistered (`controller.abort()`) during the 4.0s recalculation. | 💥 **DOM Exceptions & Retries:** Tool vanishes from the browser. Agent hits Chrome `TypeError: The provided value is not of type 'RegisteredTool'` and must brute-force retry until re-registration. |

---

## Empirical Agent Logs

### Mode 1: Without the Flag (Default WebMCP)
```text
User: "Apply coupon SAVE50 to my cart and complete my purchase."
AI calling tool "set_coupon" with {"code":"SAVE50"}
Tool "set_coupon" result: {"success":true,"message":"Coupon code 'SAVE50' set."}
AI calling tool "checkout" with {}
Tool "checkout" result: {"orderId":"ORD-3838","amountCharged":100,"status":"COMPLETED"}
AI: "I've applied the coupon and placed your order ORD-3838 for $100.00."
```
*Result:* **The user was overcharged by $50.00** because checkout executed against stale React state.

---

### Mode 2: With the Flag (`enabled: !isCalculating`)
```text
User: "Apply coupon SAVE50 to my cart and complete my purchase."
AI calling tool "set_coupon" with {"code":"SAVE50"}
Tool "set_coupon" result: {"success":true,"message":"Coupon code 'SAVE50' set."}

AI calling tool "checkout" with {}
Tool "checkout" result: "The operation failed for an unknown transient reason."

AI calling tool "checkout" with {}
Tool "checkout" result: "Failed to execute 'executeTool' on 'ModelContext': The provided value is not of type 'RegisteredTool'."

AI calling tool "checkout" with {}
Tool "checkout" result: {"success":true,"orderId":"ORD-7257","amountCharged":50,"status":"COMPLETED"}
AI: "OK. The coupon 'SAVE50' has been applied, and your order (ORD-7257) has been placed for $50.00."
```
*Result:* Because `enabled: false` unregisters the tool, Chrome's internal C++ `ModelContext` throws a native `TypeError`. The agent succeeds only by brute-force spamming the tool until the 4.0s timer expires.

---

## Architecture

* **[`src/backend.ts`](./src/backend.ts):** Simulates remote backend services (`fetchCartQuote` for coupon calculation with 4.0s latency, and `submitOrder` for payment processing).
* **[`src/App.tsx`](./src/App.tsx):** Root React component exposing WebMCP tools via `useWebMCP`:
  * `set_coupon`: Sets the promo code in state and triggers decoupled recalculation.
  * `checkout`: Submits the order at the current cart total.
* **[`src/components/`](./src/components/):**
  * `Cart.tsx`: Interactive cart with item, promo code input, and disabled checkout button during calculation.
  * `PromptBox.tsx`: Suggested agent prompt with a 1-click clipboard copy button.
  * `ExperimentToggle.tsx`: Checkbox to toggle `enabled: !isCalculating`.
  * `ResultBanner.tsx`: Order receipt displaying actual billed vs expected price.

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
*(Configured with `base: './'` to run from any subdirectory, domain root, or GitHub Pages).*
