# 📋 MSIL Inventory Dashboard — Interview Q&A
> 20 Short & Easy Questions with Answers

---

## 🟦 1. What is this project about?
**Answer:**
A **web-based inventory management system** for Maruti Suzuki QA Lab.
It tracks chemicals, tools, equipment spares, gases, and CRMs with stock levels, vendors, and audit logs.

---

## 🟦 2. What tech stack is used?
**Answer:**
- **Frontend:** HTML, CSS, Vanilla JavaScript (served by Vite)
- **Backend:** Node.js + Express.js
- **Database:** JSON file (inventory.db.json)
- **Dev Tool:** Vite (bundler + dev server)

---

## 🟦 3. On which ports does the app run?
**Answer:**
- **Frontend (Vite):** http://localhost:5173
- **Backend (Express API):** http://localhost:3001

---

## 🟦 4. What is Express.js?
**Answer:**
A lightweight **Node.js web framework** used to create REST API routes (GET, POST, PUT, DELETE) quickly and easily.

---

## 🟦 5. What is a REST API?
**Answer:**
A way for the frontend and backend to communicate over HTTP using standard methods:
- GET    → Read data
- POST   → Create data
- PUT    → Update data
- DELETE → Remove data

---

## 🟦 6. Why is a JSON file used instead of a real database?
**Answer:**
For **simplicity and portability** — no database installation needed.
inventory.db.json stores all data and is read/written using Node.js fs module.

---

## 🟦 7. What is saveDB() and when is it called?
**Answer:**
saveDB() **writes the in-memory data object to inventory.db.json** using fs.writeFileSync().
It is called after every add, update, or delete operation.

---

## 🟦 8. What is seedData()?
**Answer:**
A function that **fills the database with default demo data** (items, vendors, users, departments)
when the app runs for the first time and no DB file exists.

---

## 🟦 9. What is CORS and why is it enabled?
**Answer:**
**Cross-Origin Resource Sharing** — a browser security rule that blocks requests between different ports/domains.
Since frontend is on port 5173 and backend on 3001, CORS must be enabled so they can communicate.

---

## 🟦 10. What is Vite's proxy and why is it used?
**Answer:**
In vite.config.js, all /api/* requests from the frontend are **automatically forwarded to http://localhost:3001**.
This avoids CORS issues during development.

---

## 🟦 11. How does stock status update automatically?
**Answer:**
After every stock change, the status is recalculated:
  stock === 0        → "Out of Stock"
  stock <= min_level → "Low Stock"
  else               → "In Stock"

---

## 🟦 12. What is an Audit Log?
**Answer:**
A **record of every action** performed in the system — who did what, when, and from which module.
Example: "Added 15 units to Industrial Degreaser Solvent" by admin@qa.com

---

## 🟦 13. What is AsyncLocalStorage used for?
**Answer:**
It stores the **current user's email per request** so the logAudit() function can access it
without passing it as a parameter through every function.

---

## 🟦 14. What is genId(prefix)?
**Answer:**
A helper function that generates a **random ID** like TX-4821 or AUD-9034
using a prefix and a random 4-digit number.

---

## 🟦 15. What does the /api/stats endpoint return?
**Answer:**
Summary statistics:
- Total items count
- Total quantity in stock
- Low stock count
- Expired items count
- Out of stock count
- Breakdown by category

---

## 🟦 16. What is "npm run dev" and "node server.js"?
**Answer:**
- node server.js  → Starts the **Express backend** on port 3001
- npm run dev     → Starts the **Vite frontend** on port 5173
Both must run together for the app to work.

---

## 🟦 17. What is package.json?
**Answer:**
The **project configuration file** that lists:
- Project name and version
- npm scripts (dev, start, build)
- Dependencies (express, cors, vite)

---

## 🟦 18. What are the main data collections in this app?
**Answer:**
| Collection         | Purpose                        |
|--------------------|-------------------------------|
| inventory_items    | All items with stock info      |
| vendors            | Supplier details               |
| departments        | Company departments            |
| users              | App users                      |
| stock_transactions | Inflow/outflow records         |
| audit_logs         | Action history                 |

---

## 🟦 19. What security weakness exists in this project?
**Answer:**
- No real login/authentication — user email is just taken from a request header
- No input validation
- Not suitable for production without adding JWT auth + a real database

---

## 🟦 20. How would you improve this project for production?
**Answer:**
- Replace JSON file with PostgreSQL or MongoDB
- Add JWT-based authentication
- Add input validation (e.g., with Joi or Zod)
- Deploy frontend to Vercel/Netlify and backend to Railway or AWS
- Add role-based access control (Admin, Inspector, Technician)

---

> Tip: Read each answer twice, then explain it in your own words — that is the fastest way to remember it!
