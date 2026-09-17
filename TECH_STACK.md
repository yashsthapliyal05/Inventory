# MSIL QA Lab Inventory - Tech Stack Overview

Here is a complete and easy-to-understand breakdown of the technology stack used in this project, based on the codebase structure.

## 🎨 Frontend (User Interface)
*   **Core Languages:** **Vanilla HTML, CSS, and JavaScript**. The project does not use heavy frameworks like React, Angular, or Vue. Instead, it relies on standard web technologies for a lightweight and fast experience.
*   **Styling:** **Vanilla CSS** (`style.css`). It uses standard CSS with custom variables for themes, layout management, and animations.
*   **Typography:** **Google Fonts** (specifically the "Inter" font) is used for a clean, modern look.
*   **Icons:** **Lucide Icons** (loaded via CDN) are used for UI iconography.
*   **Data Visualization:** **Chart.js** (loaded via CDN) is used to render interactive charts and graphs on the dashboard.
*   **Build Tool & Dev Server:** **Vite** is used as the frontend tooling. It provides a fast local development server and bundles the application for production (`vite.config.js`).

## ⚙️ Backend (Server & API)
*   **Runtime Environment:** **Node.js**.
*   **Framework:** **Express.js**. It's used to create the backend server (`server.js`) that handles incoming requests from the frontend.
*   **Middleware:** 
    *   **CORS:** Used to allow the frontend to securely communicate with the backend.
    *   **Express JSON:** Used to parse incoming request payloads.
*   **Architecture:** It uses a standard **REST API** pattern. The frontend (`app.js`) uses the native `fetch` API to make HTTP requests (GET, POST, PUT, DELETE) to the backend routes (e.g., `/api/items`, `/api/vendors`).

## 🗄️ Database (Data Storage)
*   **Storage Mechanism:** **File-based JSON Storage**. 
    *   While the package `sql.js` is installed and imported, the code explicitly bypasses it to use a flat JSON file (`inventory.db.json`) for persistence. 
    *   **Why?** As noted in the code, using a JSON file avoids the need to load WebAssembly (WASM) modules, making it faster and simpler to run everywhere without native compilation. Data is read from and written directly to this JSON file.

## 🛠️ Key Utilities
*   **QR Code Generation:** A custom script (`qr-generator.js`) is used to dynamically generate QR codes as raw SVG graphics (Vector graphics) directly in the browser, without relying on an external heavy library.

## 🚀 How it runs together
1. When you run `npm run dev`, **Vite** starts the frontend development server.
2. When you run `npm run server` (or `npm start`), **Node.js** starts the Express backend on port `3001`.
3. The Vite proxy (`vite.config.js`) routes any frontend requests starting with `/api` directly to the Express backend, avoiding CORS issues during local development.
4. The Express backend reads/writes data to `inventory.db.json` and sends the data back to the frontend to be displayed.
