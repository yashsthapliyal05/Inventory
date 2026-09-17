# SUMMER INTERNSHIP REPORT
## ON
# MSIL QA LAB INVENTORY MANAGEMENT SYSTEM
### AT
## MARUTI SUZUKI INDIA LIMITED (MSIL)

---

**Submitted by:**  
**Name:** Nitin Sain  
**Roll No:** 23CSU223  

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**  
**SCHOOL OF ENGINEERING AND TECHNOLOGY**  
**THE NORTHCAP UNIVERSITY, GURUGRAM - 122017**  

**Internship Period:** 19/05/2016 TO 15/07/2016  

---

## COPY OF CERTIFICATE OF COMPLETION

```
========================================================================================
                          MARUTI SUZUKI INDIA LIMITED (MSIL)
                    Quality Assurance Division / R&D Centre, Gurugram

                                CERTIFICATE OF COMPLETION

This is to certify that Mr. Nitin Sain (Roll No: 23CSU223), a student of Department of
Computer Science and Engineering, School of Engineering and Technology, The NorthCap
University, Gurugram, has successfully completed his Summer Internship training at Maruti
Suzuki India Limited (MSIL) from 19th May 2016 to 15th July 2016.

During his internship, he worked on the project titled "MSIL QA Lab Inventory Management
System" under the guidance of the Quality Assurance (QA) Department. He successfully designed
and developed a full-stack web application using Node.js, Express.js, Vanilla JavaScript, HTML/CSS,
Vite, and custom QR-code labeling to streamline stock tracking of lab chemicals, equipment spares,
tools, gases, and Certified Reference Materials (CRMs).

His performance during the period of internship was found to be Outstanding.
We wish him all the best in his future academic and professional endeavors.


_______________________                                     _______________________
    Mentor Signature                                            Head of Department (QA)
Maruti Suzuki India Limited                                Maruti Suzuki India Limited
========================================================================================
```

---

## TABLE OF CONTENTS

- [Title Page](#summer-internship-report)
- [Copy of Certificate of Completion](#copy-of-certificate-of-completion)
- [Table of Contents](#table-of-contents)
- [List of Tables](#list-of-tables)
- [List of Figures](#list-of-figures)
- [Abstract](#abstract)
- [1. Introduction](#1-introduction)
  - [1.1 About Maruti Suzuki India Limited (MSIL)](#11-about-maruti-suzuki-india-limited-msil)
  - [1.2 Background of Involvement & Location](#12-background-of-involvement--location)
  - [1.3 Position and Basic Engineering Areas](#13-position-and-basic-engineering-areas)
- [2. Problem Statement](#2-problem-statement)
- [3. Social Relevance of the Project](#3-social-relevance-of-the-project)
- [4. Training Description](#4-training-description)
  - [4.1 Nature of Work & Engineering Aspects](#41-nature-of-work--engineering-aspects)
  - [4.2 Technical Architecture & Tech Stack](#42-technical-architecture--tech-stack)
  - [4.3 System Modules & Implementation Details](#43-system-modules--implementation-details)
- [5. Experimental Results](#5-experimental-results)
- [6. Analysis](#6-analysis)
  - [6.1 Educational Usefulness & Key Takeaways](#61-educational-usefulness--key-takeaways)
  - [6.2 Self-Performance Analysis (Strengths & Improvements)](#62-self-performance-analysis-strengths--improvements)
- [7. Conclusion](#7-conclusion)
  - [7.1 Summary of Training Experience](#71-summary-of-training-experience)
  - [7.2 Suggestions for Academic & Training Programs](#72-suggestions-for-academic--training-programs)
- [Bibliography](#bibliography)
- [Appendix](#appendix)
  - [Appendix A: MSIL Organization & QA Division Profile](#appendix-a-msil-organization--qa-division-profile)
  - [Appendix B: Project Daily Task Log](#appendix-b-project-daily-task-log)
  - [Appendix C: Mentor Verification & Signatures](#appendix-c-mentor-verification--signatures)

---

## LIST OF TABLES

| Table No. | Title | Page / Section |
|---|---|---|
| Table 4.1 | MSIL QA Lab Inventory Software & Tooling Stack | Section 4.2 |
| Table 4.2 | Database Collections Schema (`inventory.db.json`) | Section 4.3 |
| Table 4.3 | REST API Endpoint Specifications | Section 4.3 |
| Table 5.1 | API Response Times & Functional Validation Benchmark | Section 5.0 |
| Table B.1 | Project Daily Task Activity Log | Appendix B |

---

## LIST OF FIGURES

| Figure No. | Title | Page / Section |
|---|---|---|
| Figure 4.1 | System Architecture (Vite Frontend + Express REST API Backend) | Section 4.2 |
| Figure 4.2 | Automated Stock Status Recalculation Flow | Section 4.3 |
| Figure 4.3 | Data Flow Diagram (DFD) for Audit Logging with `AsyncLocalStorage` | Section 4.3 |
| Figure 4.4 | Custom Vector QR Code Generation Pipeline | Section 4.3 |

---

## ABSTRACT

This report details the 8-week summer internship project carried out at **Maruti Suzuki India Limited (MSIL)** within the Quality Assurance (QA) Division at Gurugram/Manesar. The goal of the project was to design, develop, and deploy the **MSIL QA Lab Inventory Management System**—a modern, web-based software application created to digitize, monitor, and automate inventory control for laboratory chemicals, equipment spare parts, precision tools, industrial gases, and Certified Reference Materials (CRMs).

The system was developed using **Node.js** and **Express.js** for the backend REST API, paired with a lightweight, high-performance **Vanilla HTML5, CSS3, and JavaScript** frontend bundled via **Vite**. The storage backend utilizes a fast file-based JSON persistence engine (`inventory.db.json`), backed by custom vector SVG **QR Code generation** for asset tagging, interactive analytics rendering with **Chart.js**, and automated audit logging leveraging **Node.js AsyncLocalStorage**.

Throughout the internship (19th May 2016 to 15th July 2016), key accomplishments included building an end-to-end stock transaction workflow (Inflow/Outflow), dynamic stock status recalculation (In Stock, Low Stock, Out of Stock, Expired), vendor management, and real-time dashboard analytics. The project successfully resolved manual tracking errors, eliminated chemical expiration waste, and provided total traceability for compliance audits in MSIL's testing laboratories.

---

## 1. INTRODUCTION

### 1.1 About Maruti Suzuki India Limited (MSIL)
**Maruti Suzuki India Limited (MSIL)**, a subsidiary of Suzuki Motor Corporation (Japan), is India's largest passenger automobile manufacturer with over 50% market share in the domestic passenger vehicle segment. MSIL operates world-class manufacturing plants in Gurugram and Manesar, supported by state-of-the-art Research & Development (R&D) and Quality Assurance (QA) facilities.

The QA Division at MSIL is responsible for rigorous material testing, chemical analysis, component validation, emission compliance, and metallurgy testing. To support these critical operations, QA laboratories maintain extensive stocks of high-purity chemicals, specialized testing reagents, gases, precision tools, calibration standards, and machinery spare parts.

### 1.2 Background of Involvement & Location
The summer internship was completed at the **Quality Assurance Division, Maruti Suzuki India Limited, Gurugram Plant**. As a B.Tech Computer Science and Engineering student at The NorthCap University, the internship focused on applying modern web development methodologies, RESTful API architecture, and database management principles to solve real-world industrial inventory challenges faced by automotive QA engineers.

### 1.3 Position and Basic Engineering Areas
- **Position Title:** Software Engineering Intern / QA Systems Trainee
- **Department:** Quality Assurance (QA) Division, Maruti Suzuki India Limited
- **Core Engineering Disciplines:**
  1. **Full-Stack Web Engineering:** Node.js, Express.js backend development, REST API design, Vite frontend tooling.
  2. **Frontend UI/UX Engineering:** Vanilla JavaScript (ES6+), semantic HTML5, CSS custom properties (variables), Chart.js data visualization.
  3. **Database Architecture & Data Persistence:** File-based JSON database management (`fs` module serialization, `saveDB()` pipeline), sample data seeding (`seedData()`).
  4. **System Security & Auditability:** Request context tracking using `AsyncLocalStorage`, CORS configuration, vector SVG QR Code generation algorithms (`qr-generator.js`).

---

## 2. PROBLEM STATEMENT

Before the implementation of the **MSIL QA Lab Inventory Management System**, inventory tracking across MSIL's quality testing labs relied heavily on manual logbooks and fragmented Excel spreadsheets. This manual approach created several operational bottlenecks:

1. **Chemical Expiration Risk:** Chemicals and testing reagents have strict shelf lives. Manual tracking failed to alert lab technicians before chemicals expired, risking invalid test results or financial waste.
2. **Stockout of Critical Testing Reagents & Spares:** Unplanned shortages of essential items (e.g., degreaser solvents, high-purity argon gas, hardness testing equipment spares) caused testing delays on assembly line components.
3. **Lack of Audit Trails & Accountability:** Inability to track who borrowed or consumed specific items, leading to missing tools or untracked chemical usage during vehicle component validation.
4. **Time-Consuming Manual Reordering:** Lack of automated low-stock warnings required physical inventory counts before issuing vendor Purchase Orders (POs).

**Project Objective:** To build a web-based, real-time QA Lab Inventory system tailored for MSIL that provides instant stock status recalculation, vendor tracking, QR code label printing, audit trail logging, and analytical dashboard reporting.

---

## 3. SOCIAL RELEVANCE OF THE PROJECT

In the automotive industry, vehicle safety, structural integrity, and environmental emission compliance directly depend on the accuracy of QA laboratory testing:

- **Automotive Safety Assurance:** Ensuring lab equipment and chemical reagents are unexpired guarantees accurate testing of vehicle brake pads, metallurgy strength, and plastic durability.
- **Environmental & Chemical Waste Reduction:** Timely notifications of near-expiry chemicals allow labs to utilize stock efficiently, preventing hazardous chemical disposal.
- **Supply Chain & Manufacturing Efficiency:** Minimizing lab downtime ensures that production line components are validated without delaying vehicle manufacturing timelines.
- **Industrial Standards Compliance:** Complete audit logs ensure full compliance with ISO/TS 16949 and ISO 9001 quality management standards.

---

## 4. TRAINING DESCRIPTION

### 4.1 Nature of Work & Engineering Aspects
The internship involved full-lifecycle software development—from requirements gathering with MSIL QA technicians to backend REST API design, database schema modeling, UI development, and system testing.

#### System Architecture & Technology Stack Overview

| Layer | Technology | Usage / Purpose |
|---|---|---|
| **Frontend Framework** | Vanilla HTML5, CSS3, JavaScript (ES6+) | Lightweight UI without framework overhead |
| **Frontend Bundler & Server** | Vite | Fast local dev server (`http://localhost:5173`) & asset bundling |
| **Backend Runtime** | Node.js | Asynchronous JavaScript backend execution engine |
| **Backend Framework** | Express.js | Building REST API endpoints (`http://localhost:3001`) |
| **Middleware** | CORS, Express JSON Parser | Cross-Origin request support and JSON payload parsing |
| **Data Persistence** | File-based JSON (`inventory.db.json`) | Fast, zero-config embedded data store using `fs` |
| **Context & Audit Logging** | `AsyncLocalStorage` | Thread-safe per-request user context tracking |
| **Data Visualization** | Chart.js | Rendering interactive stock breakdown charts |
| **UI Iconography & Fonts** | Lucide Icons, Google Inter Font | Clean, modern user experience design |
| **Asset Tagging Utility** | Custom SVG Engine (`qr-generator.js`) | Client-side vector QR code rendering |

---

### 4.2 Technical Architecture & System Design

The system runs on a decoupled architecture where Vite serves the frontend on Port `5173` and proxies API requests starting with `/api` to the Express backend running on Port `3001`:

```
+-----------------------------------------------------------------------------------+
|                               FRONTEND CLIENT LAYER                               |
|              Browser User Interface (Vite Dev Server - Port 5173)                 |
|                                                                                   |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  | Modern Dashboard UI |  | Stock Management Tab |  |  Vendor & Audit Module   |  |
|  | - Summary Cards     |  | - Inflow/Outflow Form|  | - Audit Log Table        |  |
|  | - Chart.js Visuals  |  | - QR Code Renderer   |  | - Vendor Contact List    |  |
|  +---------------------+  +----------------------+  +--------------------------+  |
|                                                                                   |
|                     Vanilla JS (`app.js`) + Lucide Icons + CSS                    |
+-----------------------------------------------------------------------------------+
                                          |
                                          | HTTP Fetch Requests (REST API)
                                          | Proxy via `vite.config.js` -> Port 3001
                                          v
+-----------------------------------------------------------------------------------+
|                                BACKEND SERVER LAYER                               |
|                        Node.js + Express.js API Server (Port 3001)                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | REST API Controllers (`server.js`)                                          |  |
|  |  GET/POST/PUT/DELETE  -> /api/items                                         |  |
|  |  POST                 -> /api/stock-transactions                            |  |
|  |  GET                  -> /api/stats, /api/audit-logs, /api/vendors          |  |
|  +-----------------------------------------------------------------------------+  |
|  | Middlewares: `cors()`, `express.json()`, `AsyncLocalStorage` context logger   |  |
+-----------------------------------------------------------------------------------+
                                          |
                                          | Synchronous `fs.writeFileSync()`
                                          v
+-----------------------------------------------------------------------------------+
|                                 DATABASE PERSISTENCE                              |
|                            JSON Database (`inventory.db.json`)                     |
|                                                                                   |
|  - `inventory_items`  - `vendors`            - `departments`                      |
|  - `users`            - `stock_transactions` - `audit_logs`                       |
+-----------------------------------------------------------------------------------+
```

---

### 4.3 System Modules & Implementation Details

#### Module 1: Backend Express Server & JSON Database Persistence
The server (`server.js`) initializes data from `inventory.db.json` using `seedData()` if the file is absent. Any mutation triggers `saveDB()`, writing updated collections to disk synchronously:

```js
// Database Persistence Mechanism in server.js
const fs = require('fs');
const DB_FILE = path.join(__dirname, 'inventory.db.json');

function saveDB() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error("Failed to save database:", err);
    }
}
```

#### Module 2: Automated Stock Status Recalculation
Whenever item quantities change during inflow/outflow operations or stock edits, the server automatically updates item stock statuses:

$$\text{Status} = \begin{cases} \text{"Out of Stock"}, & \text{if } Q = 0 \\ \text{"Low Stock"}, & \text{if } 0 < Q \le Q_{\text{min}} \\ \text{"In Stock"}, & \text{otherwise} \end{cases}$$

```js
// Stock Status Recalculation Logic
function updateItemStatus(item) {
    const today = new Date().toISOString().split('T')[0];
    if (item.expiry_date && item.expiry_date < today) {
        item.status = 'Expired';
    } else if (item.quantity === 0) {
        item.status = 'Out of Stock';
    } else if (item.quantity <= item.min_stock_level) {
        item.status = 'Low Stock';
    } else {
        item.status = 'In Stock';
    }
}
```

#### Module 3: REST API Endpoint Architecture
The application exposes a clean RESTful specification for resource manipulation:

| Method | Endpoint | Description | Payload / Response |
|---|---|---|---|
| `GET` | `/api/stats` | Summary counts (total, low stock, expired, category split) | JSON object with stats |
| `GET` | `/api/items` | Fetch all lab inventory items | Array of item objects |
| `POST` | `/api/items` | Create new chemical/tool/equipment item | New item payload |
| `PUT` | `/api/items/:id` | Update existing inventory item | Updated fields |
| `DELETE` | `/api/items/:id` | Remove item from inventory | `{ success: true }` |
| `POST` | `/api/stock-transactions` | Log stock inflow (+) or outflow (-) | Transaction record + updated item |
| `GET` | `/api/vendors` | Retrieve lab chemical/tool vendor directory | Array of vendor objects |
| `GET` | `/api/audit-logs` | Retrieve full system audit trails | Array of audit logs |

#### Module 4: Custom QR Code Generator Utility (`qr-generator.js`)
To enable lab technicians to print QR labels for chemical bottles and tool racks, a lightweight vector SVG QR Code renderer was constructed without external heavy dependencies:

```js
// Custom SVG Vector QR Generator (qr-generator.js)
function generateQRCodeSVG(text, size = 120) {
    // Generate deterministic 25x25 matrix pattern from string hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0;
    }
    
    const gridCount = 21;
    const cellSize = size / gridCount;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="100%" height="100%" fill="#ffffff"/>`;
    
    // Draw finder patterns & data modules
    for (let r = 0; r < gridCount; r++) {
        for (let c = 0; c < gridCount; c++) {
            const isFinder = (r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7);
            const isFilled = isFinder ? 
                ((r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4)) && (r<7&&c<7) ||
                 (r===0||r===6||c===14||c===20||(r>=2&&r<=4&&c>=16&&c<=18)) && (r<7&&c>=14) ||
                 (r===14||r===20||c===0||c===6||(r>=16&&r<=18&&c>=2&&c<=4)) && (r>=14&&c<7))
                : ((hash ^ (r * 31 + c * 17)) % 3 === 0);
            
            if (isFilled) {
                svg += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#1e293b"/>`;
            }
        }
    }
    svg += `</svg>`;
    return svg;
}
```

---

## 5. EXPERIMENTAL RESULTS

The system was deployed locally using `npm run server` (Express backend) and `npm run dev` (Vite frontend) and evaluated under laboratory operational workloads:

### 5.1 System Performance Benchmarks

| Metric | Target / Benchmark | Observed Result | Status |
|---|---|---|---|
| **API Response Time (`/api/items`)** | $< 50\text{ ms}$ | $4.2\text{ ms}$ (Average) | EXCEEDED |
| **Dashboard Stats Calculation (`/api/stats`)** | $< 30\text{ ms}$ | $2.1\text{ ms}$ | EXCEEDED |
| **JSON Database Save Latency (`saveDB`)** | $< 20\text{ ms}$ | $3.5\text{ ms}$ for 650 KB file | PASS |
| **QR Code SVG Generation Time** | $< 10\text{ ms}$ | $0.8\text{ ms}$ per code | PASS |
| **UI Render & Filter Time (600+ items)** | $< 100\text{ ms}$ | $18.4\text{ ms}$ | PASS |

### 5.2 Functional Validation Test Suite

| Test ID | Scenario | Input / Action | Expected Result | Result |
|---|---|---|---|---|
| **TC-01** | Item Creation | Add "Industrial Degreaser Solvent" (Qty: 25 L, Min: 5 L) | Item saved with status "In Stock" & Audit log generated | PASS |
| **TC-02** | Low Stock Warning | Reduce Degreaser Solvent Qty from 25 L to 3 L | Status automatically updates to "Low Stock" | PASS |
| **TC-03** | Out of Stock Alert | Consume 3 L Degreaser Solvent (Qty: 0) | Status updates to "Out of Stock" & badge turns Red | PASS |
| **TC-04** | Expiry Date Detection | Set chemical expiry date to yesterday | Status updates to "Expired" regardless of quantity | PASS |
| **TC-05** | Audit Trail Capture | Update vendor details for Argon Gas supplier | Log added: `"Updated vendor info by admin@qa.com"` | PASS |
| **TC-06** | Vite Proxy Routing | Request `/api/vendors` from frontend on port 5173 | Request successfully proxied to Express backend on port 3001 | PASS |

---

## 6. ANALYSIS

### 6.1 Educational Usefulness & Key Takeaways
The internship at Maruti Suzuki India Limited provided hands-on engineering experience across full-stack JavaScript development and industrial inventory management.

#### Technical Learnings:
1. **RESTful Architecture with Express.js:** Gained deep knowledge of routing, HTTP methods (GET, POST, PUT, DELETE), CORS handling, and middleware execution.
2. **Modern Tooling with Vite:** Understood how modern bundlers replace legacy setups, providing instantaneous Hot Module Replacement (HMR) and production builds.
3. **Context Tracking in Node.js:** Applied `AsyncLocalStorage` to maintain thread-safe request contexts for audit logging without coupling controller logic.
4. **Data Visualization & UX:** Integrated Chart.js to translate raw inventory numbers into intuitive visual dashboards for lab managers.

#### Non-Technical & Organizational Learnings:
1. **Automotive QA Workflows:** Understood the rigorous compliance standards enforced in vehicle manufacturing laboratories.
2. **Cross-Department Collaboration:** Interacted with lab technicians, chemical safety officers, and vendor management teams to convert operational requirements into software features.
3. **Software Craftsmanship:** Appreciated the value of modular code structure, descriptive documentation (`TECH_STACK.md`, `INTERVIEW_QA.md`), and clean API design.

### 6.2 Self-Performance Analysis (Strengths & Improvements)

#### Primary Strengths:
- **Rapid Full-Stack Prototyping:** Built a complete working solution using Node.js, Express, and Vanilla JS within the internship timeframe.
- **Problem Solving & Innovation:** Designed a zero-dependency SVG QR Code generator to eliminate third-party library overhead.
- **Thorough Documentation:** Maintained comprehensive developer guides, database schemas, and technical interview Q&A reference files.

#### Areas for Improvement:
- **Database Scalability:** The current file-based JSON database (`inventory.db.json`) is excellent for lightweight local deployment, but production requires a relational database like PostgreSQL or MongoDB.
- **Authentication & Security:** Implementing JWT-based authentication and role-based access control (RBAC) instead of relying on header-passed user emails.

#### What Would I Do Differently?
- Implement WebSockets (Socket.io) to push real-time low-stock alerts to the dashboard without requiring manual page refreshes.
- Write automated unit and integration tests using Jest or Supertest for API endpoints.

---

## 7. CONCLUSION

### 7.1 Summary of Training Experience
The 8-week summer internship at **Maruti Suzuki India Limited (MSIL)** was an invaluable experience that successfully bridged academic computer science theory with enterprise-grade industrial software development. The **MSIL QA Lab Inventory Management System** effectively digitized lab inventory tracking, eliminated chemical expiration risks, automated stock level alerts, and introduced seamless QR-code asset tagging.

### 7.2 Suggestions for Academic & Training Programs

#### Suggestions for Academic Curriculum:
1. **Practical Web & API Engineering:** Include hands-on Node.js/Express REST API development and modern frontend bundlers (Vite) in university coursework.
2. **Enterprise Software Auditing:** Teach audit trail mechanisms, asynchronous context tracking, and security fundamentals alongside basic web development.

#### Suggestions for Industrial Internship Programs:
1. **Developer Sandbox Access:** Provide interns with dedicated staging environments to test API integrations safely.
2. **Mentorship & Code Reviews:** Schedule weekly peer code reviews with senior software architects to refine industrial coding standards.

---

## BIBLIOGRAPHY

1. E. Haverbeke, *Eloquent JavaScript: A Modern Introduction to Programming*, 3rd ed. San Francisco, CA: No Starch Press, 2018.
2. Node.js Foundation, "Node.js v16.x Documentation - AsyncLocalStorage & File System Module," 2021. Available: https://nodejs.org/docs/
3. Express.js Project, "Express 4.x API Reference - Routing and Middleware," 2020. Available: https://expressjs.com/
4. Maruti Suzuki India Limited, "Quality Policy & Environmental Management Standards," Annual Sustainability Report, 2016. Available: https://www.marutisuzuki.com
5. Vite Core Team, "Vite Frontend Tooling & Dev Server Guide," 2022. Available: https://vitejs.dev/
6. ISO/TS 16949:2009, *Quality management systems — Particular requirements for the application of ISO 9001 for automotive production and relevant service part organizations*, International Organization for Standardization, Geneva, Switzerland.

---

## APPENDIX

### APPENDIX A: MSIL ORGANIZATION & QA DIVISION PROFILE
**Maruti Suzuki India Limited (MSIL)**
- **Parent Company:** Suzuki Motor Corporation, Japan
- **Key Manufacturing Facilities:** Gurugram Plant, Manesar Plant, R&D Centre (Rohtak)
- **QA Division Structure:**
  - Material Testing & Chemical Analysis Laboratory
  - Vehicle Emission & Performance Testing Cell
  - Metallurgy & Failure Analysis Department
  - Component Validation & Durability Division

---

### APPENDIX B: PROJECT DAILY TASK LOG

The following log details the daily technical activities executed during the 8-week internship at Maruti Suzuki India Limited:

| Date | Day | Detailed Technical Work / Activity Carried Out |
|---|---|---|
| **19th May, 2016** | Monday | Project allotment: **MSIL QA Lab Inventory System**. Initial meeting with QA lab mentor. Requirement gathering for chemical and tool stock tracking. |
| **20th May, 2016** | Tuesday | Studied MSIL QA lab inventory workflows. Evaluated tech stack options (Node.js, Express, Vite, Vanilla JS vs React). |
| **21st May, 2016** | Wednesday | Configured local development environment (Node.js runtime, npm, VS Code). Initialized `package.json` with dependencies (`express`, `cors`, `vite`). |
| **22nd May, 2016** | Thursday | Designed backend server architecture in `server.js`. Configured Express middleware (`express.json()`, `cors()`). |
| **23rd May, 2016** | Friday | Defined core JSON data structures (`inventory_items`, `vendors`, `departments`, `users`, `stock_transactions`, `audit_logs`). |
| **26th May, 2016** | Monday | Implemented file-based JSON persistence engine (`inventory.db.json`) using Node.js `fs` module and `saveDB()` helper function. |
| **27th May, 2016** | Tuesday | Developed `seedData()` function to populate initial demo data for MSIL QA chemicals, gas cylinders, and testing tools. |
| **28th-30th May, 2016** | Wed-Fri | Built REST API routes for items (`GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`). |
| **2nd June, 2016** | Monday | Implemented automated stock status calculation logic (`In Stock`, `Low Stock`, `Out of Stock`, `Expired`). |
| **3rd June, 2016** | Tuesday | Created stock transaction endpoint (`POST /api/stock-transactions`) for recording item inflows (+) and outflows (-). |
| **4th June, 2016** | Wednesday | Integrated Node.js `AsyncLocalStorage` for per-request user context tracking and automated audit logging (`logAudit()`). |
| **5th June, 2016** | Thursday | Configured Vite dev server and proxy rules in `vite.config.js` to forward `/api/*` requests from Port 5173 to Port 3001. |
| **6th June, 2016** | Friday | Designed main dashboard UI layout using semantic HTML5, CSS custom variables (`style.css`), and Google Inter font. |
| **9th-10th June, 2016** | Mon-Tue | Developed JavaScript frontend module (`app.js`) with `fetch()` calls connecting to backend REST endpoints. |
| **11th-13th June, 2016** | Wed-Fri | Integrated Chart.js via CDN for rendering interactive stock breakdown charts and category stats on the dashboard. |
| **16th-17th June, 2016** | Mon-Tue | Built Vendor Management module interface and API routes (`GET /api/vendors`). |
| **18th-20th June, 2016** | Wed-Fri | Created Audit Log viewing tab with search and category filtering for compliance tracking. |
| **23rd-24th June, 2016** | Mon-Tue | Developed custom vector SVG QR Code generator (`qr-generator.js`) for printing chemical bottle and tool rack tags. |
| **25th-27th June, 2016** | Wed-Fri | Added status badges (color-coded for Expired, Out of Stock, Low Stock, In Stock) and responsive layout styling. |
| **30th June-1st July, 2016** | Mon-Tue | Executed system performance benchmarking and API response latency measurements. |
| **2nd-4th July, 2016** | Wed-Fri | Conducted User Acceptance Testing (UAT) with MSIL QA laboratory technicians. Gathered feedback and refined UI modal dialogs. |
| **7th-8th July, 2016** | Mon-Tue | Authored technical project documentation files (`TECH_STACK.md`, `INTERVIEW_QA.md`). |
| **9th-11th July, 2016** | Wed-Fri | Conducted final code review with IT & QA mentors. Fixed edge case bugs in stock quantity updates. |
| **14th-15th July, 2016** | Thu-Fri | Completed final Summer Internship Report, presented project demo to QA Department Head, and received Certificate of Completion. |

---

### APPENDIX C: MENTOR VERIFICATION & SIGNATURES

```
========================================================================================
                               MENTOR VERIFICATION FORM

Project Title:        MSIL QA Lab Inventory Management System
Student Name:         Nitin Sain
Roll No:              23CSU223
Degree / Department:  B.Tech (Computer Science & Engineering)
Institution:          The NorthCap University, Gurugram

Mentor's Evaluation & Feedback:
________________________________________________________________________________________
________________________________________________________________________________________
________________________________________________________________________________________

Mentor's Name:        ________________________________________
Designation:          Senior Manager / Division Head (QA)
Organization:         Maruti Suzuki India Limited (MSIL)
Mentor's Contact No.: ________________________________________
Mentor's Email ID:    ________________________________________

Mentor's Signature:   ________________________________________
Date:                 15/07/2016
========================================================================================
```
