// Maruti Suzuki Enterprise QA Inventory System - Main Application Script
// API-driven frontend - all data fetched from Express backend

import { generateSVGQRCode } from './qr-generator.js';

// ==========================================================================
// API CLIENT - replaces DBManager localStorage
// ==========================================================================
const API = {
  async get(path) {
    const headers = {};
    if (window.currentUser && window.currentUser.email) {
      headers['x-user-email'] = window.currentUser.email;
    }
    const r = await fetch(path, { headers });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async post(path, data) {
    const headers = { 'Content-Type': 'application/json' };
    if (window.currentUser && window.currentUser.email) {
      headers['x-user-email'] = window.currentUser.email;
    }
    const r = await fetch(path, { method: 'POST', headers, body: JSON.stringify(data) });
    const json = await r.json();
    if (!r.ok) throw json;
    return json;
  },
  async put(path, data) {
    const headers = { 'Content-Type': 'application/json' };
    if (window.currentUser && window.currentUser.email) {
      headers['x-user-email'] = window.currentUser.email;
    }
    const r = await fetch(path, { method: 'PUT', headers, body: JSON.stringify(data) });
    return r.json();
  },
  async delete(path) {
    const headers = {};
    if (window.currentUser && window.currentUser.email) {
      headers['x-user-email'] = window.currentUser.email;
    }
    const r = await fetch(path, { method: 'DELETE', headers });
    return r.json();
  }
};

// Local in-memory cache (refreshed on every CRUD action)
let _cache = {
  items: [],
  vendors: [],
  departments: [],
  users: [],
  transactions: [],
  audit: []
};

async function refreshCache() {
  try {
    const [items, vendors, departments, users, transactions, audit] = await Promise.all([
      API.get('/api/items'),
      API.get('/api/vendors'),
      API.get('/api/departments'),
      API.get('/api/users'),
      API.get('/api/transactions'),
      API.get('/api/audit')
    ]);
    _cache = { items, vendors, departments, users, transactions, audit };
  } catch (e) {
    console.error('Cache refresh failed:', e);
  }
}

// Compatibility shim for legacy sync code
const dbManager = {
  getItems: () => _cache.items,
  getVendors: () => _cache.vendors,
  getDepartments: () => _cache.departments,
  getUsers: () => _cache.users,
  getTransactions: () => _cache.transactions,
  getAuditLogs: () => _cache.audit
};

let chartInstances = {};

// ==========================================================================
// APPLICATION INITIALIZATION ON DOM LOAD
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof lucide !== "undefined") lucide.createIcons();

  initLoginFlow();
  initClock();
  initSidebar();
  initDropdowns();
  initNavigation();
  initAccordions();
  initModals();
  initRegistrationForm();
  initAddStockForm();
  initRemoveStockForm();
  initCatalogView();
  initQRSuite();
  initReportsEngine();
  initVendorModule();
  initDepartmentModule();
  initAdminModule();
  initCategoryViews();
  initDashboardCardClicks();

  // Load all data and render dashboard
  await refreshCache();
  renderDashboard();
  refreshAllViews();

  window.openModal = openModal;
  window.switchView = switchView;
  window.deleteItem = deleteItem;
  window.filterCatalogAndSwitch = filterCatalogAndSwitch;
  window.showVendorDetails = showVendorDetails;
  window.editVendor = editVendor;
  window.deleteVendor = deleteVendor;
});

function refreshAllViews() {
  const items = _cache.items || [];
  const catalogGrid = document.getElementById("catalog-grid");
  if (catalogGrid) renderCatalogGrid(items, catalogGrid);
  if (typeof renderTransactions === "function") renderTransactions();
  if (typeof renderExpiryTracker === "function") renderExpiryTracker();
  if (typeof renderVendors === "function") renderVendors();
  if (typeof populateVendorSelectors === "function") populateVendorSelectors();
  if (typeof renderAdminTables === "function") renderAdminTables();
  if (typeof renderReportType === "function") renderReportType('master');
  if (typeof renderAnalyticsSuite === "function") renderAnalyticsSuite();
  
  const qrSelect = document.getElementById("qr-generator-item-select");
  if (qrSelect) qrSelect.innerHTML = items.map(i => `<option value="${i.id}">${i.name} (${i.id})</option>`).join('');

  if (typeof CATEGORY_VIEW_CONFIG !== "undefined") {
    CATEGORY_VIEW_CONFIG.forEach(cfg => renderCategoryView(cfg));
  }
  
  const catalogEvent = new Event('change');
  const catSelect = document.getElementById('filter-category-select');
  if (catSelect) catSelect.dispatchEvent(catalogEvent);
}

function populateVendorSelectors() {
  const select = document.getElementById("reg-vendor");
  if (!select) return;
  const vendors = _cache.vendors || [];
  select.innerHTML = vendors.map(v => `<option value="${v.name}">${v.name} (${v.code}) â€” ${v.category}</option>`).join('');
}

// Interactive Dashboard Cards Navigation
function initDashboardCardClicks() {
  const cardTotal = document.querySelector(".photo-stat-card.card-indigo");
  const cardLow = document.querySelector(".photo-stat-card.card-amber");
  const cardOut = document.querySelector(".photo-stat-card.card-rose");
  const cardExpired = document.querySelector(".photo-stat-card.card-pink");

  if (cardTotal) {
    cardTotal.style.cursor = "pointer";
    cardTotal.addEventListener("click", () => filterCatalogAndSwitch("ALL", "ALL"));
  }
  if (cardLow) {
    cardLow.style.cursor = "pointer";
    cardLow.addEventListener("click", () => filterCatalogAndSwitch("ALL", "Low Stock"));
  }
  if (cardOut) {
    cardOut.style.cursor = "pointer";
    cardOut.addEventListener("click", () => filterCatalogAndSwitch("ALL", "Out of Stock"));
  }
  if (cardExpired) {
    cardExpired.style.cursor = "pointer";
    cardExpired.addEventListener("click", () => filterCatalogAndSwitch("ALL", "Expired"));
  }

  document.querySelectorAll(".cat-mini-card[data-category]").forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-category");
      if (cat === "Chemicals") switchView("chemicals-view");
      else if (cat === "CRMs") switchView("crms-view");
      else if (cat === "Equipment Consumables") switchView("consumables-view");
      else if (cat === "Equipment Spares") switchView("spares-view");
      else if (cat === "Gases") switchView("gases-view");
      else if (cat === "Tools") switchView("tools-view");
      else filterCatalogAndSwitch(cat, "ALL");
    });
  });
}

function filterCatalogAndSwitch(category, status) {
  switchView("inventory-view");
  const catSelect = document.getElementById("filter-category-select");
  const statusSelect = document.getElementById("filter-status-select");
  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) searchInput.value = "";
  if (catSelect) catSelect.value = category;
  if (statusSelect) statusSelect.value = status;
  if (catSelect) catSelect.dispatchEvent(new Event("change"));
}

// Delete item handler
async function deleteItem(id) {
  if (!confirm(`Are you sure you want to delete item ${id}? This action cannot be undone.`)) return;
  try {
    await API.delete(`/api/items/${id}`);
    await refreshCache();
    renderDashboard();
    refreshAllViews();
    showToast("Item Deleted", `Item ${id} successfully removed from inventory`, "warning");
  } catch (err) {
    showToast("Delete Error", err.error || "Failed to delete item", "danger");
  }
}

// ==========================================================================
// LOGIN & LOADER TRANSITION FLOW
// ==========================================================================
function initLoginFlow() {
  const loginForm = document.getElementById("login-form");
  const loginPage = document.getElementById("login-page");
  const loaderScreen = document.getElementById("loader-screen");
  const dashboardPage = document.getElementById("dashboard-page");
  const statusText = document.getElementById("loader-status-text");
  const progressFill = document.getElementById("loader-progress-fill");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailVal = document.getElementById("login-email").value.trim();
    
    // Find matching user from cache or backend users list
    let matchedUser = _cache.users.find(u => u.email.toLowerCase() === emailVal.toLowerCase());
    if (!matchedUser) {
      try {
        const users = await API.get('/api/users');
        _cache.users = users;
        matchedUser = users.find(u => u.email.toLowerCase() === emailVal.toLowerCase());
      } catch (err) {
        console.error("Failed to load users list during login:", err);
      }
    }
    
    if (!matchedUser) {
      // Create a fallback user dynamically based on the email
      const prefix = emailVal.split('@')[0];
      const name = prefix.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      matchedUser = {
        name: name || "Aditya Sharma",
        email: emailVal,
        department: "Quality Assurance",
        role: "QA Specialist"
      };
    }
    
    window.currentUser = matchedUser;
    
    // Update the profile display elements
    const dispName = document.getElementById("user-display-name");
    const dispDept = document.getElementById("user-display-dept");
    if (dispName) dispName.textContent = matchedUser.name;
    if (dispDept) dispDept.innerHTML = `&bull; ${matchedUser.role || matchedUser.department}`;
    
    const dropdownHeader = document.querySelector(".dropdown-user-header");
    if (dropdownHeader) {
      const strongEl = dropdownHeader.querySelector("strong");
      const smallEl = dropdownHeader.querySelector("small");
      if (strongEl) strongEl.textContent = matchedUser.name;
      if (smallEl) smallEl.textContent = `Department: ${matchedUser.department}`;
    }
    
    // Update welcome message on Dashboard
    const welcomeHeader = document.querySelector("#dashboard-view h1");
    if (welcomeHeader) {
      welcomeHeader.innerHTML = `Welcome back, ${matchedUser.name} ðŸ‘‹`;
    }

    loaderScreen.classList.remove("hidden");
    progressFill.style.width = "0%";

    const steps = [
      { text: "Verifying QA Lab Credentials...", progress: "25%" },
      { text: "Connecting to Inventory Database...", progress: "55%" },
      { text: "Loading Maruti Suzuki Manesar Assembly Datasets...", progress: "85%" },
      { text: "Access Granted. Redirecting...", progress: "100%" }
    ];

    let currentStep = 0;
    const interval = setInterval(async () => {
      if (currentStep < steps.length) {
        statusText.textContent = steps[currentStep].text;
        progressFill.style.width = steps[currentStep].progress;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          loaderScreen.classList.add("hidden");
          loginPage.classList.add("hidden");
          dashboardPage.classList.remove("hidden");
          if (typeof lucide !== "undefined") lucide.createIcons();
          
          // Log Audit Action on server
          try {
            await API.post('/api/audit', {
              action: 'USER_LOGIN',
              module: 'Authentication',
              details: `User ${matchedUser.name} (${matchedUser.email}) logged in successfully`
            });
          } catch (auditErr) {
            console.error("Failed to submit login audit log:", auditErr);
          }

          await refreshCache();
          renderDashboard();
          refreshAllViews();
          showToast("Welcome Back!", `Successfully authenticated as ${matchedUser.name}`, "success");
        }, 400);
      }
    }, 400);
  });

  const headerLogoutBtn = document.getElementById("header-logout-btn");
  const profileLogoutLink = document.getElementById("profile-logout-link");

  function logout(e) {
    if (e) e.preventDefault();
    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    if (typeof lucide !== "undefined") lucide.createIcons();
    showToast("Logged Out", "Session safely closed", "info");
  }

  if (headerLogoutBtn) headerLogoutBtn.addEventListener("click", logout);
  if (profileLogoutLink) profileLogoutLink.addEventListener("click", logout);
}

// ==========================================================================
// REAL-TIME DATE & TIME
// ==========================================================================
function initClock() {
  const dateEl = document.getElementById("live-date");
  const timeEl = document.getElementById("live-time");
  if (!dateEl || !timeEl) return;

  function updateClock() {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    timeEl.textContent = `${String(hours).padStart(2,'0')}:${minutes}:${seconds} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// ==========================================================================
// SIDEBAR TOGGLE
// ==========================================================================
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebarCollapseBtn = document.getElementById("sidebar-collapse-btn");
  const collapseIcon = document.getElementById("collapse-icon");
  if (!sidebar) return;

  function toggleCollapse() {
    sidebar.classList.toggle("collapsed");
    if (collapseIcon) collapseIcon.setAttribute("data-lucide", sidebar.classList.contains("collapsed") ? "chevron-right" : "chevron-left");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener("click", toggleCollapse);
  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener("click", (e) => { e.stopPropagation(); sidebar.classList.toggle("mobile-open"); });
}

// ==========================================================================
// DROPDOWNS
// ==========================================================================
function initDropdowns() {
  const notificationBtn = document.getElementById("notification-btn");
  const notificationsDropdown = document.getElementById("notifications-dropdown");
  const userProfileBtn = document.getElementById("user-profile-btn");
  const profileDropdown = document.getElementById("profile-dropdown");

  if (notificationBtn) notificationBtn.addEventListener("click", (e) => { e.stopPropagation(); if (profileDropdown) profileDropdown.classList.remove("show"); if (notificationsDropdown) notificationsDropdown.classList.toggle("show"); });
  if (userProfileBtn) userProfileBtn.addEventListener("click", (e) => { e.stopPropagation(); if (notificationsDropdown) notificationsDropdown.classList.remove("show"); if (profileDropdown) profileDropdown.classList.toggle("show"); });
  document.addEventListener("click", () => { if (notificationsDropdown) notificationsDropdown.classList.remove("show"); if (profileDropdown) profileDropdown.classList.remove("show"); });

  const markAllReadBtn = document.getElementById("btn-mark-all-read");
  if (markAllReadBtn) markAllReadBtn.addEventListener("click", () => { const badge = document.getElementById("notification-unread-count"); if (badge) badge.textContent = "0"; showToast("Notifications", "All system alerts marked as read", "info"); });
}

// ==========================================================================
// NAVIGATION & VIEW SWITCHING
// ==========================================================================
function initNavigation() {
  const navItems = document.querySelectorAll(".sidebar-nav li[data-view], .nav-view-link[data-view], .btn-nav-action[data-target], .btn-view-analytics[data-view]");
  navItems.forEach(item => {
    item.addEventListener("click", function(e) {
      let targetViewId = this.getAttribute("data-view");
      if (!targetViewId && this.getAttribute("data-target")) {
        const target = this.getAttribute("data-target");
        targetViewId = target === "dashboard" ? "dashboard-view" : `${target}-view`;
      }
      if (!targetViewId) return;

      document.querySelectorAll(".sidebar-nav li").forEach(li => li.classList.remove("active"));
      const activeSidebarLi = document.querySelector(`.sidebar-nav li[data-view="${targetViewId}"]`);
      if (activeSidebarLi) activeSidebarLi.classList.add("active");

      document.querySelectorAll(".workspace-view").forEach(v => v.classList.remove("active"));
      const targetView = document.getElementById(targetViewId);
      if (targetView) { targetView.classList.add("active"); window.scrollTo({ top: 0, behavior: 'smooth' }); }

      if (targetViewId === 'analytics-view') renderAnalyticsSuite();
      if (targetViewId === 'expiry-view') renderExpiryTracker();
      if (targetViewId === 'vendors-view') renderVendors();
      if (targetViewId === 'admin-view') renderAdminTables();
      if (targetViewId === 'reports-view') {
        const activeTab = document.querySelector('.report-tab-btn.active');
        renderReportType(activeTab ? activeTab.getAttribute('data-report') : 'master');
      }

      if (typeof lucide !== "undefined") lucide.createIcons();
    });
  });
}

// ==========================================================================
// EXPANDABLE CATEGORY ACCORDIONS MODULE
// ==========================================================================
function initAccordions() {
  const categoryCards = document.querySelectorAll(".cat-accordion-card");

  categoryCards.forEach(card => {
    const header = card.querySelector(".cat-card-header");
    const collapseBtn = card.querySelector(".action-btn-collapse");
    if (header) header.addEventListener("click", () => { card.classList.toggle("expanded"); if (typeof lucide !== "undefined") lucide.createIcons(); });
    if (collapseBtn) collapseBtn.addEventListener("click", (e) => { e.stopPropagation(); card.classList.remove("expanded"); });

    const addBtn = card.querySelector(".action-btn-add");
    const removeBtn = card.querySelector(".action-btn-remove");
    const registerBtn = card.querySelector(".action-btn-register");
    const listBtn = card.querySelector(".action-btn-list");
    const reportsBtn = card.querySelector(".action-btn-reports");
    const stockBtn = card.querySelector(".action-btn-stock");

    if (addBtn) addBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal("add-stock-modal", { category: card.getAttribute("data-category") }); });
    if (removeBtn) removeBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal("remove-stock-modal", { category: card.getAttribute("data-category") }); });
    if (registerBtn) registerBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal("register-item-modal", { category: card.getAttribute("data-category") }); });
    if (listBtn) listBtn.addEventListener("click", (e) => { e.stopPropagation(); switchView("inventory-view"); const categorySelect = document.getElementById("filter-category-select"); if (categorySelect) { categorySelect.value = card.getAttribute("data-category"); categorySelect.dispatchEvent(new Event("change")); } });
    if (reportsBtn) reportsBtn.addEventListener("click", (e) => { e.stopPropagation(); switchView("reports-view"); });
    if (stockBtn) stockBtn.addEventListener("click", (e) => { e.stopPropagation(); switchView("inventory-view"); });
  });

  const collapseAllBtn = document.getElementById("btn-collapse-all-categories");
  if (collapseAllBtn) collapseAllBtn.addEventListener("click", () => { categoryCards.forEach(c => c.classList.remove("expanded")); });
}

function switchView(viewId) {
  document.querySelectorAll(".workspace-view").forEach(v => v.classList.remove("active"));
  const view = document.getElementById(viewId);
  if (view) view.classList.add("active");
  document.querySelectorAll(".sidebar-nav li").forEach(li => li.classList.remove("active"));
  const li = document.querySelector(`.sidebar-nav li[data-view="${viewId}"]`);
  if (li) li.classList.add("active");
  if (viewId === 'analytics-view') renderAnalyticsSuite();
  if (viewId === 'expiry-view') renderExpiryTracker();
  if (viewId === 'reports-view') {
    const activeTab = document.querySelector('.report-tab-btn.active');
    renderReportType(activeTab ? activeTab.getAttribute('data-report') : 'master');
  }
  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ==========================================================================
// MODALS MANAGEMENT SUITE
// ==========================================================================
function initModals() {
  document.querySelectorAll(".close-modal-btn").forEach(btn => {
    btn.addEventListener("click", function() { const modal = this.closest(".modal-overlay"); if (modal) modal.classList.add("hidden"); });
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", function(e) { if (e.target === this) this.classList.add("hidden"); });
  });
  document.querySelectorAll(".open-add-stock-btn, #btn-quick-add-stock").forEach(btn => { btn.addEventListener("click", () => openModal("add-stock-modal")); });
  document.querySelectorAll(".open-remove-stock-btn, #btn-quick-remove-stock").forEach(btn => { btn.addEventListener("click", () => openModal("remove-stock-modal")); });
  document.querySelectorAll(".open-register-modal-btn").forEach(btn => { btn.addEventListener("click", () => openModal("register-item-modal")); });
  document.querySelectorAll(".open-qr-scanner-btn, #btn-quick-qr").forEach(btn => { btn.addEventListener("click", () => openModal("qr-modal")); });
}

function openModal(modalId, options = {}) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (modalId === "add-stock-modal" || modalId === "remove-stock-modal") {
    populateItemSelectors(modalId, options.category);
    if (modalId === "add-stock-modal") {
      const dateEl = document.getElementById("add-stock-date");
      const timeEl = document.getElementById("add-stock-time");
      if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
      if (timeEl) timeEl.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }
  if (modalId === "register-item-modal") selectRegisterTab(options.category || "Chemicals");
  modal.classList.remove("hidden");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

window.openPhotoPreview = function(src) {
  const modal = document.getElementById("photo-preview-modal");
  const img = document.getElementById("photo-preview-img");
  if (modal && img) {
    img.src = src;
    modal.classList.remove("hidden");
  }
};

function populateItemSelectors(modalId, categoryFilter) {
  const items = _cache.items;
  const filtered = categoryFilter ? items.filter(i => i.category === categoryFilter) : items;
  const select = modalId === "add-stock-modal" ? document.getElementById("add-stock-item-select") : document.getElementById("remove-stock-item-select");
  if (!select) return;
  select.innerHTML = filtered.map(i => `<option value="${i.id}">${i.name} (${i.id}) â€” Stock: ${i.current_stock} ${i.unit}</option>`).join('');
}

// ==========================================================================
// ITEM REGISTRATION FORM
// ==========================================================================
let uploadedImageBase64 = "";

function initRegistrationForm() {
  const form = document.getElementById("register-item-form");
  const tabBtns = document.querySelectorAll("#register-category-tabs .modal-tab-btn");
  const regCategoryInput = document.getElementById("reg-category");
  const autoIdBtn = document.getElementById("btn-gen-item-id");
  const itemIdInput = document.getElementById("reg-item-id");
  const qrCodeInput = document.getElementById("reg-qr-code");

  const browseBtn = document.getElementById("btn-browse-image");
  const fileInput = document.getElementById("reg-item-image-file");
  const urlInput = document.getElementById("reg-item-image-url");
  const previewBox = document.getElementById("reg-image-preview-box");

  if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedImageBase64 = event.target.result;
          if (urlInput) urlInput.value = file.name;
          if (previewBox) previewBox.innerHTML = `<img src="${uploadedImageBase64}" style="width:100%;height:100%;object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener("input", () => {
      const val = urlInput.value.trim();
      if (val && !val.startsWith("data:")) {
        uploadedImageBase64 = "";
        if (previewBox) previewBox.innerHTML = `<img src="${val}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='assets/items/degreaser-solvent.png'">`;
      }
    });
  }

  tabBtns.forEach(btn => { btn.addEventListener("click", function() { selectRegisterTab(this.getAttribute("data-cat")); }); });

  if (autoIdBtn) autoIdBtn.addEventListener("click", () => {
    const cat = regCategoryInput ? regCategoryInput.value : "CHEM";
    const prefix = cat.substring(0, 4).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newId = `${prefix}-${rand}`;
    if (itemIdInput) itemIdInput.value = newId;
    if (qrCodeInput) qrCodeInput.value = `MSIL-QA-${newId}`;
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const imageUrl = urlInput ? urlInput.value.trim() : "";
      const finalImage = uploadedImageBase64 || (imageUrl.startsWith("http") || imageUrl.startsWith("assets") || imageUrl.startsWith("data:") ? imageUrl : "assets/items/degreaser-solvent.png");

      const newItem = {
        id: document.getElementById("reg-item-id").value,
        name: document.getElementById("reg-item-name").value,
        description: document.getElementById("reg-description").value,
        category: document.getElementById("reg-category").value,
        subcategory: document.getElementById("reg-subcategory").value || "General",
        department: document.getElementById("reg-department").value,
        vendor: document.getElementById("reg-vendor").value,
        location: document.getElementById("reg-location").value,
        manufacturer: document.getElementById("reg-manufacturer").value || "Approved Vendor",
        po_number: document.getElementById("reg-po-number").value || "PO-2026-N/A",
        expiry_date: document.getElementById("reg-expiry-date").value || "2028-12-31",
        batch_number: document.getElementById("reg-batch-number").value || "LOT-2026-001",
        size: document.getElementById("reg-size").value || "Standard Unit",
        unit: document.getElementById("reg-unit").value,
        current_stock: parseInt(document.getElementById("reg-current-stock").value, 10) || 0,
        max_level: parseInt(document.getElementById("reg-max-level").value, 10) || 100,
        min_level: parseInt(document.getElementById("reg-min-level").value, 10) || 10,
        reorder_level: parseInt(document.getElementById("reg-reorder-level").value, 10) || 15,
        status: "In Stock",
        remarks: document.getElementById("reg-remarks").value || "Registered via portal",
        image: finalImage
      };

      try {
        await API.post('/api/items', newItem);
        document.getElementById("register-item-modal").classList.add("hidden");
        uploadedImageBase64 = "";
        if (urlInput) urlInput.value = "";
        await refreshCache();
        renderDashboard();
        refreshAllViews();
        showToast("Item Registered", `Successfully added ${newItem.name} with photo to ${newItem.category}`, "success");
      } catch (err) {
        showToast("Error", err.error || "Failed to register item", "danger");
      }
    });
  }
}

function selectRegisterTab(catName) {
  document.querySelectorAll("#register-category-tabs .modal-tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-cat") === catName);
  });
  const regCategoryInput = document.getElementById("reg-category");
  if (regCategoryInput) regCategoryInput.value = catName;
  const title = document.getElementById("register-modal-title");
  if (title) title.textContent = `Register New ${catName} Record`;
  const vendorSelect = document.getElementById("reg-vendor");
  if (vendorSelect) vendorSelect.innerHTML = _cache.vendors.map(v => `<option value="${v.name}">${v.name} (${v.code})</option>`).join('');
}

// ==========================================================================
// ADD STOCK FORM
// ==========================================================================
function initAddStockForm() {
  const form = document.getElementById("add-stock-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const itemId = document.getElementById("add-stock-item-select").value;
    const qty = document.getElementById("add-stock-quantity").value;
    const location = document.getElementById("add-stock-location").value;
    const vendor = document.getElementById("add-stock-vendor").value;
    const batch = document.getElementById("add-stock-batch").value;
    const remarks = document.getElementById("add-stock-remarks").value;
    const dateStr = document.getElementById("add-stock-date").value;
    const timeStr = document.getElementById("add-stock-time").value;

    try {
      const res = await API.post(`/api/items/${itemId}/add-stock`, { qty, location, vendor, batch, remarks, dateStr, timeStr });
      document.getElementById("add-stock-modal").classList.add("hidden");
      await refreshCache();
      renderDashboard();
      refreshAllViews();
      showToast("Stock Added", `Increased stock of ${res.item.name} by +${qty} ${res.item.unit}`, "success");
    } catch (err) {
      showToast("Error", err.error || "Failed to add stock", "danger");
    }
  });
}

// ==========================================================================
// REMOVE STOCK FORM
// ==========================================================================
function initRemoveStockForm() {
  const form = document.getElementById("remove-stock-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const itemId = document.getElementById("remove-stock-item-select").value;
    const qty = document.getElementById("remove-stock-quantity").value;
    const dept = document.getElementById("remove-stock-department").value;
    const user = document.getElementById("remove-stock-user").value;
    const approver = document.getElementById("remove-stock-approver").value;
    const reason = document.getElementById("remove-stock-reason").value;
    const remarks = document.getElementById("remove-stock-remarks").value;

    try {
      const res = await API.post(`/api/items/${itemId}/remove-stock`, { qty, dept, user, approver, reason, remarks });
      if (res.success) {
        document.getElementById("remove-stock-modal").classList.add("hidden");
        await refreshCache();
        renderDashboard();
        refreshAllViews();
        showToast("Stock Issued", `Successfully issued -${qty} ${res.item.unit} of ${res.item.name} to ${dept}`, "danger");
        if (res.item.status === "Low Stock") showToast("Low Stock Warning", `${res.item.name} has fallen below minimum safety limit (${res.item.current_stock} remaining)!`, "warning");
      } else {
        showToast("Error Issuing Stock", res.msg, "danger");
      }
    } catch (err) {
      const msg = err.msg || err.error || "Failed to issue stock";
      showToast("Error Issuing Stock", msg, "danger");
    }
  });
}



// ==========================================================================
// MASTER CATALOG VIEW (GRID & TABLE)
// ==========================================================================
function initCatalogView() {
  const searchInput = document.getElementById("catalog-search-input");
  const categorySelect = document.getElementById("filter-category-select");
  const statusSelect = document.getElementById("filter-status-select");
  const departmentSelect = document.getElementById("filter-department-select");
  const sortSelect = document.getElementById("sort-catalog-select");
  const cardsBtn = document.getElementById("view-mode-cards");
  const tableBtn = document.getElementById("view-mode-table");
  const cardsContainer = document.getElementById("catalog-cards-container");
  const tableContainer = document.getElementById("catalog-table-container");

  function applyFilters() {
    let items = _cache.items;
    const query = (searchInput ? searchInput.value : "").toLowerCase();
    const cat = categorySelect ? categorySelect.value : "ALL";
    const status = statusSelect ? statusSelect.value : "ALL";
    const dept = departmentSelect ? departmentSelect.value : "ALL";
    const sort = sortSelect ? sortSelect.value : "name-asc";

    items = items.filter(item => {
      const matchesSearch = !query || item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || (item.vendor && item.vendor.toLowerCase().includes(query)) || (item.location && item.location.toLowerCase().includes(query));
      const matchesCat = cat === "ALL" || item.category === cat;
      const matchesStatus = status === "ALL" || item.status === status;
      const matchesDept = dept === "ALL" || item.department === dept;
      return matchesSearch && matchesCat && matchesStatus && matchesDept;
    });

    if (sort === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "stock-desc") items.sort((a, b) => b.current_stock - a.current_stock);
    else if (sort === "expiry-asc") items.sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));

    renderCatalogGrid(items, cardsContainer);
    renderCatalogTable(items, document.getElementById("catalog-tbody"));
  }

  [searchInput, categorySelect, statusSelect, departmentSelect, sortSelect].forEach(el => {
    if (el) el.addEventListener("input", applyFilters);
    if (el) el.addEventListener("change", applyFilters);
  });

  if (cardsBtn && tableBtn) {
    cardsBtn.addEventListener("click", () => { cardsBtn.classList.add("active"); tableBtn.classList.remove("active"); cardsContainer.classList.remove("hidden"); tableContainer.classList.add("hidden"); });
    tableBtn.addEventListener("click", () => { tableBtn.classList.add("active"); cardsBtn.classList.remove("active"); tableContainer.classList.remove("hidden"); cardsContainer.classList.add("hidden"); });
  }

  applyFilters();
}

function renderCatalogGrid(items, container) {
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = `<div class="card-box full-width text-center"><p class="text-muted">No inventory records matching current filter settings.</p></div>`;
    return;
  }
  container.innerHTML = items.map(item => {
    const badgeClass = item.status === "In Stock" ? "badge-success" : item.status === "Low Stock" ? "badge-warning" : "badge-danger";
    return `
      <div class="inventory-card">
        <div class="card-img-wrapper" style="cursor:pointer;" onclick="openPhotoPreview('${item.image}')">
          <img src="${item.image}" alt="${item.name}" class="item-img">
          <span class="item-badge ${badgeClass}">${item.status}</span>
        </div>
        <div class="item-details-body">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-sku">SKU: ${item.id} â€¢ ${item.category}</p>
          <div class="item-meta-grid">
            <div class="meta-item"><span class="meta-label">Quantity</span><span class="meta-val font-bold">${item.current_stock} ${item.unit}</span></div>
            <div class="meta-item"><span class="meta-label">Storage</span><span class="meta-val">${item.location}</span></div>
            <div class="meta-item"><span class="meta-label">Expiry Date</span><span class="meta-val">${item.expiry_date}</span></div>
          </div>
          <div class="qr-overlay-btn" data-id="${item.id}" title="Click to view QR Code">
            <svg class="qr-code-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="20" height="20" fill="currentColor"/>
              <rect x="15" y="15" width="10" height="10" fill="#fff"/>
              <rect x="70" y="10" width="20" height="20" fill="currentColor"/>
              <rect x="75" y="15" width="10" height="10" fill="#fff"/>
              <rect x="10" y="70" width="20" height="20" fill="currentColor"/>
              <rect x="15" y="75" width="10" height="10" fill="#fff"/>
              <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
            </svg>
            <span>Show QR Label (${item.id})</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary-sm btn-item-detail" data-id="${item.id}"><i data-lucide="eye"></i> Details</button>
            <button class="btn btn-primary-sm btn-item-issue" data-id="${item.id}"><i data-lucide="minus-circle"></i> Issue</button>
            <button class="btn btn-danger-sm btn-item-delete" data-id="${item.id}" title="Delete Item"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  bindCardActionButtons(container);
}

function renderCatalogTable(items, tbody) {
  if (!tbody) return;
  tbody.innerHTML = items.map(i => {
    const badgeClass = i.status === "In Stock" ? "badge-success" : i.status === "Low Stock" ? "badge-warning" : "badge-danger";
    return `
      <tr>
        <td><strong>${i.id}</strong></td>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td><strong>${i.current_stock} ${i.unit}</strong></td>
        <td>${i.location}</td>
        <td>${i.vendor}</td>
        <td>${i.expiry_date}</td>
        <td><span class="badge ${badgeClass}">${i.status}</span></td>
        <td>
          <button class="btn btn-outline-sm btn-item-detail" data-id="${i.id}"><i data-lucide="eye"></i> View</button>
          <button class="btn btn-danger-sm btn-item-delete" data-id="${i.id}" title="Delete Item"><i data-lucide="trash-2"></i> Delete</button>
        </td>
      </tr>
    `;
  }).join('');
  bindCardActionButtons(tbody);
}

function bindCardActionButtons(container) {
  container.querySelectorAll(".btn-item-detail, .qr-overlay-btn").forEach(btn => {
    btn.addEventListener("click", function() { showStockDetailModal(this.getAttribute("data-id")); });
  });
  container.querySelectorAll(".btn-item-issue").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      openModal("remove-stock-modal");
      const select = document.getElementById("remove-stock-item-select");
      if (select) select.value = id;
    });
  });
  container.querySelectorAll(".btn-item-delete").forEach(btn => {
    btn.addEventListener("click", function() {
      deleteItem(this.getAttribute("data-id"));
    });
  });
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function showStockDetailModal(itemId) {
  const item = _cache.items.find(i => i.id === itemId);
  if (!item) return;
  document.getElementById("stock-detail-name").textContent = item.name;
  document.getElementById("stock-detail-sku").textContent = `SKU: ${item.id} â€¢ Category: ${item.category}`;
  document.getElementById("stock-detail-img").src = item.image;
  document.getElementById("stock-detail-current").textContent = `${item.current_stock} ${item.unit}`;
  document.getElementById("stock-detail-avail").textContent = `${Math.max(0, item.current_stock - 5)} ${item.unit}`;
  document.getElementById("stock-detail-reserved").textContent = `5 ${item.unit}`;
  document.getElementById("stock-detail-loc").textContent = item.location;
  document.getElementById("stock-detail-expiry").textContent = item.expiry_date;
  const badgeClass = item.status === "In Stock" ? "badge-success" : item.status === "Low Stock" ? "badge-warning" : "badge-danger";
  document.getElementById("stock-detail-status-badge").className = `badge ${badgeClass}`;
  document.getElementById("stock-detail-status-badge").textContent = item.status;

  const history = _cache.transactions.filter(t => t.item === item.name);
  const tbody = document.getElementById("stock-detail-history-tbody");
  if (tbody) {
    if (history.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-muted">No recent movement records for this item.</td></tr>`;
    } else {
      tbody.innerHTML = history.map(h => `<tr><td>${h.time}</td><td><strong>${h.type}</strong></td><td>${h.type === "Inflow" ? "+" : "-"}${h.qty}</td><td>${h.user} (${h.dept})</td><td>${h.remarks}</td></tr>`).join('');
    }
  }
  openModal("stock-detail-modal");
}

// ==========================================================================
// QR CODE SUITE & SIMULATOR
// ==========================================================================
function initQRSuite() {
  const select = document.getElementById("qr-generator-item-select");
  const customInput = document.getElementById("qr-custom-input");
  const previewBox = document.getElementById("qr-suite-preview");

  if (select) {
    select.innerHTML = _cache.items.map(i => `<option value="${i.id}">${i.name} (${i.id})</option>`).join('');
    select.addEventListener("change", () => updateQRPreview());
  }
  if (customInput) customInput.addEventListener("input", () => updateQRPreview());

  function updateQRPreview() {
    if (!previewBox) return;
    const val = (customInput && customInput.value) ? customInput.value : (select ? select.value : "MSIL-QA-CHEM-DEG-3091");
    previewBox.innerHTML = generateSVGQR(val);
  }
  updateQRPreview();

  const printBtn = document.getElementById("btn-print-qr-label");
  const downloadBtn = document.getElementById("btn-download-qr-label");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
  if (downloadBtn) downloadBtn.addEventListener("click", () => showToast("QR Code Downloaded", "Sticker label PNG saved to downloads", "success"));

  const pillsContainer = document.getElementById("sample-qr-pills-container");
  const simButtonsContainer = document.getElementById("sim-qr-buttons-container");
  const sampleItems = _cache.items.slice(0, 4);

  if (pillsContainer) pillsContainer.innerHTML = sampleItems.map(i => `<button class="btn btn-outline-sm btn-sim-scan" data-id="${i.id}"><i data-lucide="qr-code"></i> Scan ${i.id}</button>`).join('');
  if (simButtonsContainer) simButtonsContainer.innerHTML = sampleItems.map(i => `<button class="btn btn-primary-sm btn-sim-scan" data-id="${i.id}"><i data-lucide="scan"></i> Scan ${i.name}</button>`).join('');

  document.querySelectorAll(".btn-sim-scan").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
      showStockDetailModal(id);
      showToast("QR Scanned", `Barcode resolved to SKU: ${id}`, "success");
    });
  });
}

function generateSVGQR(text) {
  return `
    <svg viewBox="0 0 100 100" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FFFFFF"/>
      <rect x="10" y="10" width="22" height="22" fill="#002F6C"/>
      <rect x="15" y="15" width="12" height="12" fill="#FFFFFF"/>
      <rect x="68" y="10" width="22" height="22" fill="#002F6C"/>
      <rect x="73" y="15" width="12" height="12" fill="#FFFFFF"/>
      <rect x="10" y="68" width="22" height="22" fill="#002F6C"/>
      <rect x="15" y="73" width="12" height="12" fill="#FFFFFF"/>
      <rect x="40" y="40" width="20" height="20" fill="#E31837"/>
      <rect x="40" y="15" width="10" height="10" fill="#002F6C"/>
      <rect x="15" y="40" width="10" height="10" fill="#002F6C"/>
      <rect x="68" y="45" width="12" height="12" fill="#002F6C"/>
      <rect x="45" y="68" width="12" height="12" fill="#002F6C"/>
      <rect x="68" y="75" width="22" height="15" fill="#002F6C"/>
      <text x="50" y="96" font-size="6" font-weight="bold" text-anchor="middle" fill="#002F6C">MSIL QA LAB</text>
    </svg>
  `;
}

// ==========================================================================
// REPORTS ENGINE
// ==========================================================================
function initReportsEngine() {
  const tabs = document.querySelectorAll(".report-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      renderReportType(this.getAttribute("data-report"));
    });
  });
  document.getElementById("btn-export-excel")?.addEventListener("click", () => exportReportCSV("excel"));
  document.getElementById("btn-export-csv")?.addEventListener("click", () => exportReportCSV("csv"));
  document.getElementById("btn-export-pdf")?.addEventListener("click", () => window.print());
  document.getElementById("btn-print-report")?.addEventListener("click", () => window.print());
  // NOTE: Initial renderReportType is called by refreshAllViews() after the cache loads
}

function renderReportType(type) {
  const titleDisplay = document.getElementById("report-title-display");
  const thead = document.getElementById("report-thead");
  const tbody = document.getElementById("report-tbody");
  const countBadge = document.getElementById("report-total-count");
  const items = _cache.items;

  if (type === "master") {
    if (titleDisplay) titleDisplay.textContent = "Master Inventory Report";
    if (countBadge) countBadge.textContent = `Total Records: ${items.length}`;
    if (thead) thead.innerHTML = `<tr><th>SKU</th><th>Item Name</th><th>Category</th><th>Qty</th><th>Location</th><th>Vendor</th><th>Status</th></tr>`;
    if (tbody) tbody.innerHTML = items.map(i => `<tr><td>${i.id}</td><td>${i.name}</td><td>${i.category}</td><td>${i.current_stock} ${i.unit}</td><td>${i.location}</td><td>${i.vendor}</td><td>${i.status}</td></tr>`).join('');
  } else if (type === "lowstock") {
    const lowItems = items.filter(i => i.current_stock <= i.min_level || i.status === "Low Stock" || i.status === "Out of Stock");
    if (titleDisplay) titleDisplay.textContent = "Low Stock & Reorder Alert Report";
    if (countBadge) countBadge.textContent = `Alert Records: ${lowItems.length}`;
    if (thead) thead.innerHTML = `<tr><th>SKU</th><th>Item Name</th><th>Current Stock</th><th>Min Threshold</th><th>Reorder Level</th><th>Department</th><th>Action</th></tr>`;
    if (tbody) tbody.innerHTML = lowItems.map(i => `<tr><td>${i.id}</td><td><strong>${i.name}</strong></td><td class="text-danger font-bold">${i.current_stock} ${i.unit}</td><td>${i.min_level}</td><td>${i.reorder_level}</td><td>${i.department}</td><td><span class="badge badge-danger">Reorder Required</span></td></tr>`).join('');
  } else if (type === "expired") {
    const now = new Date();
    const expItems = items.filter(i => i.status === "Expired" || (i.expiry_date && new Date(i.expiry_date) < now));
    if (titleDisplay) titleDisplay.textContent = "Expired & Expiry Compliance Report";
    if (countBadge) countBadge.textContent = `Batches: ${expItems.length}`;
    if (thead) thead.innerHTML = `<tr><th>SKU</th><th>Item Name</th><th>Batch No</th><th>Expiry Date</th><th>Storage Location</th><th>Department</th><th>Compliance</th></tr>`;
    if (tbody) tbody.innerHTML = expItems.map(i => `<tr><td>${i.id}</td><td>${i.name}</td><td>${i.batch_number}</td><td class="text-danger font-bold">${i.expiry_date}</td><td>${i.location}</td><td>${i.department}</td><td><span class="badge badge-danger">Quarantined</span></td></tr>`).join('');
  } else if (type === "vendor") {
    const vendors = _cache.vendors;
    if (titleDisplay) titleDisplay.textContent = "Vendor Delivery & Performance Report";
    if (countBadge) countBadge.textContent = `Vendors: ${vendors.length}`;
    if (thead) thead.innerHTML = `<tr><th>Vendor Code</th><th>Company Name</th><th>Category</th><th>Contact</th><th>Email</th><th>Rating</th><th>Status</th></tr>`;
    if (tbody) tbody.innerHTML = vendors.map(v => `<tr><td>${v.code}</td><td><strong>${v.name}</strong></td><td>${v.category}</td><td>${v.contact}</td><td>${v.email}</td><td><span class="text-warning font-bold">${v.rating}</span></td><td><span class="badge badge-success">${v.status}</span></td></tr>`).join('');
  } else if (type === "department") {
    const depts = _cache.departments;
    if (titleDisplay) titleDisplay.textContent = "Department Usage & Material Allocation Report";
    if (countBadge) countBadge.textContent = `Departments: ${depts.length}`;
    if (thead) thead.innerHTML = `<tr><th>Department</th><th>Department Lead</th><th>Active SKUs</th><th>Allocated Units</th><th>Status</th></tr>`;
    if (tbody) tbody.innerHTML = depts.map(d => `<tr><td><strong>${d.name}</strong></td><td>${d.manager}</td><td>${d.active_skus} SKUs</td><td>${d.allocated_units} units</td><td><span class="badge badge-info">Active</span></td></tr>`).join('');
  } else {
    // Category analytics
    const cats = ['Chemicals', 'CRMs', 'Equipment Consumables', 'Equipment Spares', 'Gases', 'Tools'];
    if (titleDisplay) titleDisplay.textContent = "Category Analytics & Distribution Report";
    if (countBadge) countBadge.textContent = `Categories: ${cats.length}`;
    if (thead) thead.innerHTML = `<tr><th>Category</th><th>Active SKUs</th><th>Total Stock</th><th>Low Stock</th><th>Expired</th></tr>`;
    if (tbody) tbody.innerHTML = cats.map(cat => {
      const catItems = items.filter(i => i.category === cat);
      return `<tr><td><strong>${cat}</strong></td><td>${catItems.length} SKUs</td><td>${catItems.reduce((s, i) => s + i.current_stock, 0)}</td><td>${catItems.filter(i => i.status === 'Low Stock').length}</td><td>${catItems.filter(i => i.status === 'Expired').length}</td></tr>`;
    }).join('');
  }
}

function exportReportCSV(format) {
  const items = _cache.items;
  let csvContent = "data:text/csv;charset=utf-8,SKU,Name,Category,Stock,Unit,Location,Vendor,Status\n";
  items.forEach(i => { csvContent += `"${i.id}","${i.name}","${i.category}","${i.current_stock}","${i.unit}","${i.location}","${i.vendor}","${i.status}"\n`; });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `MSIL_QA_Report_${format.toUpperCase()}_${new Date().toISOString().substring(0,10)}.${format === 'excel' ? 'xls' : 'csv'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Report Exported", `Report downloaded in .${format === 'excel' ? 'xls' : 'csv'} format`, "success");
}





// ==========================================================================
// DEPARTMENT MODULE
// ==========================================================================
function initDepartmentModule() {
  const grid = document.getElementById("departments-cards-grid");
  if (!grid) return;
  grid.innerHTML = _cache.departments.map(d => `
    <div class="dept-card">
      <div class="flex-between">
        <h3 class="font-bold text-main">${d.name}</h3>
        <span class="badge badge-info">Active</span>
      </div>
      <p class="text-muted margin-top-xs">Lead: <strong>${d.manager}</strong></p>
      <div class="cat-mini-stats margin-top-md">
        <span class="mini-stat"><strong>${d.active_skus}</strong> Active SKUs</span>
        <span class="mini-stat"><strong>${d.allocated_units}</strong> Allocated Units</span>
      </div>
      <button class="btn btn-primary-sm full-width margin-top-sm" onclick="alert('Viewing department inventory allocation details')">View Dept Allocation</button>
    </div>
  `).join('');
}

// ==========================================================================
// TRANSACTIONS & EXPIRY TRACKER RENDERERS
// ==========================================================================
function renderTransactions() {
  const tbody = document.getElementById("transactions-history-tbody");
  if (!tbody) return;
  const txs = _cache.transactions;
  if (txs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-muted text-center">No transaction records found.</td></tr>`;
    return;
  }
  tbody.innerHTML = txs.map(t => {
    const badgeClass = t.type === "Inflow" ? "badge-success" : "badge-warning";
    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${t.time}</td>
        <td>${t.item}</td>
        <td><span class="badge ${badgeClass}">${t.type}</span></td>
        <td><strong>${t.qty}</strong></td>
        <td>${t.dept || 'â€”'}</td>
        <td>${t.user || 'â€”'}</td>
        <td>${t.approver || 'â€”'}</td>
        <td>${t.remarks || 'â€”'}</td>
      </tr>
    `;
  }).join('');
}

function renderExpiryTracker() {
  const tbody = document.getElementById("expiry-compliance-tbody");
  if (!tbody) return;
  const items = _cache.items;
  const now = new Date();

  // Only show items that have an expiry/calibration date
  const trackableItems = items.filter(i => i.expiry_date && i.expiry_date !== 'â€”');

  // Sort: expired first, then expiring soonest
  trackableItems.sort((a, b) => {
    const dA = Math.ceil((new Date(a.expiry_date) - now) / 86400000);
    const dB = Math.ceil((new Date(b.expiry_date) - now) / 86400000);
    return dA - dB;
  });

  // Update stat cards
  let cntExpired = 0, cntUrgent = 0, cntWarn = 0, cntValid = 0;
  trackableItems.forEach(i => {
    const d = Math.ceil((new Date(i.expiry_date) - now) / 86400000);
    if (d < 0) cntExpired++;
    else if (d <= 30) cntUrgent++;
    else if (d <= 90) cntWarn++;
    else cntValid++;
  });
  const el = id => document.getElementById(id);
  if (el('expiry-stat-expired')) el('expiry-stat-expired').textContent = cntExpired;
  if (el('expiry-stat-urgent')) el('expiry-stat-urgent').textContent = cntUrgent;
  if (el('expiry-stat-warn')) el('expiry-stat-warn').textContent = cntWarn;
  if (el('expiry-stat-valid')) el('expiry-stat-valid').textContent = cntValid;
  // Update the sidebar navigation badge with real alerts count
  const sidebarBadge = el('sidebar-expiry-badge');
  if (sidebarBadge) {
    const alertCount = cntExpired + cntUrgent;
    sidebarBadge.textContent = alertCount;
    sidebarBadge.style.display = alertCount > 0 ? '' : 'none';
  }

  if (trackableItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted)">No items with expiry or calibration dates found.</td></tr>`;
    return;
  }

  tbody.innerHTML = trackableItems.map(i => {
    const daysLeft = Math.ceil((new Date(i.expiry_date) - now) / 86400000);
    let daysText, actionText, rowClass;
    if (daysLeft < 0) {
      daysText = `<span style="color:#dc3545;font-weight:700;">EXPIRED (${Math.abs(daysLeft)}d ago)</span>`;
      actionText = `<span class="badge badge-danger">Quarantine &amp; Dispose</span>`;
      rowClass = 'style="background:rgba(220,53,69,0.05)"';
    } else if (daysLeft <= 30) {
      daysText = `<span style="color:#e85d04;font-weight:700;">${daysLeft} days</span>`;
      actionText = `<span class="badge badge-danger">Urgent Action</span>`;
      rowClass = 'style="background:rgba(232,93,4,0.05)"';
    } else if (daysLeft <= 90) {
      daysText = `<span style="color:#f4a261;font-weight:600;">${daysLeft} days</span>`;
      actionText = `<span class="badge badge-warning">Reorder / Calibrate</span>`;
      rowClass = 'style="background:rgba(244,162,97,0.05)"';
    } else {
      daysText = `<span style="color:#2ecc71;">${daysLeft} days</span>`;
      actionText = `<span class="badge badge-success">Valid</span>`;
      rowClass = '';
    }
    return `
      <tr ${rowClass}>
        <td><strong>${i.id}</strong></td>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td>${i.batch_number || 'â€”'}</td>
        <td>${i.expiry_date}</td>
        <td>${daysText}</td>
        <td>${i.location || 'â€”'}</td>
        <td>${actionText}</td>
      </tr>
    `;
  }).join('');
}

function renderAnalyticsSuite() {
  const items = _cache.items;
  const elTotal = document.getElementById("analytics-total-skus"); if (elTotal) elTotal.textContent = items.length;
  const elLow = document.getElementById("analytics-low-skus"); if (elLow) elLow.textContent = items.filter(i => i.current_stock <= i.min_level || i.status === "Low Stock").length;
  const elUnits = document.getElementById("analytics-total-units"); if (elUnits) elUnits.textContent = items.reduce((s, i) => s + i.current_stock, 0);
  const elExp = document.getElementById("analytics-expired-skus"); if (elExp) elExp.textContent = items.filter(i => i.status === "Expired").length;

  initCharts();
}

// ==========================================================================
// ADMIN & AUDIT LOGS MODULE
// ==========================================================================
function renderAdminTables() {
  const usersTbody = document.getElementById("admin-users-tbody");
  const auditTbody = document.getElementById("admin-audit-tbody");

  if (usersTbody) {
    usersTbody.innerHTML = _cache.users.map(u => `
      <tr>
        <td><strong>${u.id}</strong></td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><span class="badge badge-info">${u.role}</span></td>
        <td>${u.department}</td>
        <td><span class="badge badge-success">${u.status}</span></td>
        <td><button class="btn btn-outline-sm"><i data-lucide="edit"></i> Edit</button></td>
      </tr>
    `).join('');
  }

  if (auditTbody) {
    auditTbody.innerHTML = _cache.audit.map(l => `
      <tr>
        <td><strong>${l.id}</strong></td>
        <td>${l.time}</td>
        <td>${l.user}</td>
        <td><span class="badge badge-warning">${l.action}</span></td>
        <td>${l.module}</td>
        <td>${l.ip}</td>
        <td>${l.details}</td>
      </tr>
    `).join('');
  }
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function initAdminModule() {
  const openUserBtn = document.getElementById("btn-open-add-user-modal");
  const userForm = document.getElementById("user-registration-form");

  if (openUserBtn) openUserBtn.addEventListener("click", () => openModal("user-modal"));
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newUser = {
        id: document.getElementById("u-id").value,
        name: document.getElementById("u-name").value,
        email: document.getElementById("u-email").value,
        role: document.getElementById("u-role").value,
        department: document.getElementById("u-department").value,
        status: "Active"
      };
      try {
        await API.post('/api/users', newUser);
        document.getElementById("user-modal").classList.add("hidden");
        await refreshCache();
        renderAdminTables();
        showToast("User Created", `Added user account for ${newUser.name}`, "success");
      } catch (err) {
        showToast("Error", "Failed to create user", "danger");
      }
    });
  }
  renderAdminTables();
}

// ==========================================================================
// VENDOR MANAGEMENT SUITE
// ==========================================================================
let uploadedVendorPhotoBase64 = "";

function initVendorModule() {
  const openBtn = document.getElementById("btn-open-add-vendor-modal");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      resetVendorForm();
      openModal("vendor-modal");
    });
  }

  const browseBtn = document.getElementById("btn-browse-vendor-photo");
  const fileInput = document.getElementById("v-photo-file");
  const urlInput = document.getElementById("v-photo-url");
  const previewBox = document.getElementById("v-photo-preview-box");

  if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedVendorPhotoBase64 = event.target.result;
          if (urlInput) urlInput.value = file.name;
          if (previewBox) previewBox.innerHTML = `<img src="${uploadedVendorPhotoBase64}" style="width:100%;height:100%;object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener("input", () => {
      const val = urlInput.value.trim();
      if (val && !val.startsWith("data:")) {
        uploadedVendorPhotoBase64 = "";
        if (previewBox) previewBox.innerHTML = `<img src="${val}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='assets/items/degreaser-solvent.png'">`;
      }
    });
  }

  const form = document.getElementById("vendor-registration-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("v-code").value.trim();
      const name = document.getElementById("v-name").value.trim();
      const contact = document.getElementById("v-contact").value.trim();
      const email = document.getElementById("v-email").value.trim();
      const phone = document.getElementById("v-phone").value.trim();
      const category = document.getElementById("v-category").value;
      const rating = document.getElementById("v-rating").value;
      const status = document.getElementById("v-status").value;
      const address = document.getElementById("v-address").value.trim();
      const photoUrl = urlInput ? urlInput.value.trim() : "";
      const photo = uploadedVendorPhotoBase64 || (photoUrl.startsWith("http") || photoUrl.startsWith("assets") || photoUrl.startsWith("data:") ? photoUrl : "assets/items/degreaser-solvent.png");
      const notes = document.getElementById("v-notes").value.trim() || "ISO 9001 Approved Supplier";

      const vendorData = { code, name, contact, email, phone, category, rating, status, address, photo, notes };

      try {
        await API.post('/api/vendors', vendorData);
        document.getElementById("vendor-modal").classList.add("hidden");
        resetVendorForm();
        await refreshCache();
        renderVendors();
        populateVendorSelectors();
        showToast("Vendor Saved", `Supplier record for ${name} (${code}) saved successfully!`, "success");
      } catch (err) {
        showToast("Error", err.error || "Failed to save vendor", "danger");
      }
    });
  }
}

function resetVendorForm() {
  uploadedVendorPhotoBase64 = "";
  const form = document.getElementById("vendor-registration-form");
  if (form) form.reset();
  const previewBox = document.getElementById("v-photo-preview-box");
  if (previewBox) previewBox.innerHTML = `<i data-lucide="building" style="width: 20px; height: 20px; color: #94A3B8;"></i>`;
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderVendors() {
  const tbody = document.getElementById("vendors-table-tbody");
  if (!tbody) return;

  const vendors = _cache.vendors || [];
  if (vendors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted p-4">No vendors registered yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = vendors.map(v => {
    const photoSrc = v.photo || 'assets/items/degreaser-solvent.png';
    const statusBadge = v.status === 'Approved' ? 'badge-success' : v.status === 'Pending' ? 'badge-warning' : 'badge-danger';
    return `<tr>
      <td>
        <img src="${photoSrc}" alt="${v.name}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #E2E8F0;cursor:pointer;" onerror="this.onerror=null;this.src='assets/items/degreaser-solvent.png';" onclick="openPhotoPreview('${photoSrc}')">
      </td>
      <td><span class="catview-id-badge">${v.code}</span></td>
      <td><strong class="text-primary">${v.name}</strong></td>
      <td><div style="font-weight:600;font-size:13px;">${v.contact}</div></td>
      <td>
        <div style="font-size:12px;font-weight:600;color:#0F172A;">${v.phone || '—'}</div>
        <div style="font-size:11px;color:#64748B;">${v.email}</div>
      </td>
      <td><span class="badge badge-indigo">${v.category}</span></td>
      <td>
        <div class="catview-actions">
          <button class="catview-action-btn btn-edit" title="View Profile" onclick="showVendorDetails('${v.code}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="catview-action-btn btn-add" title="Edit Vendor" onclick="editVendor('${v.code}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="catview-action-btn btn-delete" title="Remove Vendor" onclick="deleteVendor('${v.code}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div>
      </td>
      <td><span style="color:#D97706;font-weight:700;font-size:13px;">${v.rating || '5.0 ★'}</span></td>
      <td><span class="badge ${statusBadge}">${v.status || 'Approved'}</span></td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteVendor('${v.code}')">Remove</button></td>
    </tr>`;
  }).join('');
}

function showVendorDetails(code) {
  const v = _cache.vendors.find(v => v.code === code);
  if (!v) return;

  document.getElementById("vd-name").textContent = v.name;
  document.getElementById("vd-code").textContent = `Vendor Code: ${v.code}`;
  document.getElementById("vd-contact").textContent = v.contact;
  document.getElementById("vd-phone").textContent = v.phone || "N/A";
  document.getElementById("vd-email").textContent = v.email;
  document.getElementById("vd-category").textContent = v.category;
  document.getElementById("vd-rating").textContent = v.rating || "5.0 â˜…";
  document.getElementById("vd-address").textContent = v.address || "Address not specified";
  document.getElementById("vd-notes").textContent = v.notes || "No additional remarks.";

  const statusBadge = document.getElementById("vd-status-badge");
  if (statusBadge) {
    statusBadge.className = `badge ${v.status === 'Approved' ? 'badge-success' : 'badge-warning'}`;
    statusBadge.textContent = v.status || 'Approved';
  }

  const photoEl = document.getElementById("vd-photo");
  if (photoEl) photoEl.src = v.photo || 'assets/items/degreaser-solvent.png';

  const items = _cache.items.filter(i => i.vendor && i.vendor.toLowerCase().includes(v.name.toLowerCase()));
  const tbody = document.getElementById("vd-items-tbody");
  if (tbody) {
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No items linked to this vendor yet.</td></tr>`;
    } else {
      tbody.innerHTML = items.map(i => `<tr>
        <td><strong>${i.id}</strong></td>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td><strong>${i.current_stock} ${i.unit}</strong></td>
        <td>${i.location || 'â€”'}</td>
      </tr>`).join('');
    }
  }

  openModal("vendor-detail-modal");
}

function editVendor(code) {
  const v = _cache.vendors.find(v => v.code === code);
  if (!v) return;

  document.getElementById("v-code").value = v.code;
  document.getElementById("v-name").value = v.name;
  document.getElementById("v-contact").value = v.contact;
  document.getElementById("v-email").value = v.email;
  document.getElementById("v-phone").value = v.phone || "";
  document.getElementById("v-category").value = v.category;
  document.getElementById("v-rating").value = v.rating || "4.8 â˜…";
  document.getElementById("v-status").value = v.status || "Approved";
  document.getElementById("v-address").value = v.address || "";
  document.getElementById("v-notes").value = v.notes || "";
  document.getElementById("v-photo-url").value = v.photo || "";

  const previewBox = document.getElementById("v-photo-preview-box");
  if (previewBox && v.photo) {
    previewBox.innerHTML = `<img src="${v.photo}" style="width:100%;height:100%;object-fit:cover;">`;
  }

  openModal("vendor-modal");
}

async function deleteVendor(code) {
  if (!confirm(`Are you sure you want to delete vendor ${code}? This action cannot be undone.`)) return;
  try {
    await API.delete(`/api/vendors/${code}`);
    await refreshCache();
    renderVendors();
    populateVendorSelectors();
    showToast("Vendor Deleted", `Vendor ${code} removed from registry`, "warning");
  } catch (err) {
    showToast("Delete Error", err.error || "Failed to delete vendor", "danger");
  }
}

// ==========================================================================
// TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showToast(title, message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;
  const iconName = type === "success" ? "check-circle" : type === "danger" ? "alert-circle" : type === "warning" ? "alert-triangle" : "info";
  toast.innerHTML = `<i data-lucide="${iconName}"></i><div class="toast-content"><p>${title}</p><small>${message}</small></div>`;
  container.appendChild(toast);
  if (typeof lucide !== "undefined") lucide.createIcons();
  setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateX(100%)"; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ==========================================================================
// MAIN DASHBOARD RENDERER & INTERACTIVE CHARTS
// ==========================================================================
function renderDashboard() {
  const items = _cache.items;

  // 1. Update Stat Cards
  const lowStockCount = items.filter(i => i.current_stock <= i.min_level || i.status === "Low Stock").length;
  const expiredCount = items.filter(i => i.status === "Expired").length;
  const outStockCount = items.filter(i => i.current_stock === 0 || i.status === "Out of Stock").length;

  const elTotal = document.getElementById("stat-total-inv"); if (elTotal) elTotal.textContent = items.length;
  const elLow = document.getElementById("stat-low-stock"); if (elLow) elLow.textContent = lowStockCount;
  const elOut = document.getElementById("stat-out-stock"); if (elOut) elOut.textContent = outStockCount;
  const elExpired = document.getElementById("stat-expired"); if (elExpired) elExpired.textContent = expiredCount;

  const matchCat = (cat, target) => {
    if (!cat) return false;
    const c = cat.trim().toLowerCase();
    const t = target.trim().toLowerCase();
    if (c === t) return true;
    if (t === 'chemicals' && c === 'chemical') return true;
    if (t === 'gases' && c === 'gas') return true;
    if (t === 'tools' && c === 'tool') return true;
    if (t === 'crms' && c === 'crm') return true;
    return false;
  };

  const setMiniCount = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setMiniCount("mini-count-chemicals", items.filter(i => matchCat(i.category, "Chemicals")).length);
  setMiniCount("mini-count-crms", items.filter(i => matchCat(i.category, "CRMs")).length);
  setMiniCount("mini-count-consumables", items.filter(i => matchCat(i.category, "Equipment Consumables")).length);
  setMiniCount("mini-count-spares", items.filter(i => matchCat(i.category, "Equipment Spares")).length);
  setMiniCount("mini-count-gases", items.filter(i => matchCat(i.category, "Gases")).length);
  setMiniCount("mini-count-tools", items.filter(i => matchCat(i.category, "Tools")).length);

  // Category accordion stats
  const chemSKUs = items.filter(i => i.category === "Chemicals");
  const elChemActive = document.getElementById("cat-stat-chem-active"); if (elChemActive) elChemActive.textContent = chemSKUs.length;
  const elChemLow = document.getElementById("cat-stat-chem-low"); if (elChemLow) elChemLow.textContent = chemSKUs.filter(i => i.status === "Low Stock").length;
  const elChemExp = document.getElementById("cat-stat-chem-exp"); if (elChemExp) elChemExp.textContent = chemSKUs.filter(i => i.status === "Expired").length;

  // 2. Featured Cards
  const featuredGrid = document.getElementById("dashboard-featured-cards-grid");
  if (featuredGrid) renderCatalogGrid(items.slice(0, 4), featuredGrid);

  // 3. Activity Log
  const activityTbody = document.getElementById("dashboard-activity-log-tbody");
  if (activityTbody) {
    const txs = _cache.transactions.slice(0, 6);
    activityTbody.innerHTML = txs.map(t => {
      const badgeClass = t.type === "Inflow" ? "badge-success" : "badge-warning";
      return `<tr><td>${t.time}</td><td><strong>${t.item}</strong></td><td>${t.type} (${t.qty})</td><td>${t.user}</td><td>${t.dept}</td><td><span class="badge ${badgeClass}">Completed</span></td></tr>`;
    }).join('');
  }

  // 4. Charts
  initCharts();
}

function initCharts() {
  if (typeof Chart === "undefined") return;
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = "#64748B";

  const colors = { navy: '#002F6C', navyLight: '#1B4F8A', red: '#E31837', blue: '#0082C8', green: '#10B981', orange: '#F59E0B', purple: '#8B5CF6', gray: '#64748B' };
  const items = _cache.items;

  function createOrUpdateChart(canvasId, config) {
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    const canvas = document.getElementById(canvasId);
    if (canvas) chartInstances[canvasId] = new Chart(canvas.getContext('2d'), config);
  }

  const cats = ['Chemicals', 'CRMs', 'Equipment Consumables', 'Equipment Spares', 'Gases', 'Tools'];

  // Chart 1: Category Distribution (Doughnut) - Dashboard & Analytics Suite
  const catData = {
    labels: cats,
    datasets: [{ data: cats.map(c => items.filter(i => i.category === c).length), backgroundColor: [colors.blue, colors.purple, colors.orange, colors.navy, colors.green, colors.red], borderWidth: 2 }]
  };
  const catOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };
  createOrUpdateChart('chart-category', { type: 'doughnut', data: catData, options: catOptions });
  createOrUpdateChart('analytics-chart-category', { type: 'doughnut', data: catData, options: catOptions });

  // Chart 2: Inventory Status (Bar)
  const statusData = {
    labels: ['Chemicals', 'CRMs', 'Consumables', 'Spares', 'Gases', 'Tools'],
    datasets: [
      { label: 'In Stock', data: cats.map(c => items.filter(i => i.category === c && i.status === 'In Stock').length), backgroundColor: colors.green },
      { label: 'Low Stock', data: cats.map(c => items.filter(i => i.category === c && i.status === 'Low Stock').length), backgroundColor: colors.orange },
      { label: 'Expired / Out', data: cats.map(c => items.filter(i => i.category === c && (i.status === 'Expired' || i.status === 'Out of Stock')).length), backgroundColor: colors.red }
    ]
  };
  const statusOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } };
  createOrUpdateChart('chart-status', { type: 'bar', data: statusData, options: statusOptions });
  createOrUpdateChart('analytics-chart-status', { type: 'bar', data: statusData, options: statusOptions });

  // Chart 3: Monthly Transactions (Line)
  const txData = {
    labels: ['Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026'],
    datasets: [
      { label: 'Stock Inflow', data: [1200, 1450, 1100, 1600, 1350, 1450], borderColor: colors.green, tension: 0.3, fill: false },
      { label: 'Stock Outflow', data: [850, 920, 780, 1100, 950, 892], borderColor: colors.red, tension: 0.3, fill: false }
    ]
  };
  const txOptions = { responsive: true, maintainAspectRatio: false };
  createOrUpdateChart('chart-transactions', { type: 'line', data: txData, options: txOptions });
  createOrUpdateChart('analytics-chart-transactions', { type: 'line', data: txData, options: txOptions });

  // Chart 4: Vendor Performance (Horizontal Bar)
  const vendorData = {
    labels: _cache.vendors.map(v => v.name.substring(0, 15)),
    datasets: [{ label: 'Vendor Rating', data: _cache.vendors.map(v => parseFloat(v.rating) || 4.5), backgroundColor: colors.navy }]
  };
  const vendorOptions = { indexAxis: 'y', responsive: true, maintainAspectRatio: false };
  createOrUpdateChart('chart-vendors', { type: 'bar', data: vendorData, options: vendorOptions });
  createOrUpdateChart('analytics-chart-vendors', { type: 'bar', data: vendorData, options: vendorOptions });

  // Chart 5: Department Analysis (Radar)
  const deptData = {
    labels: _cache.departments.map(d => d.name),
    datasets: [{ label: 'Active Material Allocation', data: _cache.departments.map(d => d.allocated_units), backgroundColor: 'rgba(0, 47, 108, 0.2)', borderColor: colors.navy, pointBackgroundColor: colors.red }]
  };
  const deptOptions = { responsive: true, maintainAspectRatio: false };
  createOrUpdateChart('chart-departments', { type: 'radar', data: deptData, options: deptOptions });
  createOrUpdateChart('analytics-chart-departments', { type: 'radar', data: deptData, options: deptOptions });

  // Chart 6: Expiry Analysis (Doughnut)
  const now = new Date();
  const expired = items.filter(i => i.status === 'Expired' || (i.expiry_date && new Date(i.expiry_date) < now)).length;
  const expiring30 = items.filter(i => { if (!i.expiry_date) return false; const d = (new Date(i.expiry_date) - now) / 86400000; return d >= 0 && d <= 30; }).length;
  const valid = items.filter(i => { if (!i.expiry_date) return false; const d = (new Date(i.expiry_date) - now) / 86400000; return d > 90; }).length;
  const calDue = items.filter(i => { if (!i.expiry_date) return false; const d = (new Date(i.expiry_date) - now) / 86400000; return d > 30 && d <= 90; }).length;

  const expiryData = {
    labels: ['Expired (Action Req)', 'Expiring in 30 Days', 'Valid > 90 Days', 'Calibration Due'],
    datasets: [{ data: [expired, expiring30, valid, calDue], backgroundColor: [colors.red, colors.orange, colors.green, colors.purple] }]
  };
  const expiryOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };
  createOrUpdateChart('chart-expiry', { type: 'doughnut', data: expiryData, options: expiryOptions });
  createOrUpdateChart('analytics-chart-expiry', { type: 'doughnut', data: expiryData, options: expiryOptions });

  // Chart 7: Low Stock Analysis (Bar)
  const lowItems = items.filter(i => i.current_stock <= i.min_level).slice(0, 5);
  createOrUpdateChart('chart-lowstock', {
    type: 'bar',
    data: {
      labels: lowItems.map(i => i.name.substring(0, 18)),
      datasets: [
        { label: 'Current Qty', data: lowItems.map(i => i.current_stock), backgroundColor: colors.orange },
        { label: 'Safety Limit', data: lowItems.map(i => i.min_level), backgroundColor: colors.gray }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Chart 8: Inventory Trends (Area)
  const totalStock = items.reduce((s, i) => s + i.current_stock, 0);
  createOrUpdateChart('chart-trends', {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ label: 'Total Stock Volume Trajectory', data: [Math.round(totalStock * 0.95), Math.round(totalStock * 0.97), Math.round(totalStock * 0.99), totalStock], borderColor: colors.blue, backgroundColor: 'rgba(0, 130, 200, 0.15)', fill: true, tension: 0.4 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Chart 9: Stock Flow Mini-Chart
  createOrUpdateChart('chart-stock-flow', {
    type: 'line',
    data: {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        { label: 'In', data: [120, 145, 110, 160, 135, 145], borderColor: colors.navy, borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false },
        { label: 'Out', data: [85, 92, 78, 110, 95, 89], borderColor: colors.red, borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  });
}

// ==========================================================================
// CATEGORY INVENTORY VIEWS
// ==========================================================================
const CATEGORY_VIEW_CONFIG = [
  { id: 'chemicals',   category: 'Chemicals',             searchId: 'chem-search',   subId: 'chem-sub-filter',   statusId: 'chem-status-filter',   tbodyId: 'catview-tbody-chemicals' },
  { id: 'crms',        category: 'CRMs',                  searchId: 'crms-search',   subId: 'crms-sub-filter',   statusId: 'crms-status-filter',   tbodyId: 'catview-tbody-crms' },
  { id: 'consumables', category: 'Equipment Consumables', searchId: 'cons-search',   subId: 'cons-sub-filter',   statusId: 'cons-status-filter',   tbodyId: 'catview-tbody-consumables' },
  { id: 'spares',      category: 'Equipment Spares',      searchId: 'spares-search', subId: 'spares-sub-filter', statusId: 'spares-status-filter', tbodyId: 'catview-tbody-spares' },
  { id: 'gases',       category: 'Gases',                 searchId: 'gases-search',  subId: 'gases-sub-filter',  statusId: 'gases-status-filter',  tbodyId: 'catview-tbody-gases' },
  { id: 'tools',       category: 'Tools',                 searchId: 'tools-search',  subId: 'tools-sub-filter',  statusId: 'tools-status-filter',  tbodyId: 'catview-tbody-tools' }
];

function initCategoryViews() {
  CATEGORY_VIEW_CONFIG.forEach(cfg => {
    renderCategoryView(cfg);
    const searchEl = document.getElementById(cfg.searchId);
    if (searchEl) searchEl.addEventListener('input', () => renderCategoryView(cfg));
    const subEl = document.getElementById(cfg.subId);
    if (subEl) subEl.addEventListener('change', () => renderCategoryView(cfg));
    const statusEl = document.getElementById(cfg.statusId);
    if (statusEl) statusEl.addEventListener('change', () => renderCategoryView(cfg));
  });

  document.querySelectorAll('.sidebar-nav li[data-view]').forEach(li => {
    li.addEventListener('click', () => {
      const viewId = li.getAttribute('data-view');
      const cfg = CATEGORY_VIEW_CONFIG.find(c => c.id + '-view' === viewId);
      if (cfg) setTimeout(() => renderCategoryView(cfg), 50);
    });
  });

  window.exportCategoryCSV = exportCategoryCSV;
}

function renderCategoryView(cfg) {
  const tbody = document.getElementById(cfg.tbodyId);
  if (!tbody) return;

  const matchCategory = (cat, target) => {
    if (!cat) return false;
    const c = cat.trim().toLowerCase();
    const t = target.trim().toLowerCase();
    if (c === t) return true;
    if (t === 'chemicals' && c === 'chemical') return true;
    if (t === 'gases' && c === 'gas') return true;
    if (t === 'tools' && c === 'tool') return true;
    if (t === 'crms' && c === 'crm') return true;
    return false;
  };

  let items = _cache.items.filter(i => matchCategory(i.category, cfg.category));

  const searchEl = document.getElementById(cfg.searchId);
  const query = searchEl ? searchEl.value.toLowerCase().trim() : '';
  if (query) items = items.filter(i => i.name.toLowerCase().includes(query) || i.id.toLowerCase().includes(query) || (i.location && i.location.toLowerCase().includes(query)) || (i.vendor && i.vendor.toLowerCase().includes(query)) || (i.subcategory && i.subcategory.toLowerCase().includes(query)));

  const subEl = document.getElementById(cfg.subId);
  const subVal = subEl ? subEl.value : '';
  if (subVal) items = items.filter(i => i.subcategory === subVal);

  const statusEl = document.getElementById(cfg.statusId);
  const statusVal = statusEl ? statusEl.value : '';
  if (statusVal) items = items.filter(i => i.status === statusVal);

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="catview-empty">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M20.85 17A9 9 0 004.15 4.15M10 14a4 4 0 004-4"/></svg>
      <p>No items found matching your search criteria.</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const statusClass = item.status === 'In Stock' ? 'status-instock' : item.status === 'Low Stock' ? 'status-low' : item.status === 'Out of Stock' ? 'status-out' : 'status-expired';
    const expiryFormatted = item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A';
    const daysLeft = item.expiry_date ? Math.ceil((new Date(item.expiry_date) - new Date()) / 86400000) : 999;
    const expiryClass = daysLeft < 0 ? 'expired' : daysLeft < 60 ? 'near' : 'ok';
    const statusDot = item.status === 'In Stock' ? 'â—' : item.status === 'Low Stock' ? 'âš ' : 'âœ•';
    const imgHtml = item.image ? `<img src="${item.image}" alt="${item.name}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;" onerror="this.onerror=null;this.src='assets/items/degreaser-solvent.png';">` : `<div class="catview-img-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;
    return `<tr>
      <td>${imgHtml}</td>
      <td><span class="catview-id-badge">${item.id}</span></td>
      <td><div class="catview-item-name">${item.name}</div><div class="catview-item-sub">${item.subcategory || ''}</div></td>
      <td><div style="font-size:12px;font-weight:600;">${item.size || item.unit}</div><div style="font-size:11px;color:#94A3B8;">${item.unit}</div></td>
      <td style="font-size:12px;">${item.location || 'â€”'}</td>
      <td><div class="catview-qty">${item.current_stock} <span class="catview-qty-unit">${item.unit}</span></div></td>
      <td><span class="catview-expiry ${expiryClass}">${expiryFormatted}</span></td>
      <td><span class="catview-status ${statusClass}">${statusDot} ${item.status}</span></td>
      <td>
        <div class="catview-actions">
          <button class="catview-action-btn btn-add" title="Add Stock" onclick="openModal('add-stock-modal',{category:'${item.category}'})"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg></button>
          <button class="catview-action-btn btn-minus" title="Remove Stock" onclick="openModal('remove-stock-modal',{category:'${item.category}'})"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/></svg></button>
          <button class="catview-action-btn btn-qr" title="Print QR" onclick="switchView('qr-suite-view')"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='7' height='7'/><rect x='14' y='3' width='7' height='7'/><rect x='3' y='14' width='7' height='7'/><rect x='14' y='14' width='7' height='7'/></svg></button>
          <button class="catview-action-btn btn-delete" title="Delete Item" onclick="deleteItem('${item.id}')" style="color:#ef4444;"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/></svg></button>
        </div>
      </td>
    </tr>`;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function exportCategoryCSV(category) {
  const items = _cache.items.filter(i => i.category === category);
  const headers = ['Item ID','Item Name','Subcategory','Size','Unit','Location','Stock','Min Level','Status','Expiry Date','Vendor','Batch No'];
  const rows = items.map(i => [i.id, `"${i.name}"`, i.subcategory || '', i.size || '', i.unit, `"${i.location || ''}"`, i.current_stock, i.min_level, i.status, i.expiry_date || '', `"${i.vendor || ''}"`, i.batch_number || '']);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${category.replace(/\s+/g,'-').toLowerCase()}-inventory-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Export Complete', `${category} inventory exported as CSV`, 'success');
}

