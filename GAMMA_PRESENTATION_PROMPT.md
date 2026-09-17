# Gamma AI Presentation Prompt

Copy and paste the prompt text below directly into **Gamma AI** (select **"Paste text"** -> **"Presentation"**) to generate your complete slide deck.

---

```text
Create a modern, professional, 12-slide presentation for a B.Tech Summer Internship Final Evaluation.

Topic: MSIL QA Lab Inventory Management System
Company: Maruti Suzuki India Limited (MSIL) - Quality Assurance Division
Presenter: Nitin Sain | Roll No: 23CSU223 | Department of Computer Science & Engineering, The NorthCap University, Gurugram
Internship Period: 19th May 2016 to 15th July 2016

Design & Visual Theme Guidelines:
- Clean, corporate, tech-focused design aesthetic.
- Color Palette: Deep Navy Blue (#0A2540), Slate Gray (#334155), Maruti Red Accent (#DC2626), and Clean White/Light Slate background.
- Typography: Clean sans-serif (Inter / Roboto). Use bold metrics, side-by-side cards, comparison tables, and visual icons.

Slide Breakdown & Content:

Slide 1: Title Slide (Cover)
- Main Title: MSIL QA Lab Inventory Management System
- Subtitle: Streamlining Chemical, Tool & Spare Parts Inventory Control for Automotive Quality Assurance
- Presenter Details: Nitin Sain (Roll No: 23CSU223), B.Tech CSE, The NorthCap University
- Organization: Quality Assurance Division, Maruti Suzuki India Limited (MSIL)

Slide 2: Company & Department Profile
- Company Overview: Maruti Suzuki India Limited (MSIL) — India's leading passenger vehicle manufacturer with over 50% market share.
- Department: Quality Assurance (QA) Division & Testing Labs (Gurugram Plant).
- Lab Operations: Material testing, chemical analysis, component validation, emission compliance, and metallurgy testing.
- Key Assets Managed: Chemicals, reagents, precision tools, equipment spares, industrial gases, and Certified Reference Materials (CRMs).

Slide 3: Problem Statement & Motivation
- Legacy Challenges: Manual logbooks and Excel spreadsheets led to untracked stock and human errors.
- Chemical Expiration Risks: Risk of using expired chemical reagents during vehicle component testing.
- Stockout Bottlenecks: Delayed component validation due to unexpected shortages of testing solvents or spares.
- Lack of Audit Trails: Inability to track who consumed or borrowed items during component testing.

Slide 4: Project Objectives & Core Solutions
- Objective: Build a web-based, real-time inventory management platform tailored for MSIL QA Labs.
- Real-Time Stock Tracking: Instant recalculation of stock status (In Stock, Low Stock, Out of Stock, Expired).
- Automated Alerts: Early warnings for near-expiry chemicals and low-stock items.
- QR Code Labeling: Custom vector SVG QR code generation for asset tagging.
- Complete Audit Logging: Thread-safe per-request user activity tracking.

Slide 5: Technology Stack & System Architecture
- Frontend: Vanilla HTML5, CSS3 (Custom Variables), Vanilla JavaScript (ES6+), Vite Dev Server.
- Data Visualization & Styling: Chart.js for interactive analytics, Lucide Icons, Google Inter font.
- Backend REST API: Node.js + Express.js API framework running on Port 3001.
- Middleware & Logging: CORS, Express JSON parser, Node.js AsyncLocalStorage for context tracking.
- Database: Embedded JSON persistence engine (`inventory.db.json`) using Node.js `fs` module.

Slide 6: System Architecture & Workflow Diagram
- Decoupled Architecture: Vite Frontend (Port 5173) proxying `/api/*` requests to Express Backend (Port 3001).
- Workflow Steps:
  1. Lab User submits stock transaction (Inflow/Outflow).
  2. Express controller parses request & updates inventory array.
  3. Auto-status engine recalculates status (In Stock / Low Stock / Out of Stock / Expired).
  4. `AsyncLocalStorage` captures user context & appends record to Audit Log.
  5. `saveDB()` writes changes synchronously to `inventory.db.json`.

Slide 7: Key Features & Functional Modules
- Dynamic Dashboard: Real-time stat summary cards (Total Items, Stock Qty, Low Stock, Expired Count) and Chart.js visuals.
- Inventory Operations: Filterable data grid, search bar, stock inflow (+), stock outflow (-) forms.
- Vendor Directory: Centralized database of supplier contact info and procurement details.
- Audit Log System: Searchable log table recording user actions, timestamps, and target modules.

Slide 8: Custom Vector QR Code Generator Engine
- Innovation: Designed a zero-dependency client-side SVG QR code generator (`qr-generator.js`).
- Purpose: Generate printable QR labels for chemical reagent bottles, tool racks, and equipment storage bins.
- Technical Highlight: Mathematical module grid calculation converting item strings into lightweight vector SVG graphics ($< 1\text{ ms}$ rendering time).

Slide 9: Database Schema & REST API Endpoints
- Collections: `inventory_items`, `vendors`, `departments`, `users`, `stock_transactions`, `audit_logs`.
- Core REST API Endpoints:
  - `GET /api/stats` — Summary counts and category breakdown.
  - `GET /api/items` & `POST /api/items` — Fetch and create inventory items.
  - `POST /api/stock-transactions` — Record item consumption/replenishment.
  - `GET /api/audit-logs` — Retrieve system activity history.

Slide 10: Performance Benchmarks & Testing Results
- API Latency: Average response time $< 4.2\text{ ms}$ for `/api/items`.
- Data Persistence: 100% data integrity with sub-4ms JSON file write time.
- QR Generation Speed: $< 0.8\text{ ms}$ per code.
- Functional Testing: Passed all 6 major UAT test scenarios with MSIL QA lab technicians.

Slide 11: Industrial & Social Impact
- Quality Compliance: Direct alignment with ISO/TS 16949 automotive quality standards.
- Environmental Impact: Reduced hazardous chemical waste by identifying near-expiry reagents early.
- Operational Efficiency: Zero testing downtime caused by unexpected reagent or spare part stockouts.

Slide 12: Learning Outcomes & Future Enhancements
- Technical Key Takeaways: REST API design, Node.js async context tracking, Vite bundler setup, clean UI architecture.
- Non-Technical Learnings: Corporate QA workflows, cross-department collaboration, software documentation.
- Future Scope: Migration to PostgreSQL, JWT-based authentication, real-time WebSocket alerts.
- Closing Slide: Thank You | Q&A | Acknowledgements to MSIL Mentors & The NorthCap University.
```
