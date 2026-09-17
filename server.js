// Maruti Suzuki QA Lab - Express + sql.js Backend Server
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { AsyncLocalStorage } from 'node:async_hooks';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'inventory.db.json');

const asyncLocalStorage = new AsyncLocalStorage();

app.use(cors());
app.use(express.json());

// Context middleware to track logged-in user email
app.use((req, res, next) => {
  const userEmail = req.headers['x-user-email'] || 'admin@qa.com';
  asyncLocalStorage.run(userEmail, () => {
    next();
  });
});

// =============================================================================
// PURE-JS DATABASE (using sql.js stored as JSON for persistence)
// =============================================================================

// We'll use a simple JSON file as our "database" since sql.js needs WASM loading
// This is fast and works everywhere without native compilation.

let dbData = {
  inventory_items: [],
  vendors: [],
  departments: [],
  users: [],
  stock_transactions: [],
  audit_logs: []
};

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      console.log('✅ Database loaded from file.');
      return;
    }
  } catch (e) {
    console.warn('Could not load DB file, seeding fresh:', e.message);
  }
  seedData();
  saveDB();
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
}

function genId(prefix) {
  return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

function logAudit(action, module, details) {
  const userEmail = asyncLocalStorage.getStore() || 'admin@qa.com';
  dbData.audit_logs.unshift({
    id: genId('AUD'),
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: userEmail,
    action, module,
    ip: '192.168.1.8',
    details,
    created_at: new Date().toISOString()
  });
  saveDB();
}

function seedData() {
  console.log('Seeding initial data...');
  dbData.inventory_items = [
    {id:"CHEM-DEG-3091",name:"Industrial Degreaser Solvent",description:"High-purity solvent for engine assembly degreasing and surface prep.",category:"Chemicals",subcategory:"Solvents",department:"Paint Shop",vendor:"Merck KGaA Speciality Chem",location:"Chem Vault 3, Aisle A",manufacturer:"Merck KGaA",po_number:"PO-2026-901",expiry_date:"2026-11-15",batch_number:"LOT-DEG-9920",size:"5 Liters Can",unit:"Liters",current_stock:120,max_level:250,min_level:30,reorder_level:40,status:"In Stock",remarks:"Flammable Liquid - Store below 25°C",image:"assets/items/degreaser-solvent.png",last_updated:"2026-07-21 11:45"},
    {id:"CHEM-ACE-1049",name:"Acetone Analytical Grade 99.9%",description:"Pure analytical acetone for laboratory titration and spectrophotometry.",category:"Chemicals",subcategory:"Reagents",department:"Quality Assurance",vendor:"Sigma Aldrich India",location:"Chem Vault 1, Cabinet B",manufacturer:"Sigma Aldrich",po_number:"PO-2026-881",expiry_date:"2027-02-10",batch_number:"LOT-ACE-4410",size:"2.5 Liters Bottle",unit:"Liters",current_stock:85,max_level:150,min_level:20,reorder_level:25,status:"In Stock",remarks:"Hazardous - Fume Hood handling required",image:"assets/items/degreaser-solvent.png",last_updated:"2026-07-20 16:30"},
    {id:"CHEM-THN-4011",name:"Synthetic Paint Thinner T-40",description:"Low-viscosity paint thinner for automated body coating sprayers.",category:"Chemicals",subcategory:"Paints & Thinners",department:"Paint Shop",vendor:"Asian Paints Enterprise",location:"Paint Shop Storage, Shelf 4",manufacturer:"Asian Paints",po_number:"PO-2026-102",expiry_date:"2026-06-30",batch_number:"LOT-THN-1102",size:"20 Liters Drum",unit:"Liters",current_stock:12,max_level:200,min_level:25,reorder_level:30,status:"Low Stock",remarks:"Reorder required immediately",image:"assets/items/degreaser-solvent.png",last_updated:"2026-07-21 09:15"},
    {id:"CRM-CAL-9902",name:"Calibration Standard (CRM-098)",description:"NIST-traceable metallic alloy reference standard for OES spectrometry.",category:"CRMs",subcategory:"Spectrometer Standards",department:"Quality Assurance",vendor:"NIST Certified Standards Inc",location:"QC Lab, Cabinet 2",manufacturer:"NIST",po_number:"PO-2026-554",expiry_date:"2026-09-01",batch_number:"CRM-2026-098",size:"Disc Set (5 pcs)",unit:"lots",current_stock:0,max_level:10,min_level:2,reorder_level:3,status:"Out of Stock",remarks:"Critical bottleneck - Requisition pending approval",image:"assets/items/calibration-crm.png",last_updated:"2026-07-21 09:20"},
    {id:"CRM-HRD-2201",name:"Steel Hardness Calibration Block HRC-60",description:"Certified Rockwell C-scale hardness test block for durometer verification.",category:"CRMs",subcategory:"Hardness Standards",department:"Quality Assurance",vendor:"Mitutoyo Instrument Co",location:"Metrology Lab, Safe 1",manufacturer:"Mitutoyo",po_number:"PO-2026-771",expiry_date:"2027-12-31",batch_number:"BLK-HRC-609",size:"Single Block",unit:"pcs",current_stock:15,max_level:30,min_level:5,reorder_level:8,status:"In Stock",remarks:"Store in anti-rust oil paper",image:"assets/items/calibration-crm.png",last_updated:"2026-07-19 14:10"},
    {id:"CRM-VIS-4409",name:"Viscosity Calibration Reference Oil",description:"Standard oil 500cSt for viscometer calibration tests.",category:"CRMs",subcategory:"Viscosity Standards",department:"Quality Assurance",vendor:"Cannon Instrument Co",location:"Rheology Desk, Rack 3",manufacturer:"Cannon",po_number:"PO-2026-309",expiry_date:"2026-07-10",batch_number:"OIL-VIS-881",size:"500ml Bottle",unit:"lots",current_stock:8,max_level:25,min_level:3,reorder_level:5,status:"Expired",remarks:"Batch expired - Quarantined for disposal",image:"assets/items/calibration-crm.png",last_updated:"2026-07-18 10:00"},
    {id:"CONS-BAT-2291",name:"Lithium-Ion Battery Cell Pack 48V",description:"High-density lithium cell pack for automated guided vehicles (AGV).",category:"Equipment Consumables",subcategory:"Battery Cells",department:"Assembly Line 2",vendor:"Panasonic Industrial Corp",location:"Whse B, Climate Zone 2",manufacturer:"Panasonic",po_number:"PO-2026-449",expiry_date:"2027-08-30",batch_number:"BAT-48V-9920",size:"Pack of 12",unit:"units",current_stock:42,max_level:200,min_level:50,reorder_level:60,status:"Low Stock",remarks:"Climate controlled storage required (18-22°C)",image:"assets/items/battery-cell.png",last_updated:"2026-07-21 16:15"},
    {id:"CONS-FLT-8812",name:"HEPA Air Intake Filter Elements",description:"Ultra-fine air filter elements for paint shop cleanroom ventilation.",category:"Equipment Consumables",subcategory:"Filters",department:"Paint Shop",vendor:"Mann+Hummel India",location:"Whse A, Rack 14",manufacturer:"Mann+Hummel",po_number:"PO-2026-662",expiry_date:"2028-01-15",batch_number:"FLT-HP-3301",size:"Cartridge 600x600mm",unit:"pcs",current_stock:180,max_level:500,min_level:40,reorder_level:60,status:"In Stock",remarks:"Inspect monthly for dust load",image:"assets/items/battery-cell.png",last_updated:"2026-07-20 11:30"},
    {id:"SPARE-CRK-4819",name:"Engine Crankshaft Assembly (4-Cyl)",description:"Forged alloy steel engine crankshaft assembly for 1.2L K-Series engine.",category:"Equipment Spares",subcategory:"Engine Parts",department:"Engine Shop",vendor:"Maruti Suzuki Spares Div",location:"Whse A, Aisle 12, Rack C",manufacturer:"Maruti Suzuki",po_number:"PO-2026-001",expiry_date:"2030-12-31",batch_number:"CRK-K12-881",size:"Assembly Crate",unit:"units",current_stock:15,max_level:50,min_level:5,reorder_level:8,status:"In Stock",remarks:"Calibration verification completed",image:"assets/items/engine-crankshaft.png",last_updated:"2026-07-21 11:45"},
    {id:"SPARE-MTR-9920",name:"AC Servo Motor Drive Unit 5kW",description:"Precision brushless servo motor for robotic arm welding station.",category:"Equipment Spares",subcategory:"Motors & Drives",department:"Assembly Line 1",vendor:"Fanuc Robotics India",location:"Whse C, Heavy Rack 4",manufacturer:"Fanuc",po_number:"PO-2026-993",expiry_date:"2032-05-20",batch_number:"MTR-FAN-5510",size:"Single Unit",unit:"pcs",current_stock:6,max_level:15,min_level:2,reorder_level:3,status:"In Stock",remarks:"Backup motor for Line 1 robot 4",image:"assets/items/engine-crankshaft.png",last_updated:"2026-07-17 15:40"},
    {id:"GAS-NIT-5011",name:"Compressed Nitrogen Gas Cylinder 47L",description:"High-purity 99.999% nitrogen gas cylinder for tire leak testing and inerting.",category:"Gases",subcategory:"Inert Gases",department:"Quality Assurance",vendor:"Linde India Ltd",location:"Gas Cylinder Bank 1",manufacturer:"Linde",po_number:"PO-2026-221",expiry_date:"2028-10-15",batch_number:"CYL-N2-9901",size:"47 Liters 200 Bar",unit:"cylinders",current_stock:60,max_level:100,min_level:15,reorder_level:20,status:"In Stock",remarks:"Pressure gauge inspection verified",image:"assets/items/calibration-crm.png",last_updated:"2026-07-21 14:02"},
    {id:"TOOL-TRQ-8820",name:"Precision Digital Torque Wrench 10-100 Nm",description:"Calibrated digital torque wrench with bluetooth logging for chassis bolts.",category:"Tools",subcategory:"Torque Tools",department:"Assembly Line 1",vendor:"Snap-on Tools India",location:"Tool Crib 1, Drawer 4",manufacturer:"Snap-on",po_number:"PO-2026-339",expiry_date:"2026-12-15",batch_number:"TRQ-SNP-441",size:"1/2-inch Drive",unit:"pcs",current_stock:32,max_level:60,min_level:10,reorder_level:12,status:"In Stock",remarks:"Calibration due in Dec 2026",image:"assets/items/engine-crankshaft.png",last_updated:"2026-07-21 15:30"}
  ];
    dbData.vendors = [
    {code:"VEND-MERCK-01",name:"Merck KGaA Speciality Chem",contact:"Dr. Rajesh Khanna",email:"orders@merck.com",phone:"+91 98100 12345",address:"Plot No. 42, Sector 18, Industrial Area, Gurugram, Haryana - 122015",category:"Chemicals",rating:"4.9 ★",status:"Approved",photo:"assets/items/degreaser-solvent.png",notes:"ISO 9001 Certified Supplier for High-Purity Solvents & Reagents."},
    {code:"VEND-SIGMA-02",name:"Sigma Aldrich India",contact:"Priya Sharma",email:"sales@sigmaaldrich.in",phone:"+91 98200 54321",address:"3rd Floor, Electronics City Phase 1, Bengaluru, Karnataka - 560100",category:"Chemicals",rating:"4.8 ★",status:"Approved",photo:"assets/items/degreaser-solvent.png",notes:"Primary analytical reagent & chemical standards provider."},
    {code:"VEND-NIST-03",name:"NIST Certified Standards Inc",contact:"Arthur Pendelton",email:"info@nist-standards.org",phone:"+1 800 555 0199",address:"100 Bureau Drive, Gaithersburg, MD 20899, USA",category:"CRMs",rating:"5.0 ★",status:"Approved",photo:"assets/items/calibration-crm.png",notes:"Accredited NIST reference materials & calibration blocks."},
    {code:"VEND-PANASONIC-04",name:"Panasonic Industrial Corp",contact:"Sanjay Verma",email:"batteries@panasonic.co.in",phone:"+91 98111 88776",address:"Industrial Complex Phase 2, Sector 8, IMT Manesar, Gurugram, Haryana - 122050",category:"Equipment Consumables",rating:"4.7 ★",status:"Approved",photo:"assets/items/battery-cell.png",notes:"AGV Lithium cell supplier & industrial electronics."},
    {code:"VEND-FANUC-05",name:"Fanuc Robotics India",contact:"Takahiro Sato",email:"spares@fanuc.co.in",phone:"+91 124 400 9900",address:"Plot No. 410, Cyber City, Phase 3, Gurugram, Haryana - 122002",category:"Equipment Spares",rating:"4.9 ★",status:"Approved",photo:"assets/items/engine-crankshaft.png",notes:"OEM robotics spare parts & AC servo motor drive units."},
    {code:"VEND-LINDE-06",name:"Linde India Ltd",contact:"Vikram Malhotra",email:"gases@linde.co.in",phone:"+91 11 2600 4400",address:"Gas Plant Road, Okhla Industrial Area Phase 3, New Delhi - 110020",category:"Gases",rating:"4.8 ★",status:"Approved",photo:"assets/items/calibration-crm.png",notes:"Ultra-high purity 99.999% nitrogen & argon gas cylinder supplier."}
  ];

  dbData.departments = [
    {name:"Quality Assurance",manager:"Vikram Aditya",active_skus:18,allocated_units:420},
    {name:"Paint Shop",manager:"Anjali Mehta",active_skus:12,allocated_units:380},
    {name:"Assembly Line 1",manager:"Karan Sharma",active_skus:24,allocated_units:910},
    {name:"Assembly Line 2",manager:"Rajesh Patel",active_skus:20,allocated_units:840},
    {name:"Engine Shop",manager:"Deepak Verma",active_skus:15,allocated_units:520},
    {name:"R&D",manager:"Dr. Sunita Rao",active_skus:9,allocated_units:195}
  ];

  dbData.users = [
    {id:"USR-QA-001",name:"Vikram Aditya",email:"admin@qa.com",role:"Operations Manager",department:"Quality Assurance",status:"Active"},
    {id:"USR-QA-002",name:"Anjali Mehta",email:"anjali@qa.com",role:"QA Inspector",department:"Paint Shop",status:"Active"},
    {id:"USR-QA-003",name:"Karan Sharma",email:"karan@qa.com",role:"Lab Technician",department:"Assembly Line 1",status:"Active"},
    {id:"USR-QA-004",name:"Rajesh Patel",email:"rajesh@qa.com",role:"Procurement Specialist",department:"Assembly Line 2",status:"Active"}
  ];

  dbData.stock_transactions = [
    {id:"TX-9011",time:"17:42 PM",item:"Industrial Degreaser Solvent",type:"Outflow",qty:15,dept:"Assembly Line 2",user:"Karan Sharma",approver:"MGR-VIKRAM-09",remarks:"Stock Issued for Line 2 prep",created_at:new Date().toISOString()},
    {id:"TX-9010",time:"16:15 PM",item:"Lithium-Ion Battery Cell Pack 48V",type:"Inflow",qty:20,dept:"Procurement",user:"Vikram Aditya",approver:"MGR-VIKRAM-09",remarks:"Shipment received via PO-449",created_at:new Date().toISOString()},
    {id:"TX-9009",time:"14:02 PM",item:"Compressed Nitrogen Gas Cylinder 47L",type:"Inflow",qty:10,dept:"Paint Shop",user:"Rajesh Patel",approver:"MGR-ANJALI-02",remarks:"Cylinder bank refill",created_at:new Date().toISOString()}
  ];

  dbData.audit_logs = [
    {id:"AUD-1001",time:"2026-07-21 12:15",user:"admin@qa.com",action:"ADD_STOCK",module:"Inventory",ip:"192.168.1.8",details:"Added 15 units to Industrial Degreaser Solvent",created_at:new Date().toISOString()},
    {id:"AUD-1000",time:"2026-07-21 10:45",user:"admin@qa.com",action:"REGISTER_ITEM",module:"Chemicals",ip:"192.168.1.8",details:"Registered item Acetone Analytical Grade",created_at:new Date().toISOString()}
  ];

  console.log('Seed complete.');
}

// Initialize DB
loadDB();

// =============================================================================
// INVENTORY ITEMS API
// =============================================================================
app.get('/api/items', (req, res) => {
  res.json(dbData.inventory_items);
});

app.get('/api/items/:id', (req, res) => {
  const item = dbData.inventory_items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const item = req.body;
  if (dbData.inventory_items.find(i => i.id === item.id)) {
    return res.status(400).json({ error: 'Item ID already exists' });
  }
  item.last_updated = new Date().toISOString().replace('T', ' ').substring(0, 16);
  item.status = item.status || 'In Stock';
  item.image = item.image || 'assets/items/engine-crankshaft.png';
  dbData.inventory_items.unshift(item);
  logAudit('REGISTER_ITEM', item.category, `Registered new item ${item.name} (${item.id})`);
  saveDB();
  res.json({ success: true, item });
});

app.put('/api/items/:id', (req, res) => {
  const idx = dbData.inventory_items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const updated = { ...dbData.inventory_items[idx], ...req.body, last_updated: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  dbData.inventory_items[idx] = updated;
  logAudit('UPDATE_ITEM', updated.category, `Updated item ${updated.name}`);
  saveDB();
  res.json({ success: true, item: updated });
});

app.delete('/api/items/:id', (req, res) => {
  const idx = dbData.inventory_items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const item = dbData.inventory_items[idx];
  dbData.inventory_items.splice(idx, 1);
  logAudit('DELETE_ITEM', item.category, `Deleted item ${item.name} (${item.id})`);
  saveDB();
  res.json({ success: true });
});

// =============================================================================
// ADD STOCK
// =============================================================================
app.post('/api/items/:id/add-stock', (req, res) => {
  const { qty, location, vendor, batch, remarks, dateStr, timeStr } = req.body;
  const item = dbData.inventory_items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const addQty = parseInt(qty, 10);
  item.current_stock += addQty;
  if (location) item.location = location;
  if (vendor) item.vendor = vendor;
  if (batch) item.batch_number = batch;
  item.status = item.current_stock === 0 ? 'Out of Stock' : item.current_stock <= item.min_level ? 'Low Stock' : 'In Stock';
  item.last_updated = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
  const txTime = (dateStr && timeStr) ? `${dateStr} ${timeStr}` : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  dbData.stock_transactions.unshift({ id: txId, time: txTime, item: item.name, type: 'Inflow', qty: addQty, dept: item.department, user: 'Vikram Aditya', approver: 'MGR-VIKRAM-09', remarks: remarks || `Added ${addQty} ${item.unit}`, created_at: new Date().toISOString() });

  logAudit('ADD_STOCK', 'Inventory', `Added ${addQty} ${item.unit} to ${item.name}`);
  saveDB();
  res.json({ success: true, item });
});

// =============================================================================
// REMOVE STOCK
// =============================================================================
app.post('/api/items/:id/remove-stock', (req, res) => {
  const { qty, dept, user, approver, reason, remarks } = req.body;
  const item = dbData.inventory_items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const reqQty = parseInt(qty, 10);
  if (item.current_stock < reqQty) {
    return res.status(400).json({ success: false, msg: `Insufficient stock! Current available stock is ${item.current_stock} ${item.unit}.` });
  }

  item.current_stock -= reqQty;
  item.status = item.current_stock === 0 ? 'Out of Stock' : item.current_stock <= item.min_level ? 'Low Stock' : 'In Stock';
  item.last_updated = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
  dbData.stock_transactions.unshift({ id: txId, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), item: item.name, type: 'Outflow', qty: reqQty, dept, user, approver, remarks: `${reason}: ${remarks || 'Issued to department'}`, created_at: new Date().toISOString() });

  logAudit('REMOVE_STOCK', 'Inventory', `Issued ${reqQty} ${item.unit} of ${item.name} to ${dept}`);
  saveDB();
  res.json({ success: true, item });
});

// =============================================================================
// VENDORS
// =============================================================================
app.get('/api/vendors', (req, res) => res.json(dbData.vendors));
app.post('/api/vendors', (req, res) => {
  const v = req.body;
  const existingIdx = dbData.vendors.findIndex(item => item.code === v.code);
  if (existingIdx !== -1) {
    dbData.vendors[existingIdx] = { ...dbData.vendors[existingIdx], ...v };
    logAudit('UPDATE_VENDOR', 'Vendor Registry', `Updated vendor ${v.name} (${v.code})`);
  } else {
    dbData.vendors.unshift({ ...v, rating: v.rating || '5.0 ★', status: v.status || 'Approved', photo: v.photo || 'assets/items/degreaser-solvent.png' });
    logAudit('REGISTER_VENDOR', 'Vendor Registry', `Registered vendor ${v.name} (${v.code})`);
  }
  saveDB();
  res.json({ success: true });
});

app.delete('/api/vendors/:code', (req, res) => {
  const idx = dbData.vendors.findIndex(v => v.code === req.params.code);
  if (idx === -1) return res.status(404).json({ error: 'Vendor not found' });
  const v = dbData.vendors[idx];
  dbData.vendors.splice(idx, 1);
  logAudit('DELETE_VENDOR', 'Vendor Registry', `Deleted vendor ${v.name} (${v.code})`);
  saveDB();
  res.json({ success: true });
});

// =============================================================================
// DEPARTMENTS
// =============================================================================
app.get('/api/departments', (req, res) => res.json(dbData.departments));

// =============================================================================
// USERS
// =============================================================================
app.get('/api/users', (req, res) => res.json(dbData.users));
app.post('/api/users', (req, res) => {
  const u = req.body;
  dbData.users.unshift({ ...u, status: u.status || 'Active' });
  logAudit('REGISTER_USER', 'Admin', `Created user ${u.name}`);
  saveDB();
  res.json({ success: true });
});

// =============================================================================
// TRANSACTIONS
// =============================================================================
app.get('/api/transactions', (req, res) => res.json(dbData.stock_transactions.slice(0, 100)));

// =============================================================================
// AUDIT LOGS
// =============================================================================
app.get('/api/audit', (req, res) => res.json(dbData.audit_logs.slice(0, 200)));
app.post('/api/audit', (req, res) => {
  const { action, module, details } = req.body;
  logAudit(action, module, details);
  res.json({ success: true });
});

// =============================================================================
// STATS
// =============================================================================
app.get('/api/stats', (req, res) => {
  const items = dbData.inventory_items;
  const totalItems = items.length;
  const totalQty = items.reduce((s, i) => s + i.current_stock, 0);
  const lowStockCount = items.filter(i => i.current_stock <= i.min_level || i.status === 'Low Stock').length;
  const expiredCount = items.filter(i => i.status === 'Expired').length;
  const outStockCount = items.filter(i => i.current_stock === 0 || i.status === 'Out of Stock').length;
  const byCategory = {};
  items.forEach(i => {
    if (!byCategory[i.category]) byCategory[i.category] = { count: 0, stock: 0, low: 0, expired: 0, out: 0 };
    byCategory[i.category].count++;
    byCategory[i.category].stock += i.current_stock;
    if (i.status === 'Low Stock') byCategory[i.category].low++;
    if (i.status === 'Expired') byCategory[i.category].expired++;
    if (i.status === 'Out of Stock') byCategory[i.category].out++;
  });
  res.json({ totalItems, totalQty, lowStockCount, expiredCount, outStockCount, byCategory });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`✅ MSIL QA Inventory API running on http://localhost:${PORT}`);
  console.log(`📦 Items in DB: ${dbData.inventory_items.length}`);
});
