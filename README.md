# MSIL QA Lab Inventory Dashboard

Premium Enterprise Inventory Dashboard for Maruti Suzuki - a full-stack web application for QA Lab inventory management.

## 📋 Overview

This system digitizes, monitors, and automates inventory control for laboratory chemicals, equipment spare parts, precision tools, industrial gases, and Certified Reference Materials (CRMs) at Maruti Suzuki India Limited QA Division.

## 🚀 Live Demo

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`
- **Health Check:** `http://localhost:3001/api/health`

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|------|-----------|---------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) | Lightweight UI without framework overhead |
| **Frontend Bundler** | Vite | Fast dev server (`http://localhost:5173`) & asset bundling |
| **Backend Runtime** | Node.js | Asynchronous JavaScript execution |
| **Backend Framework** | Express.js | REST API endpoints (`http://localhost:3001`) |
| **Middleware** | CORS, express.json, AsyncLocalStorage | Cross-origin requests, JSON parsing, per-request user context |
| **Data Persistence** | File-based JSON (`inventory.db.json`) | Fast, zero-config embedded data store |
| **Data Visualization** | Chart.js | Interactive stock breakdown charts |
| **UI Icons** | Lucide Icons | Clean, modern icon set |
| **Fonts** | Google Inter | Semantic font scale |
| **QR Codes** | Custom SVG Generator (`qr-generator.js`) | Client-side vector QR code rendering (no external dependencies) |

## 🏃‍♂️ How to Run

### Prerequisites
- Node.js 16+
- npm 8+

### Start the Application

**Terminal 1 - Backend API (port 3001):**
```powershell
cd C:\inventory\inventory
npm run server
# or: node server.js
```

**Terminal 2 - Frontend Development Server (port 5173):**
```powershell
cd C:\inventory\inventory
npm run dev
# or: vite --host
```

### Open in Browser
Navigate to: `http://localhost:5173`

### Login Credentials
- **Email:** `admin@qa.com`
- **Password:** `maruti2026`

*(If login fails, the system creates a fallback user dynamically)*

### Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite frontend dev server |
| `npm run build` | Build production bundle (`dist/`) |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express backend API |
| `npm start` | Alias for `node server.js` |

## 📦 Project Structure

```
inventory/
├─ app.js              # Main application script (fetch API, modals, forms, charts)
├─ package.json        # Dependencies + scripts
├─ server.js           # Express + json database backend
├─ vite.config.js      # Vite config with /api proxy to :3001
├─ index.html          # Single page application
├─ style.css           # Custom properties, animations, responsive layout
├─ inventory.db.json   # File-based JSON database (auto-generated)
├─ qr-generator.js     # Custom vector SVG QR code generator
├─ assets/             # Images (logos, icons, placeholder photos)
├─ dist/               # Production build output
└─ scratch/            # Development scratch files
```

## ✨ Key Features

### Authentication & Session
- Login flow with animated loader transition
- Persistent user context via `AsyncLocalStorage`
- Logout clears session and resets UI

### Dashboard
- 4 statistic cards: Total Inventory, Low Stock Alerts, Out of Stock, Expired Standards
- 6 category mini-cards with stock summaries
- 8 Chart.js interactive graphs:
  - Category Distribution
  - Inventory Health Status
  - Monthly Transactions (Inflow vs Outflow)
  - Vendor Supply & Performance
  - Department Stock Allocation
  - Material Expiry Profile
  - Low Stock & Reorder Analysis
  - Stock Movement Trends

### Inventory Management
- **6 Category Modules:** Chemicals, CRMs, Equipment Consumables, Equipment Spares, Gases, Tools
- Each category: Add Stock, Remove Stock, Register Item, View List, Reports
- Auto status recalculation: `In Stock → Low Stock → Out of Stock → Expired`
- Search/filter/sort catalog (by name, category, status, department)
- Card view & Table view toggle

### Item Registration
- Full item metadata: ID, name, description, category, subcategory
- Vendor selection, location, manufacturer, PO number
- Expiry date, batch number, size, unit
- Image upload (base64 or URL)
- Auto-generated item ID: `${prefix}-${rand}` (e.g., `CHEM-DEG-3091`)
- QR code: `MSIL-QA-${itemId}`

### Stock Transactions
- **Inflow:** Add stock with quantity, location, vendor, batch, remarks
- **Outflow:** Issue stock with department, user, approver, reason
- Auto-updates item status after each transaction
- Transaction history per item

### QR Code Suite
- Generate SVG QR labels for any item by ID or custom text
- Print QR labels (`window.print()`)
- Download simulated PNG
- Scan simulator: click any item to "scan" and view detail modal

### Reports Engine
- **Master Report:** All items with SKU, name, category, qty, location, vendor, status
- **Low Stock & Reorder Alert:** Items below min threshold
- **Expired & Expiry Compliance:** Batches expired or expiring soon
- **Vendor Delivery & Performance:** Contact info, ratings, status
- **Department Usage & Allocation:** Active SKUs, allocated units
- **Category Analytics:** Distribution across 6 categories
- Export: CSV, Excel, PDF (print)

### Vendor Registry
- View all vendors with contact info, ratings, categories
- Add/update vendors via API
- Delete vendors

### Audit Logging
- Full audit trail of all actions (who, what, when)
- Auto-logs: item registration, stock changes, vendor updates, user logins
- Searchable via `/api/audit`

### Admin & System
- User management
- Department management
- System statistics (`/api/stats`)
- Health check endpoint

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/items` | Fetch all inventory items |
| `GET` | `/api/items/:id` | Fetch single item |
| `POST` | `/api/items` | Register new item |
| `PUT` | `/api/items/:id` | Update item |
| `DELETE` | `/api/items/:id` | Delete item |
| `POST` | `/api/items/:id/add-stock` | Add stock quantity |
| `POST` | `/api/items/:id/remove-stock` | Remove stock quantity |
| `GET` | `/api/vendors` | Fetch all vendors |
| `POST` | `/api/vendors` | Add/update vendor |
| `DELETE` | `/api/vendors/:code` | Delete vendor |
| `GET` | `/api/departments` | Fetch all departments |
| `GET` | `/api/users` | Fetch all users |
| `GET` | `/api/transactions` | Fetch stock transactions (last 100) |
| `GET` | `/api/audit` | Fetch audit logs (last 200) |
| `GET` | `/api/stats` | System statistics summary |
| `GET` | `/api/health` | Health check |

Proxy: Vite forwards `/api/*` → `http://localhost:3001`

## 📊 Database (`inventory.db.json`)

Persistence layer using synchronous `fs` operations. Collections:

- `inventory_items` - All lab items (65+ sample items seeded)
- `vendors` - Supplier directory (6 vendors)
- `departments` - QA departments (6 departments)
- `users` - System users (4 users)
- `stock_transactions` - Inflow/outflow transaction history
- `audit_logs` - Full audit trail

**Note:** `sql.js` is installed but intentionally bypassed - JSON file avoids WASM loading for faster, simpler deployment.

## 📝 License

This project is for enterprise use at Maruti Suzuki India Limited. For internal QA Lab inventory management.

## 👨‍💻 Developer

**Nitin Sain** - Summer Internship Project  
MSIL QA Lab Inventory Management System  
The NorthCap University, Gurugram

---

*Built with ❤️ using Node.js, Express, Vite, and Vanilla JavaScript*