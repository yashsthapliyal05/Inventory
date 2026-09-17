import fs from 'fs';
import path from 'path';

const dbPath = 'c:/Users/sainn/OneDrive/Desktop/inventory/inventory.db.json';

let currentDb = {
  inventory_items: [],
  vendors: [],
  departments: [],
  users: [],
  stock_transactions: [],
  audit_logs: []
};

if (fs.existsSync(dbPath)) {
  try {
    currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    console.error("Error reading existing DB:", e);
  }
}

const existingVendors = [
  "NIST Certified Standards Inc", "Merck KGaA Speciality Chem", "Sigma Aldrich India",
  "Asian Paints Enterprise", "Mitutoyo Instrument Co", "Cannon Instrument Co",
  "Panasonic Industrial Corp", "Mann+Hummel India", "Snap-on Tools India", "Linde Gases India",
  "Thermo Fisher Scientific", "Agilent Technologies", "Mettler Toledo India", "PerkinElmer India",
  "Shimadzu Analytical", "BOC Gases", "3M India Safety", "Horiba India", "Solanki solution"
];

const departments = [
  "Quality Assurance", "QAMA3", "Paint Shop", "Assembly Line 1", "Assembly Line 2",
  "Metrology Lab", "R&D Metallurgy", "Chemical Testing Lab", "Environmental QA", "Calibration Cell"
];

const locations = [
  "Chem Vault 1, Cabinet A", "Chem Vault 2, Cabinet B", "Chem Vault 3, Aisle A",
  "QC Lab, Cabinet 2", "Metrology Lab, Safe 1", "Rheology Desk, Rack 3",
  "Whse A, Rack 14", "Whse B, Climate Zone 2", "Tool Crib 1, Drawer 4",
  "Gas Cylinder Yard, Bay 3", "Gas Store, QAMA3", "Safety Store, QAMA3",
  "Analytical Room 102", "Central Calibration Store"
];

const categoryTemplates = [
  {
    category: "Chemicals",
    subcategories: ["Solvents", "Acids", "Reagents", "Indicators", "Paints & Thinners", "Buffers", "Cleaning Agents", "Polymers & Resins"],
    units: ["Ltr", "Liters", "Bottles", "Kg", "Grams", "ml"],
    images: ["assets/items/degreaser-solvent.png"],
    items: [
      { name: "Nitric Acid 69% Superpure", sub: "Acids", uom: "Ltr", remark: "Corrosive - Store in Acid Cabinet" },
      { name: "Sulfuric Acid 98% AR Grade", sub: "Acids", uom: "Ltr", remark: "Dehydrating agent - Fume hood required" },
      { name: "Hydrochloric Acid 37% TraceMetal", sub: "Acids", uom: "Ltr", remark: "Fuming acid - Handle with nitrile gloves" },
      { name: "Hydrofluoric Acid 48%", sub: "Acids", uom: "Ltr", remark: "DANGER - Calcium gluconate gel required nearby" },
      { name: "Perchloric Acid 70% ACS", sub: "Acids", uom: "Ltr", remark: "Oxidizer - Avoid contact with organic materials" },
      { name: "Acetic Acid Glacial 99.8%", sub: "Acids", uom: "Ltr", remark: "Flammable liquid - Keep away from heat" },
      { name: "Phosphoric Acid 85%", sub: "Acids", uom: "Ltr", remark: "Viscous acid - Store at room temp" },
      { name: "Acetone HPLC Grade 99.9%", sub: "Solvents", uom: "Ltr", remark: "HPLC Mobile Phase Solvent" },
      { name: "Methanol Spectrophotometric Grade", sub: "Solvents", uom: "Ltr", remark: "Toxic - Store in solvent cabinet" },
      { name: "Isopropanol 99.9% Anhydrous", sub: "Solvents", uom: "Ltr", remark: "Degreasing & optics cleaning" },
      { name: "Toluene Puriss Grade", sub: "Solvents", uom: "Ltr", remark: "Aromatic solvent - Fume hood only" },
      { name: "Xylene Isomer Mixture AR", sub: "Solvents", uom: "Ltr", remark: "Histology & paint testing solvent" },
      { name: "Hexane n-Isomer 99%", sub: "Solvents", uom: "Ltr", remark: "Non-polar solvent for oil extraction" },
      { name: "Dichloromethane (DCM) Stabilized", sub: "Solvents", uom: "Ltr", remark: "Volatile - Do not breathe vapors" },
      { name: "Chloroform AR Grade", sub: "Solvents", uom: "Ltr", remark: "Preserved with ethanol" },
      { name: "Tetrahydrofuran (THF) Inhibited", sub: "Solvents", uom: "Ltr", remark: "Check peroxide formation date" },
      { name: "Acetonitrile LC-MS Grade", sub: "Solvents", uom: "Ltr", remark: "Ultra-pure chromatographic solvent" },
      { name: "Ethanol Absolute 99.9%", sub: "Solvents", uom: "Ltr", remark: "Tax-free excise logbook required" },
      { name: "Phenolphthalein Indicator 1%", sub: "Indicators", uom: "Ltr", remark: "pH transition range 8.2 - 10.0" },
      { name: "Methyl Orange Indicator 0.1%", sub: "Indicators", uom: "Ltr", remark: "Acid-base titration indicator" },
      { name: "Bromothymol Blue Solution", sub: "Indicators", uom: "Ltr", remark: "Neutral pH range indicator" },
      { name: "Eriochrome Black T Indicator", sub: "Indicators", uom: "Grams", remark: "Water hardness complexometric indicator" },
      { name: "Buffer Solution pH 4.01 Red", sub: "Buffers", uom: "Liters", remark: "pH Meter Calibration Standard" },
      { name: "Buffer Solution pH 7.00 Yellow", sub: "Buffers", uom: "Liters", remark: "NIST Traceable Buffer" },
      { name: "Buffer Solution pH 10.01 Blue", sub: "Buffers", uom: "Liters", remark: "High pH Calibration Standard" },
      { name: "Sodium Hydroxide Pellets 98%", sub: "Reagents", uom: "Kg", remark: "Hygroscopic - Keep container sealed" },
      { name: "Potassium Hydroxide Flakes", sub: "Reagents", uom: "Kg", remark: "Caustic base - Use face shield" },
      { name: "Silver Nitrate 0.1M Standard Solution", sub: "Reagents", uom: "Ltr", remark: "Light sensitive - Store in amber bottle" },
      { name: "EDTA Disodium Salt Dihydrate", sub: "Reagents", uom: "Kg", remark: "Chelating agent for titration" },
      { name: "Potassium Permanganate 0.02M", sub: "Reagents", uom: "Ltr", remark: "Strong oxidizer" },
      { name: "Sodium Thiosulfate 0.1M", sub: "Reagents", uom: "Ltr", remark: "Iodometric titrant" },
      { name: "Ammonium Hydroxide 25%", sub: "Reagents", uom: "Ltr", remark: "Pungent ammonia gas hazard" },
      { name: "Industrial Degreaser Solvent Clean-99", sub: "Cleaning Agents", uom: "Liters", remark: "Heavy duty part degreaser" },
      { name: "Synthetic Paint Thinner T-40", sub: "Paints & Thinners", uom: "Liters", remark: "Paint viscosity regulator" },
      { name: "Epoxy Resin Primer Component A", sub: "Polymers & Resins", uom: "Kg", remark: "2-Part coating resin" },
      { name: "Polyurethane Hardener Catalyst B", sub: "Polymers & Resins", uom: "Kg", remark: "Moisture sensitive catalyst" }
    ]
  },
  {
    category: "CRMs",
    subcategories: ["Spectrometer Standards", "Hardness Standards", "Viscosity Standards", "Metallographic Standards", "Elemental Standards", "Polymer Standards"],
    units: ["pcs", "lots", "Disc Set", "Block", "Bottle"],
    images: ["assets/items/calibration-crm.png"],
    items: [
      { name: "Low Alloy Steel OES Reference Standard CRM-101", sub: "Spectrometer Standards", uom: "Disc Set", remark: "NIST-traceable metallic alloy standard" },
      { name: "High Nickel Stainless Steel Standard CRM-205", sub: "Spectrometer Standards", uom: "Disc Set", remark: "Certified for Cr, Ni, Mo content" },
      { name: "Aluminum Alloy A356 Calibration Disc", sub: "Spectrometer Standards", uom: "Disc Set", remark: "Used for XRF spectrometer calibration" },
      { name: "Cast Iron Carbon-Silicon Reference Standard", sub: "Spectrometer Standards", uom: "Disc Set", remark: "OES spark test reference" },
      { name: "Copper Alloy Brass Calibration Disc Set", sub: "Spectrometer Standards", uom: "Disc Set", remark: "5-piece standard set" },
      { name: "Titanium Grade 5 Alloy CRM Disc", sub: "Spectrometer Standards", uom: "Disc Set", remark: "Aerospace & Automotive Metrology" },
      { name: "Steel Hardness Test Block Rockwell HRC 60", sub: "Hardness Standards", uom: "Block", remark: "Certified durometer verification block" },
      { name: "Steel Hardness Test Block Rockwell HRC 45", sub: "Hardness Standards", uom: "Block", remark: "Rockwell C scale standard" },
      { name: "Steel Hardness Test Block Rockwell HRB 85", sub: "Hardness Standards", uom: "Block", remark: "Rockwell B scale standard" },
      { name: "Vickers Micro-Hardness Block HV 500", sub: "Hardness Standards", uom: "Block", remark: "Microindentation standard" },
      { name: "Brinell Hardness Block 10/3000 HBW 200", sub: "Hardness Standards", uom: "Block", remark: "10mm ball 3000kg load reference" },
      { name: "Viscosity Reference Standard Oil 100 cSt", sub: "Viscosity Standards", uom: "Bottle", remark: "Cannon viscometer standard oil" },
      { name: "Viscosity Reference Standard Oil 500 cSt", sub: "Viscosity Standards", uom: "Bottle", remark: "NIST traceable kinematic viscosity oil" },
      { name: "Viscosity Reference Standard Oil 1000 cSt", sub: "Viscosity Standards", uom: "Bottle", remark: "High viscosity calibration reference" },
      { name: "Multi-Element ICP Standard 100ppm 27 Elements", sub: "Elemental Standards", uom: "Bottle", remark: "ICP-OES trace element calibration" },
      { name: "AAS Single Element Iron 1000ppm Standard", sub: "Elemental Standards", uom: "Bottle", remark: "Atomic Absorption Spectroscopy standard" },
      { name: "AAS Single Element Lead 1000ppm Standard", sub: "Elemental Standards", uom: "Bottle", remark: "Environmental compliance standard" },
      { name: "Metallographic Grain Size Comparison Standard", sub: "Metallographic Standards", uom: "pcs", remark: "ASTM E112 chart and polished disc" },
      { name: "Inclusion Rating Reference Polished Block", sub: "Metallographic Standards", uom: "pcs", remark: "ASTM E45 rating standard block" },
      { name: "Polymer Melt Flow Index (MFI) Reference Resin", sub: "Polymer Standards", uom: "lots", remark: "MFR tester verification standard" }
    ]
  },
  {
    category: "Equipment Consumables",
    subcategories: ["Lamps", "Filters", "Chromatography Columns", "Electrodes", "Vials & Syringes", "Cutting Blades", "Sample Cups", "Tubing"],
    units: ["pcs", "Nos", "Pack", "Roll", "Cartridge"],
    images: ["assets/items/battery-cell.png"],
    items: [
      { name: "Deuterium Arc Lamp D2 for UV-Vis Spectrophotometer", sub: "Lamps", uom: "pcs", remark: "2000 hour rated UV light source" },
      { name: "Tungsten Halogen Lamp 12V 20W for Colorimeter", sub: "Lamps", uom: "pcs", remark: "Visible spectrum source bulb" },
      { name: "Hollow Cathode Lamp Fe/Ni Dual Element", sub: "Lamps", uom: "pcs", remark: "AAS spectrometer lamp" },
      { name: "Ozone UV Disinfection Lamp 185nm", sub: "Lamps", uom: "Nos", remark: "UV-C chamber lamp" },
      { name: "HEPA Air Filter Element Cleanroom Grade H14", sub: "Filters", uom: "pcs", remark: "99.995% efficiency air filter" },
      { name: "PTFE Syringe Filters 0.45um 25mm Pack of 100", sub: "Filters", uom: "Pack", remark: "Sample preparation filtration" },
      { name: "Nylon Membrane Filters 0.22um 47mm", sub: "Filters", uom: "Pack", remark: "Solvent degassing membrane" },
      { name: "Oil Mist Filter Cartridge for Vacuum Pump", sub: "Filters", uom: "pcs", remark: "Exhaust mist eliminator" },
      { name: "Capillary GC Column DB-5MS 30m x 0.25mm x 0.25um", sub: "Chromatography Columns", uom: "pcs", remark: "Gas chromatography column" },
      { name: "HPLC Column C18 250mm x 4.6mm 5um", sub: "Chromatography Columns", uom: "pcs", remark: "Reverse phase analytical column" },
      { name: "pH Combination Glass Electrode BNC Connector", sub: "Electrodes", uom: "pcs", remark: "Integrated Ag/AgCl reference" },
      { name: "Conductivity Cell Electrode K=1.0", sub: "Electrodes", uom: "pcs", remark: "Teflon body platinum sensor" },
      { name: "Autosampler Clear Glass Vials 2ml PTFE Cap (100/pk)", sub: "Vials & Syringes", uom: "Pack", remark: "9mm screw top vials" },
      { name: "Hamilton Gas-Tight Syringe 10ul GC Injector", sub: "Vials & Syringes", uom: "pcs", remark: "Precision micro-syringe" },
      { name: "MFR Cutter Blades High Speed Steel (5/pk)", sub: "Cutting Blades", uom: "Pack", remark: "Melt Flow Indexer automated cutter" },
      { name: "Diamond Wafering Saw Blade 4-inch Metallurgy", sub: "Cutting Blades", uom: "pcs", remark: "Precision specimen sectioning blade" },
      { name: "XRF Sample Cups Plastic 32mm (100/pk)", sub: "Sample Cups", uom: "Pack", remark: "Liquid & powder cup assembly" },
      { name: "Tygon Flexible Peristaltic Pump Tubing 15m", sub: "Tubing", uom: "Roll", remark: "Chemical resistant tubing" }
    ]
  },
  {
    category: "Equipment Spares",
    subcategories: ["Sensors", "Thermocouples", "Power Supply", "Mechanical Parts", "Electrical", "Fixtures", "Valves & Fittings", "Heating Elements"],
    units: ["pcs", "Nos", "Pair", "Set", "Units"],
    images: ["assets/items/engine-crankshaft.png"],
    items: [
      { name: "Type K Thermocouple Probe Stainless Steel 300mm", sub: "Thermocouples", uom: "Nos", remark: "Temp rating up to 1100°C" },
      { name: "PT100 RTD Temperature Sensor 3-Wire Class A", sub: "Sensors", uom: "Nos", remark: "High precision temperature probe" },
      { name: "Piezoelectric Quartz Force Transducer 50kN", sub: "Sensors", uom: "pcs", remark: "Universal testing machine sensor" },
      { name: "Optical Shaft Encoder 1024 PPR Digital", sub: "Sensors", uom: "pcs", remark: "RPM and position feedback sensor" },
      { name: "Switching Power Supply Module 24V DC 10A DIN Rail", sub: "Power Supply", uom: "Units", remark: "Instrument cabinet DC supply" },
      { name: "Lithium-Ion Battery Pack 48V 20Ah AGV Power", sub: "Power Supply", uom: "units", remark: "AGV vehicle high power pack" },
      { name: "Precision Tensile Grip Jaw Inserts Hardened Steel", sub: "Fixtures", uom: "Set", remark: "UTM wedge grip jaw set" },
      { name: "Metallographic Specimen Mounting Fixture Clamp Pair", sub: "Fixtures", uom: "Pair", remark: "Polishing & grinding holder fixture" },
      { name: "Stainless Steel High-Pressure Needle Valve 1/4 inch", sub: "Valves & Fittings", uom: "pcs", remark: "Gas control high pressure valve" },
      { name: "Solenoid Valve 2-Way Normally Closed 24VDC", sub: "Valves & Fittings", uom: "pcs", remark: "Pneumatic automation valve" },
      { name: "Swagelok Compression Tube Fitting 1/4 in Union", sub: "Valves & Fittings", uom: "pcs", remark: "316 Stainless steel leak-tight fitting" },
      { name: "Silicon Carbide Heating Element Rod for Furnace 1400C", sub: "Heating Elements", uom: "pcs", remark: "High temp muffle furnace heater" },
      { name: "Nichrome Wire Resistance Element 1000W", sub: "Heating Elements", uom: "pcs", remark: "Oven heating coil element" },
      { name: "Operation Rod MFR Mechanical Assembly", sub: "Mechanical Parts", uom: "Nos", remark: "Piston rod for melt flow tester" },
      { name: "Drive Belt Synchronous Tooth 5M-450", sub: "Mechanical Parts", uom: "pcs", remark: "Stirrer & mixer drive belt" },
      { name: "Heavy Duty Shielded Power Cable 5m 3-Phase 32A", sub: "Electrical", uom: "Nos", remark: "Equipment power supply cable" },
      { name: "Digital Industrial Relay Module 4-Channel 24V", sub: "Electrical", uom: "pcs", remark: "PLC interlock interface relay" }
    ]
  },
  {
    category: "Gases",
    subcategories: ["Carrier Gases", "Purge Gases", "Fuel Gases", "Calibration Gas Mixtures"],
    units: ["Cylinder", "Nos", "Bottles", "Can"],
    images: ["assets/items/calibration-crm.png"],
    items: [
      { name: "Helium Gas Ultra High Purity 99.999% Grade 5.0", sub: "Carrier Gases", uom: "Cylinder", remark: "GC & GC-MS Carrier gas" },
      { name: "Argon Gas Spectrometric Grade 99.999%", sub: "Carrier Gases", uom: "Carrier Gases", remark: "OES spark chamber shielding gas" },
      { name: "Nitrogen Gas High Purity 99.999% Dry", sub: "Purge Gases", uom: "Cylinder", remark: "Analytical chamber purge & drying" },
      { name: "Zero Air Synthetic High Purity <0.1ppm THC", sub: "Purge Gases", uom: "Cylinder", remark: "FID flame detector oxidant gas" },
      { name: "Hydrogen Gas High Purity 99.999%", sub: "Fuel Gases", uom: "Cylinder", remark: "FID detector fuel gas - Explosive warning" },
      { name: "Acetylene Gas Atomic Absorption Grade 99.6%", sub: "Fuel Gases", uom: "Cylinder", remark: "AAS flame burner fuel cylinder" },
      { name: "Carbon Dioxide CO2 Supercritical Fluid Grade", sub: "Purge Gases", uom: "Cylinder", remark: "Extractor & incubator gas cylinder" },
      { name: "Span Calibration Gas Mix CO 100ppm / N2 Balance", sub: "Calibration Gas Mixtures", uom: "Can", remark: "Exhaust analyzer calibration gas" },
      { name: "Span Calibration Gas Mix NOx 50ppm / N2 Balance", sub: "Calibration Gas Mixtures", uom: "Can", remark: "Emissions lab reference gas" },
      { name: "Methane 1% in Nitrogen Gas Mixture", sub: "Calibration Gas Mixtures", uom: "Can", remark: "Flammable gas detector test blend" }
    ]
  },
  {
    category: "Tools",
    subcategories: ["PPE", "Hand Tools", "Measuring Tools", "Electrical Tools", "Torque Tools", "Inspection Tools"],
    units: ["Nos", "pcs", "Set", "Pair", "Kit"],
    images: ["assets/items/engine-crankshaft.png"],
    items: [
      { name: "N95 Particulate Respirator Safety Mask PPE1", sub: "PPE", uom: "Nos", remark: "Dust & aerosol protection mask" },
      { name: "Nitrile Chemical Resistant Gloves (100/box)", sub: "PPE", uom: "Pair", remark: "Single-use powder-free lab gloves" },
      { name: "Safety Splash Goggles Anti-Fog Clear Lens", sub: "PPE", uom: "Nos", remark: "Chemical lab eye protection" },
      { name: "Cryogenic Protective Safety Gloves High Temp", sub: "PPE", uom: "Pair", remark: "Liquid nitrogen & furnace handling" },
      { name: "Precision Allen Key Metric Hex Set 1.5-10mm CCS5", sub: "Hand Tools", uom: "Set", remark: "Chrome vanadium steel ball end key set" },
      { name: "Torx Star Key Wrench Set T10-T50", sub: "Hand Tools", uom: "Set", remark: "Security torx driver set" },
      { name: "Digital Vernier Caliper 0-150mm Stainless Mitutoyo", sub: "Measuring Tools", uom: "pcs", remark: "Resolution 0.01mm IP67 rated" },
      { name: "Outside Digital Micrometer 0-25mm", sub: "Measuring Tools", uom: "pcs", remark: "Precision thickness & diameter gauge" },
      { name: "Digital Dial Gauge Indicator 0-12.7mm", sub: "Measuring Tools", uom: "pcs", remark: "Runout & deflection meter" },
      { name: "Precision Digital Torque Wrench 10-100 Nm TRQ-88", sub: "Torque Tools", uom: "pcs", remark: "Bluetooth logging calibrated wrench" },
      { name: "Digital Multimeter True-RMS Fluke 179", sub: "Electrical Tools", uom: "pcs", remark: "Voltage, current, resistance & temp" },
      { name: "Infrared Laser Thermometer Temperature Gun -50 to 800C", sub: "Inspection Tools", uom: "pcs", remark: "Non-contact thermal sensor gun" },
      { name: "Digital Coating Thickness Gauge Dual Fe/NFe", sub: "Inspection Tools", uom: "pcs", remark: "Paint & plating thickness tester" }
    ]
  }
];

function generate500Items() {
  const newItems = [];
  let idCounter = 2000;

  // Preserve existing 32 items
  const existingItems = currentDb.inventory_items || [];
  existingItems.forEach(item => newItems.push(item));

  const targetTotal = 500;
  const needed = targetTotal - newItems.length;

  console.log(`Current items count: ${newItems.length}. Generating ${needed} new items to reach 500...`);

  const statuses = ["In Stock", "In Stock", "In Stock", "In Stock", "In Stock", "Low Stock", "Out of Stock", "Expired"];

  let count = 0;
  while (count < needed) {
    const template = categoryTemplates[count % categoryTemplates.length];
    const itemDef = template.items[count % template.items.length];
    const vendor = existingVendors[count % existingVendors.length];
    const dept = departments[count % departments.length];
    const loc = locations[count % locations.length];
    const status = statuses[count % statuses.length];

    const currentStock = status === "Out of Stock" ? 0 : status === "Low Stock" ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 150) + 15;
    const minLevel = Math.floor(Math.random() * 15) + 5;
    const reorderLevel = minLevel + 5;
    const maxLevel = reorderLevel * 4;

    idCounter++;
    const skuPrefix = template.category.substring(0, 4).toUpperCase();
    const itemId = `${skuPrefix}-${idCounter}`;

    const expiryYear = status === "Expired" ? 2025 : 2027 + (count % 3);
    const expiryMonth = String((count % 12) + 1).padStart(2, '0');
    const expiryDay = String((count % 28) + 1).padStart(2, '0');
    const expiryDate = `${expiryYear}-${expiryMonth}-${expiryDay}`;

    const newObj = {
      id: itemId,
      name: `${itemDef.name} #${count + 1}`,
      description: `High precision ${itemDef.name} for Maruti Suzuki QA Lab testing & validation in ${dept}.`,
      category: template.category,
      subcategory: itemDef.sub || template.subcategories[0],
      department: dept,
      vendor: vendor,
      location: loc,
      manufacturer: vendor.split(" ")[0] || "Approved Vendor",
      po_number: `PO-2026-${3000 + count}`,
      expiry_date: expiryDate,
      batch_number: `LOT-${skuPrefix}-${1000 + count}`,
      size: "Standard Unit",
      unit: itemDef.uom || template.units[0],
      chemicalItemId: `${skuPrefix}-${count + 100}`,
      current_stock: currentStock,
      max_level: maxLevel,
      min_level: minLevel,
      reorder_level: reorderLevel,
      status: status,
      remarks: itemDef.remark || "Regular QA inventory standard",
      image: template.images[0],
      last_updated: "2026-07-31 22:45"
    };

    newItems.push(newObj);
    count++;
  }

  currentDb.inventory_items = newItems;
  fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf8');
  console.log(`✅ Successfully written ${currentDb.inventory_items.length} items to ${dbPath}`);
}

generate500Items();
