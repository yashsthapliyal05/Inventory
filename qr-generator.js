// QR Code SVG Generator Utility for Maruti Suzuki Enterprise QA Inventory

export function generateSVGQRCode(text = "MSIL-QA-LAB") {
  return `
    <svg viewBox="0 0 100 100" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FFFFFF"/>
      <!-- Outer Position Detection Patterns -->
      <rect x="10" y="10" width="22" height="22" fill="#002F6C"/>
      <rect x="15" y="15" width="12" height="12" fill="#FFFFFF"/>
      <rect x="68" y="10" width="22" height="22" fill="#002F6C"/>
      <rect x="73" y="15" width="12" height="12" fill="#FFFFFF"/>
      <rect x="10" y="68" width="22" height="22" fill="#002F6C"/>
      <rect x="15" y="73" width="12" height="12" fill="#FFFFFF"/>
      
      <!-- Center Brand Box & Data Bits -->
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
