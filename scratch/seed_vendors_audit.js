import fs from 'fs';

const dbPath = 'c:/Users/sainn/OneDrive/Desktop/inventory/inventory.db.json';
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Clean Vendors Array with Exact Format from Screenshot & 50 Full Vendors
const vendorsList = [
  { code: "23csu206", name: "Solanki solution", contact: "Mukul Solanki", phone: "9996256555", email: "23csu206@ncuindia.edu", addr: "e block new delhi", cat: "Equipment Spares", rating: "4.5 ★", status: "Pending", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-MERCK-01", name: "Merck KGaA Speciality Chem", contact: "Dr. Rajesh Khanna", phone: "+91 98100 12345", email: "orders@merck.com", addr: "Plot 42, Electronic City, Gurugram, Haryana", cat: "Chemicals", rating: "4.9 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-SIGMA-02", name: "Sigma Aldrich India", contact: "Priya Sharma", phone: "+91 98200 54321", email: "sales@sigmaaldrich.in", addr: "Tower B, DLF Cyber City, Gurugram", cat: "Chemicals", rating: "4.8 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-NIST-03", name: "NIST Certified Standards Inc", contact: "Arthur Pendelton", phone: "+1 800 555 0199", email: "info@nist-standards.org", addr: "Gaithersburg, Maryland, USA", cat: "CRMs", rating: "5.0 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-PANASONIC-04", name: "Panasonic Industrial Corp", contact: "Sanjay Verma", phone: "+91 98111 88776", email: "batteries@panasonic.co.in", addr: "IMT Manesar, Sector 3, Gurugram", cat: "Equipment Consumables", rating: "4.7 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-LINDE-05", name: "Linde Gases India Pvt Ltd", contact: "Sanjay Gupta", phone: "+91 99100 88776", email: "sanjay.gupta@linde.com", addr: "Manesar Industrial Estate, Sector 5, Gurugram", cat: "Gases", rating: "4.7 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-MITUTOYO-06", name: "Mitutoyo Instrument Co India", contact: "Kenji Sato", phone: "+91 124 4567 890", email: "sales@mitutoyo.co.in", addr: "Sector 18, Industrial Area, Gurugram", cat: "Equipment Spares", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-ASIANPAINTS-07", name: "Asian Paints Industrial Coatings", contact: "Rajiv Malhotra", phone: "+91 98112 33445", email: "rajiv.m@asianpaints.com", addr: "Industrial Suburb, Faridabad, Haryana", cat: "Chemicals", rating: "4.6 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-SNAPON-08", name: "Snap-on Tools India Pvt Ltd", contact: "Vikramjit Singh", phone: "+91 98765 43210", email: "v.singh@snapon.com", addr: "Phase IV, Udyog Vihar, Gurugram", cat: "Tools", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-MANN-09", name: "Mann+Hummel Filter India", contact: "Amit Deshmukh", phone: "+91 80 4115 6700", email: "amit.d@mann-hummel.com", addr: "Peenya Industrial Area, Bengaluru", cat: "Equipment Consumables", rating: "4.7 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-AGILENT-10", name: "Agilent Technologies India", contact: "Dr. Ritu Mehra", phone: "+91 11 4604 3000", email: "ritu_mehra@agilent.com", addr: "Jasola District Centre, New Delhi", cat: "Equipment Consumables", rating: "4.9 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-METTLER-11", name: "Mettler Toledo India Pvt Ltd", contact: "Sandeep Roy", phone: "+91 22 4291 0111", email: "sandeep.roy@mt.com", addr: "Marol Industrial Area, Mumbai", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-PERKIN-12", name: "PerkinElmer Health Sciences", contact: "Ananya Das", phone: "+91 124 4789 100", email: "ananya.das@perkinelmer.com", addr: "Sector 32, Institutional Area, Gurugram", cat: "Equipment Consumables", rating: "4.7 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-BOC-13", name: "BOC Gases India Ltd", contact: "Tushar Kapoor", phone: "+91 98300 11223", email: "tushar.k@boc.com", addr: "Kolkata Port Trust Zone, Kolkata", cat: "Gases", rating: "4.6 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-3M-14", name: "3M India Safety & Industrial", contact: "Meera Nair", phone: "+91 80 2223 1414", email: "meera.nair@mmm.com", addr: "Electronic City, Bengaluru", cat: "Tools", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-HORIBA-15", name: "Horiba India Pvt Ltd", contact: "Siddharth Joshi", phone: "+91 11 4600 2100", email: "siddharth.j@horiba.com", addr: "Okhla Industrial Estate, New Delhi", cat: "CRMs", rating: "4.8 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-SHIMADZU-16", name: "Shimadzu Analytical India", contact: "Ketan Shah", phone: "+91 22 2686 4488", email: "ketan.shah@shimadzu.in", addr: "Andheri East, Mumbai", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-WATERS-17", name: "Waters India Pvt Ltd", contact: "Deepak Kaushik", phone: "+91 80 2839 1333", email: "deepak_k@waters.com", addr: "Whitefield, Bengaluru", cat: "Equipment Consumables", rating: "4.9 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-BRUKER-18", name: "Bruker India Scientific", contact: "Dr. Manish Patel", phone: "+91 124 4929 000", email: "manish.p@bruker.com", addr: "Golf Course Road, Gurugram", cat: "CRMs", rating: "4.9 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-AIRLIQUIDE-19", name: "Air Liquide India Pvt Ltd", contact: "Karan Johar", phone: "+91 11 4160 8800", email: "karan.j@airliquide.com", addr: "Mohan Cooperative, New Delhi", cat: "Gases", rating: "4.7 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-SWAGELOK-20", name: "Swagelok Delhi Systems", contact: "Gaurav Bansal", phone: "+91 124 4100 500", email: "gaurav.b@swagelok.com", addr: "Pace City II, Sector 37, Gurugram", cat: "Equipment Spares", rating: "5.0 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-FLUKE-21", name: "Fluke Industrial India", contact: "Nikhil Agarwal", phone: "+91 80 4057 9000", email: "nikhil.a@fluke.com", addr: "CV Raman Nagar, Bengaluru", cat: "Tools", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-SARTORIUS-22", name: "Sartorius India Pvt Ltd", contact: "Pooja Reddy", phone: "+91 80 4350 5000", email: "pooja.reddy@sartorius.com", addr: "Nelamangala, Bengaluru", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-FISHER-23", name: "Fisher Scientific India", contact: "Rohan Kapoor", phone: "+91 22 6680 3000", email: "rohan.k@fishersci.in", addr: "Bandra Kurla Complex, Mumbai", cat: "Chemicals", rating: "4.7 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-PRAXAIR-24", name: "Praxair India Gas Products", contact: "Venkatesh Rao", phone: "+91 80 2558 7788", email: "v.rao@praxair.com", addr: "MG Road, Bengaluru", cat: "Gases", rating: "4.6 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-EPPENDORF-25", name: "Eppendorf India Pvt Ltd", contact: "Divya Bhatia", phone: "+91 44 4211 1314", email: "bhatia.d@eppendorf.in", addr: "Chennai Industrial Park, Chennai", cat: "Equipment Consumables", rating: "4.8 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-ANTONPAAR-26", name: "Anton Paar India Pvt Ltd", contact: "Sunil Wadhwa", phone: "+91 124 4366 200", email: "sunil.wadhwa@anton-paar.com", addr: "Sector 44, Gurugram", cat: "CRMs", rating: "4.9 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-ZEISS-27", name: "Zeiss Microscopy India", contact: "Dr. Heinz Schmidt", phone: "+91 80 4343 4000", email: "heinz.schmidt@zeiss.com", addr: "Outer Ring Road, Bengaluru", cat: "Equipment Spares", rating: "5.0 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-SEFAR-28", name: "Sefar India Filtration", contact: "Mahesh Kulkarni", phone: "+91 253 2350 450", email: "mahesh.k@sefar.com", addr: "MIDC Ambad, Nashik", cat: "Equipment Consumables", rating: "4.7 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-HONEYWELL-29", name: "Honeywell Safety Products India", contact: "Arun Saxena", phone: "+91 124 4975 000", email: "arun.saxena@honeywell.com", addr: "Sector 30, Gurugram", cat: "Tools", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-ELEMENTAR-30", name: "Elementar India Scientific", contact: "Tarun Sharma", phone: "+91 11 4234 5678", email: "tarun.s@elementar.co.in", addr: "Janakpuri District Centre, Delhi", cat: "CRMs", rating: "4.8 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-INSTRON-31", name: "Instron Calibration Services India", contact: "Chris Evans", phone: "+91 44 2450 1200", email: "chris.evans@instron.com", addr: "Old Mahabalipuram Road, Chennai", cat: "Equipment Spares", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-HAMILTON-32", name: "Hamilton Robotics India", contact: "Bhavna Jain", phone: "+91 22 2580 9000", email: "bhavna.jain@hamilton.ch", addr: "Wagle Estate, Thane", cat: "Equipment Consumables", rating: "4.9 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-ZWICK-33", name: "ZwickRoell Testing Systems", contact: "Juergen Weber", phone: "+91 124 4008 900", email: "juergen.w@zwickroell.com", addr: "Udyog Vihar Phase V, Gurugram", cat: "Equipment Spares", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-PROMEGA-34", name: "Promega Biotech India", contact: "Dr. Sangeeta Paul", phone: "+91 11 4300 5500", email: "sangeeta.paul@promega.com", addr: "Netaji Subhash Place, Delhi", cat: "Chemicals", rating: "4.8 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-BRONKHORST-35", name: "Bronkhorst High-Tech India", contact: "Nilesh Varma", phone: "+91 20 2567 8901", email: "n.varma@bronkhorst.in", addr: "Kothrud, Pune", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-MESSER-36", name: "Messer Gas Systems India", contact: "Abhishek Chawla", phone: "+91 124 4567 111", email: "abhishek.c@messer.com", addr: "Sector 37, Gurugram", cat: "Gases", rating: "4.7 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-VWR-37", name: "VWR International India", contact: "Pankaj Sethi", phone: "+91 80 4110 9900", email: "pankaj.sethi@vwr.com", addr: "Electronic City Phase 2, Bengaluru", cat: "Chemicals", rating: "4.6 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-RESTEK-38", name: "Restek Chromatography India", contact: "Varun Malhotra", phone: "+91 22 4012 3456", email: "varun.m@restek.com", addr: "Vikhroli West, Mumbai", cat: "Equipment Consumables", rating: "4.9 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-PHENOMENEX-39", name: "Phenomenex India Analytics", contact: "Shruti Hegde", phone: "+91 40 4010 8800", email: "shruti.h@phenomenex.com", addr: "Hitech City, Hyderabad", cat: "Equipment Consumables", rating: "4.8 ★", status: "Approved", photo: "assets/items/battery-cell.png" },
  { code: "VEND-KAESER-40", name: "Kaeser Compressors India", contact: "Harish Thapar", phone: "+91 20 6632 0000", email: "harish.t@kaeser.com", addr: "Pimpri Industrial Area, Pune", cat: "Equipment Spares", rating: "4.7 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-BUCHI-41", name: "Buchi Labortechnik India", contact: "Dr. Sameer Roy", phone: "+91 22 6677 5500", email: "sameer.r@buchi.com", addr: "Goregaon East, Mumbai", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-TESTO-42", name: "TESTO India Pvt Ltd", contact: "Vikas Pandit", phone: "+91 20 6500 0800", email: "vikas.p@testo.in", addr: "Don Bosco School Road, Pune", cat: "Tools", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-ANSELL-43", name: "Ansell Protective Products India", contact: "Preeti Sinha", phone: "+91 22 6150 1100", email: "preeti.s@ansell.com", addr: "Lower Parel, Mumbai", cat: "Tools", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-LGC-44", name: "LGC Standards India", contact: "Dr. Alistair Cook", phone: "+91 124 4635 000", email: "alistair.cook@lgcgroup.com", addr: "DLF Phase 2, Gurugram", cat: "CRMs", rating: "5.0 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-VAISALA-45", name: "Vaisala Measurement India", contact: "Jari Virtanen", phone: "+91 11 4900 1200", email: "jari.v@vaisala.com", addr: "Aerocity, New Delhi", cat: "Equipment Spares", rating: "4.9 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-PARKER-46", name: "Parker Hannifin India", contact: "Subhash Shinde", phone: "+91 22 6513 7000", email: "subhash.s@parker.com", addr: "Mahape MIDC, Navi Mumbai", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-KNF-47", name: "KNF Neuberger Pumps India", contact: "Rajendra Prasad", phone: "+91 20 2696 2800", email: "r.prasad@knf.in", addr: "Hadapsar Industrial Estate, Pune", cat: "Equipment Spares", rating: "4.8 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" },
  { code: "VEND-KATANAX-48", name: "Katanax Fusion Fluxers India", contact: "Jean Dupuis", phone: "+91 11 4500 9988", email: "jean.d@katanax.com", addr: "Okhla Phase III, New Delhi", cat: "CRMs", rating: "4.8 ★", status: "Approved", photo: "assets/items/calibration-crm.png" },
  { code: "VEND-METROHM-49", name: "Metrohm India Limited", contact: "Anil Kumar", phone: "+91 44 2836 2100", email: "anil.kumar@metrohm.in", addr: "Guindy Industrial Estate, Chennai", cat: "Chemicals", rating: "4.9 ★", status: "Approved", photo: "assets/items/degreaser-solvent.png" },
  { code: "VEND-JEOL-50", name: "JEOL India Pvt Ltd", contact: "Takahiro Mori", phone: "+91 11 4600 5500", email: "t.mori@jeol.co.in", addr: "Vasant Kunj, New Delhi", cat: "Equipment Spares", rating: "5.0 ★", status: "Approved", photo: "assets/items/engine-crankshaft.png" }
];

db.vendors = vendorsList;

// 2. Generate 10 Users for Registered Users Table in Admin Console
db.users = [
  { id: "USR-1001", name: "Aditya Sharma", email: "aditya.sharma@maruti.co.in", role: "System Admin & QA Lead", department: "Quality Assurance", status: "Active" },
  { id: "USR-1002", name: "Dr. Rajesh Khanna", email: "rajesh.khanna@maruti.co.in", role: "Chief Chemical Officer", department: "Chemical Testing Lab", status: "Active" },
  { id: "USR-1003", name: "Vikram Aditya", email: "vikram.aditya@maruti.co.in", role: "Procurement Manager", department: "R&D Metallurgy", status: "Active" },
  { id: "USR-1004", name: "Anjali Gupta", email: "anjali.gupta@maruti.co.in", role: "Quality Assurance Inspector", department: "Paint Shop", status: "Active" },
  { id: "USR-1005", name: "Rajesh Patel", email: "rajesh.patel@maruti.co.in", role: "Senior Calibration Engineer", department: "Calibration Cell", status: "Active" },
  { id: "USR-1006", name: "Sunil Verma", email: "sunil.verma@maruti.co.in", role: "Metrology Specialist", department: "Metrology Lab", status: "Active" },
  { id: "USR-1007", name: "Priya Nair", email: "priya.nair@maruti.co.in", role: "Environmental Auditor", department: "Environmental QA", status: "Active" },
  { id: "USR-1008", name: "Mukul Solanki", email: "23csu206@ncuindia.edu", role: "Vendor Quality Specialist", department: "Assembly Line 1", status: "Active" },
  { id: "USR-1009", name: "Rohan Deshmukh", email: "rohan.d@maruti.co.in", role: "Material Handler Lead", department: "Assembly Line 2", status: "Active" },
  { id: "USR-1010", name: "Kavita Rao", email: "kavita.rao@maruti.co.in", role: "Safety & Compliance Officer", department: "QAMA3", status: "Active" }
];

// 3. Generate 60 Rich Audit Logs
const auditTemplates = [
  { action: "REGISTER_ITEM", module: "Chemicals", badge: "badge-success", detail: "Registered new chemical SKU Nitric Acid Superpure in QA Vault 1" },
  { action: "ADD_STOCK", module: "Inventory", badge: "badge-success", detail: "Added 120 Liters to Industrial Degreaser Solvent (PO-2026-901)" },
  { action: "REMOVE_STOCK", module: "Inventory", badge: "badge-warning", detail: "Issued 15 Liters Acetone Analytical Grade to Quality Assurance Lab" },
  { action: "REGISTER_VENDOR", module: "Vendor Registry", badge: "badge-info", detail: "Approved supplier registration for Merck KGaA Speciality Chem" },
  { action: "USER_LOGIN", module: "Authentication", badge: "badge-info", detail: "Aditya Sharma logged in successfully from QA Terminal 192.168.1.8" },
  { action: "COMPLIANCE_CHECK", module: "Expiry Tracker", badge: "badge-success", detail: "Automated calibration scan: 5 CRMs verified, 1 marked Expired" },
  { action: "UPDATE_MIN_LEVEL", module: "Inventory", badge: "badge-warning", detail: "Updated safety threshold limit to 20 units for Helium Gas" },
  { action: "SECURITY_ALERT", module: "System Console", badge: "badge-danger", detail: "Admin privilege validation executed for user aditya.sharma@maruti.co.in" },
  { action: "BACKUP_TRIGGER", module: "System Storage", badge: "badge-info", detail: "Created persistent JSON snapshot backup of 500 inventory items" }
];

const auditUsersList = [
  "aditya.sharma@maruti.co.in", "rajesh.khanna@maruti.co.in", "vikram.aditya@maruti.co.in",
  "anjali.gupta@maruti.co.in", "rajesh.patel@maruti.co.in", "admin@qa.com"
];

const newAudits = [];
const nowTime = new Date();

for (let i = 0; i < 60; i++) {
  const tpl = auditTemplates[i % auditTemplates.length];
  const usr = auditUsersList[i % auditUsersList.length];
  const dt = new Date(nowTime.getTime() - i * 7200000); // 2 hrs interval
  const timeFormatted = dt.toISOString().replace('T', ' ').substring(0, 19);

  newAudits.push({
    id: `AUD-${8000 + i}`,
    time: timeFormatted,
    user: usr,
    action: tpl.action,
    module: tpl.module,
    ip: `192.168.1.${(i % 30) + 5}`,
    details: `${tpl.detail} [Ref #LOG-${1000 + i}]`,
    created_at: dt.toISOString()
  });
}

db.audit_logs = newAudits;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`✅ Updated inventory.db.json with ${db.vendors.length} Vendors, ${db.users.length} Users, and ${db.audit_logs.length} Audit Logs!`);
