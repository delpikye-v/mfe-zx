# 🌐 @delpi/mfe-zx

[![NPM](https://img.shields.io/npm/v/@delpi/mfe-zx.svg)](https://www.npmjs.com/package/@delpi/mfe-zx)
![Downloads](https://img.shields.io/npm/dt/@delpi/mfe-zx.svg)

[Live Demo](https://codesandbox.io/p/sandbox/c57cwd)

---

## ⚡ Description

**@delpi/mfe-zx** allows you to dynamically load and mount multiple independent frontend apps (MFEs) at runtime. It works with any framework (React, Vue, Svelte, Vanilla JS) without requiring build-time federation.

Features:

* Load and mount/unmount remote apps dynamically
* Share state between MFEs
* Synchronize routing
* Optional Shadow DOM isolation
* Event-driven intent system
* Dev HMR support

---

## 🛠 Installation

```bash
npm install @delpi/mfe-zx
# or
yarn add @delpi/mfe-zx
```

---

## 🚀 Usage

#### 1️⃣ Manual Mount / Unmount (Host controls remotes)

###### 1 Host (React)

```ts
// import { MFEHost, createSharedStore } from "@delpi/mfe-zx"
// const authStore = createSharedStore({ user: null })
// const host = new MFEHost({ stores: { auth: authStore } })
// async function init() {
//   const productRemote = await host.load("http://localhost:3001/remote.js", "productApp")
//   host.mount(productRemote, document.getElementById("product-root")!, "productApp", { isolate: true })
// }

// init()

import React from "react"
import { MFEHost, createSharedStore } from "@delpi/mfe-zx"

const authStore = createSharedStore({ user: null })

const host = new MFEHost({ stores: { auth: authStore } })

async function loadVanillaRemote() {
  const remote = await host.load("http://localhost:3001/remote.js", "productApp")
  host.mount(remote, document.getElementById("product-root")!, "productApp")
}

async function loadReactRemote() {
  const remote = await host.load("http://localhost:3002/remote.js", "cartApp")
  host.mount(remote, document.getElementById("cart-root")!, "cartApp")
}

export default function App() {
  return (
    <div>
      <h1>Host App (React)</h1>

      <button onClick={loadVanillaRemote}>Load Vanilla Remote</button>
      <div id="product-root" />

      <button onClick={loadReactRemote}>Load React Remote</button>
      <div id="cart-root" />
    </div>
  )
}
```

###### 2 Remote (Vanilla JS)

```ts
export function mount(el: HTMLElement) {
  const div = document.createElement("div")
  div.textContent = "Hello from Vanilla Remote"
  el.appendChild(div)
}

export function unmount(el: HTMLElement) {
  el.innerHTML = ""
}

;(window as any).productApp = { mount, unmount }
```

###### 3 Remote Example (React)

```ts
import React from "react"
import ReactDOM from "react-dom/client"

function App({ auth }: any) {
  return <div>Hello React Remote, user: {auth.user?.name ?? "Guest"}</div>
}

export function mount(el: HTMLElement, ctx: any) {
  const root = ReactDOM.createRoot(el)
  ;(el as any)._reactRoot = root
  root.render(<App auth={ctx.stores.auth.getState()} />)
}

export function unmount(el: HTMLElement) {
  const root = (el as any)._reactRoot
  root?.unmount()
  el.innerHTML = ""
}

;(window as any).cartApp = { mount, unmount }
```

---

#### 2️⃣ Intent-based (Dispatch intents → load/mount remotes)
```ts
import React from "react"
import { MFEHost, createIntentEngine, createIntentResolver } from "@delpi/mfe-zx"

// Host & intent engine
const host = new MFEHost({ stores: {} })
const intentEngine = createIntentEngine()

// Map intents → remotes
const intentMap = {
  OPEN_PRODUCT: {
    mfe: "productApp",
    url: "http://localhost:3001/remote.js",
    global: "productApp",
    target: () => document.getElementById("product-root")!,
  },
  OPEN_CART: {
    mfe: "cartApp",
    url: "http://localhost:3002/remote.js",
    global: "cartApp",
    target: () => document.getElementById("cart-root")!,
  }
}

// Bind intents
createIntentResolver(intentEngine, host, intentMap)

export default function App() {
  return (
    <div>
      <h1>Intent-based Host (React)</h1>

      <button onClick={() => intentEngine.dispatch("OPEN_PRODUCT")}>
        Open Vanilla Remote
      </button>
      <div id="product-root" />

      <button onClick={() => intentEngine.dispatch("OPEN_CART")}>
        Open React Remote
      </button>
      <div id="cart-root" />
    </div>
  )
}
```

---

#### 3️⃣ Dev HMR Support
###### Host Dev Reload
```ts
import { MFEHost } from "@delpi/mfe-zx"
import { createMFEReloadServer } from "@delpi/mfe-zx/dev"

const host = new MFEHost({})

const startDevReload = createMFEReloadServer(host, {
  productApp: {
    url: "http://localhost:3001/remote.js",
    global: "productApp",
    el: () => document.getElementById("product-root")!,
  },
  cartApp: {
    url: "http://localhost:3002/remote.js",
    global: "cartApp",
    el: () => document.getElementById("cart-root")!,
  }
})

// Only start dev reload in dev mode
if (import.meta.env.DEV) startDevReload()
```

###### Remote Dev Notify
```ts
import { setupMFEDefNotify } from "@delpi/mfe-zx/dev"

// Called in the remote app (productApp / cartApp)
setupMFEDefNotify({
  name: "productApp",       // unique remote name
  version: "dev",           // optional version
  wsUrl: "ws://localhost:3000/__mfe_reload"  // dev WS server
})
```

---

## 🧩 Shared State Example

```ts
import { createSharedStore } from "@delpi/mfe-zx"
const store = createSharedStore({ auth: { user: null } })
store.subscribe(state => console.log(state))
store.setState({ auth: { user: { id: 1, name: "Alice" } } })
```

---

## 📦 Router Example

```ts
import { createSharedRouter } from "@delpi/mfe-zx"
const router = createSharedRouter({ eventBus, name: "productApp" })
router.go("/checkout")
router.onChange(path => console.log("Navigated to", path))
```

---

## Micro-Frontend Runtime Comparison

| Feature / Lib                   | **@delpi/mfe-zx**  | Module Federation   | single-spa | qiankun     |
| ------------------------------- | -----------------  | ------------------- | ---------- | ----------- |
| Framework-agnostic              | ✅ Yes             | ❌ Mostly Webpack    | ✅ Yes      | ✅ Yes     |
| Runtime loading                 | ✅ Yes             | ❌ Build-time        | ✅ Yes      | ✅ Yes     |
| Shadow DOM / isolation          | ✅ Optional        | ❌ Not built-in      | ❌ No       | Partial    |
| Shared state / EventBus         | ✅ Yes             | ❌ Requires external | ✅ Yes      | ✅ Yes     |
| Dynamic mount/unmount           | ✅ Yes             | ❌ Build-time        | ✅ Yes      | ✅ Yes     |
| Dev HMR support                 | ✅ Yes             | ❌ Limited           | ⚠️ Plugin   | ⚠️ Plugin  |
| Build-time federation required? | ❌ No              | ✅ Yes               | ❌ No       | ❌ No      |

---


## Core Concepts

**Host-driven architecture**

- Each micro-frontend is an **independent app**
- The host coordinates loading, routing, and shared services
- No direct imports between micro-frontends

---

## 📝 License

MIT License
