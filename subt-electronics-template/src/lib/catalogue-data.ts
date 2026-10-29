// ==============================================================================
// Muhammad Kairu Electronics — Storefront Catalogue Service & Fixtures
// Clean architectural abstraction layer. This module supplies typed catalogue data
// for the storefront UI. In Stage 3, this boundary will connect seamlessly to Supabase.
// ==============================================================================

export type StockStatusType = 'in_stock' | 'confirm_with_store' | 'out_of_stock';
export type DepartmentType = 'solar' | 'electronics';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface CatalogueProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  department: DepartmentType;
  priceKobo: number | null;
  priceFormatted: string;
  stockStatus: StockStatusType;
  stockLabel: string;
  summary: string;
  description: string;
  isFeatured: boolean;
  isSolar: boolean;
  specifications: ProductSpecification[];
  imageSvg: string;
  warrantySummary: string;
}

export interface CatalogueCategory {
  slug: string;
  name: string;
  department: DepartmentType;
  description: string;
  itemCountEstimate: string;
  iconType: string;
}

export interface CatalogueBrand {
  slug: string;
  name: string;
  country: string;
  specialty: string;
}

// ------------------------------------------------------------------------------
// Verified Business Details for Muhammad Kairu Electronics (Jos, Plateau State)
// ------------------------------------------------------------------------------
export const STORE_INFO = {
  name: "Muhammad Kairu Electronics",
  tagline: "Powering Homes. Entertaining Families.",
  address: "No. 41 Ahmadu Bello Way, Shop 31A, Rochas Plaza, opposite Zenith Bank, Jos, Plateau State, Nigeria",
  shortAddress: "Shop 31A, Rochas Plaza, 41 Ahmadu Bello Way, Jos",
  phone: "07038365737",
  phoneDisplay: "0703 836 5737",
  whatsapp: "2347038365737",
  email: "mkelectronics@gmail.com",
  openingHours: "Mon - Sat: 8:30 AM - 6:00 PM",
  primaryColor: "#1F2A44",
  secondaryColor: "#F5A623",
  surfaceColor: "#F7F5F0",
  darkColor: "#101820",
};

// ------------------------------------------------------------------------------
// Categories Aligned with Seed Database (20261027000004_seed_and_bootstrap.sql)
// ------------------------------------------------------------------------------
export const CATEGORIES: CatalogueCategory[] = [
  {
    slug: "solar-power-solutions",
    name: "Solar & Power Solutions",
    department: "solar",
    description: "Hybrid inverters, monocrystalline solar panels, LiFePO4 batteries, and MPPT controllers.",
    itemCountEstimate: "Inverters, Panels & Batteries",
    iconType: "solar",
  },
  {
    slug: "television-visuals",
    name: "Television & Visuals",
    department: "electronics",
    description: "4K Smart TVs, OLED, QLED, and digital satellite televisions from top global brands.",
    itemCountEstimate: "32\" to 75\" 4K Smart TVs",
    iconType: "tv",
  },
  {
    slug: "home-audio",
    name: "Home & Office Audio",
    department: "electronics",
    description: "Soundbars, Bluetooth party speakers, home theatre systems, and wireless audio.",
    itemCountEstimate: "Soundbars & Hi-Fi Audio",
    iconType: "audio",
  },
  {
    slug: "refrigeration-cooling",
    name: "Refrigeration & Cooling",
    department: "electronics",
    description: "Low-voltage and energy-efficient refrigerators, chest freezers, and air cooling.",
    itemCountEstimate: "Deep Freezers & Fridges",
    iconType: "fridge",
  },
  {
    slug: "kitchen-appliances",
    name: "Kitchen & Small Appliances",
    department: "electronics",
    description: "High-durability blenders, microwave ovens, electric kettles, and kitchen essentials.",
    itemCountEstimate: "Blenders, Microwaves & Kettles",
    iconType: "kitchen",
  },
  {
    slug: "electrical-accessories",
    name: "Electrical & Solar Accessories",
    department: "solar",
    description: "Surge protectors, automatic voltage switchers (AVS), DC solar cables, and changeovers.",
    itemCountEstimate: "AVS, DC Cables & Breakers",
    iconType: "accessories",
  },
];

// ------------------------------------------------------------------------------
// Brand Partners
// ------------------------------------------------------------------------------
export const BRANDS: CatalogueBrand[] = [
  { slug: "felicity-solar", name: "Felicity Solar", country: "Global", specialty: "Tier-1 Hybrid Inverters & LiFePO4 Batteries" },
  { slug: "lg", name: "LG Electronics", country: "South Korea", specialty: "OLED TVs, Smart Inverter Refrigerators & Audio" },
  { slug: "samsung", name: "Samsung", country: "South Korea", specialty: "Crystal UHD Displays & Kitchen Appliances" },
  { slug: "hisense", name: "Hisense", country: "Global", specialty: "Affordable 4K TVs, Soundbars & Chest Freezers" },
  { slug: "nexus", name: "Nexus", country: "Nigeria", specialty: "Tropicalized Deep Freezers & Heavy-Duty Blenders" },
  { slug: "sollatek", name: "Sollatek", country: "UK", specialty: "Automatic Voltage Switchers & Surge Protection" },
];

// ------------------------------------------------------------------------------
// Helper: Format Kobo to Nigerian Naira String
// ------------------------------------------------------------------------------
export function formatKoboToNaira(priceKobo: number | null): string {
  if (priceKobo === null || priceKobo === undefined) {
    return "Confirm with Store";
  }
  const naira = priceKobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(naira);
}

// ------------------------------------------------------------------------------
// Helper: Construct Pre-filled WhatsApp Enquiry Link
// ------------------------------------------------------------------------------
export function createWhatsAppEnquiryUrl(
  productName?: string,
  productSlug?: string,
  priceFormatted?: string,
  customPhone?: string
): string {
  const phone = customPhone || STORE_INFO.whatsapp;
  let text = `Hello Muhammad Kairu Electronics, I am contacting you from your website regarding products at your Jos showroom.`;

  if (productName) {
    text = `Hello Muhammad Kairu Electronics, I would like to enquire about:
• Product: ${productName}
${productSlug ? `• Link: https://mkelectronics.com/products/${productSlug}\n` : ""}${priceFormatted ? `• Listed Price: ${priceFormatted}\n` : ""}
Please confirm availability, current warranty terms, and collection/delivery arrangements.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// ------------------------------------------------------------------------------
// Helper: Construct Solar Sizing Assessment WhatsApp Link
// ------------------------------------------------------------------------------
export function createSolarAssessmentUrl(customPhone?: string): string {
  const phone = customPhone || STORE_INFO.whatsapp;
  const text = `Hello Muhammad Kairu Electronics, I need help sizing a solar power system for my home/office in Jos. 

My primary appliances include:
1. Refrigerator / Freezer: [Yes/No]
2. TV / Sound System: [Yes/No]
3. Lighting & Fans: [Approx number]
4. Pumping Machine: [Yes/No]

Please advise on recommended Inverter capacity (kVA), Battery bank (Lithium/Tubular), and Solar Panel requirements.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// ------------------------------------------------------------------------------
// Curated Real-World Catalogue Products
// ------------------------------------------------------------------------------
export const PRODUCTS: CatalogueProduct[] = [
  // 1. Solar Inverter
  {
    id: "prod-feli-inv-5kva",
    slug: "felicity-solar-5kva-48v-pure-sine-wave-hybrid-inverter",
    name: "Felicity Solar 5kVA 48V Pure Sine Wave Hybrid Inverter",
    brand: "Felicity Solar",
    brandSlug: "felicity-solar",
    category: "Solar & Power Solutions",
    categorySlug: "solar-power-solutions",
    department: "solar",
    priceKobo: 84500000, // ₦845,000
    priceFormatted: "₦845,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Heavy-duty 5kVA/5kW hybrid solar inverter with built-in 80A MPPT charge controller and high-voltage PV input.",
    description: "The Felicity Solar 5kVA 48V Hybrid Inverter is engineered for Nigerian homes and commercial offices seeking robust, uninterrupted power. It handles high-surge inductive loads like deep freezers, pumping machines, and AC units effortlessly, with pure sine wave output and seamless grid/solar switching.",
    isFeatured: true,
    isSolar: true,
    specifications: [
      { label: "Rated Power", value: "5000W / 5kVA Continuous" },
      { label: "Nominal System Voltage", value: "48V DC" },
      { label: "Waveform", value: "Pure Sine Wave" },
      { label: "MPPT Charge Controller", value: "Built-in 80A MPPT (120V - 450V DC)" },
      { label: "Max Solar Array", value: "5000W PV Input" },
      { label: "Surge Power", value: "10,000VA (5 seconds)" },
      { label: "Efficiency", value: "93% Peak" },
      { label: "Recommended Batteries", value: "48V LiFePO4 or 4x 12V Tubular" },
    ],
    imageSvg: "inverter",
    warrantySummary: "1 Year Official Manufacturer Warranty",
  },

  // 2. Solar Lithium Battery
  {
    id: "prod-feli-bat-10kwh",
    slug: "felicity-solar-10kwh-48v-lithium-lifepo4-battery",
    name: "Felicity Solar 10kWh 48V LiFePO4 Lithium Battery Wall-Mount",
    brand: "Felicity Solar",
    brandSlug: "felicity-solar",
    category: "Solar & Power Solutions",
    categorySlug: "solar-power-solutions",
    department: "solar",
    priceKobo: 215000000, // ₦2,150,000
    priceFormatted: "₦2,150,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "High-density 10kWh 48V 200Ah Lithium Iron Phosphate (LiFePO4) battery with smart BMS, 6000+ cycle life, and LCD screen.",
    description: "Designed for premium long-term energy storage, the Felicity Solar 10kWh Wall-Mount Lithium Battery delivers deep discharge capability (90% DoD) without thermal runaway risk. Built-in Battery Management System (BMS) safeguards against overcharge, over-discharge, and temperature fluctuations.",
    isFeatured: true,
    isSolar: true,
    specifications: [
      { label: "Usable Energy", value: "10.0 kWh (200Ah @ 51.2V)" },
      { label: "Battery Chemistry", value: "Lithium Iron Phosphate (LiFePO4)" },
      { label: "Cycle Life", value: "≥ 6,000 Cycles @ 80% DoD" },
      { label: "Max Discharge Current", value: "120A Continuous" },
      { label: "BMS Protection", value: "Overvoltage, Undervoltage, Short Circuit, Thermal" },
      { label: "Mounting", value: "Wall Mount or Floor Mount" },
      { label: "Display", value: "Integrated Smart LCD Status Panel" },
    ],
    imageSvg: "battery",
    warrantySummary: "5 Years Manufacturer Warranty",
  },

  // 3. Monocrystalline Solar Panel
  {
    id: "prod-feli-pv-550w",
    slug: "felicity-solar-550w-tier1-monocrystalline-solar-panel",
    name: "Felicity Solar 550W Half-Cell Monocrystalline Solar Panel",
    brand: "Felicity Solar",
    brandSlug: "felicity-solar",
    category: "Solar & Power Solutions",
    categorySlug: "solar-power-solutions",
    department: "solar",
    priceKobo: 11000000, // ₦110,000 per panel
    priceFormatted: "₦110,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Tier-1 550W half-cut monocrystalline PERC solar panel engineered for high efficiency in low-light and high-temperature conditions.",
    description: "High-yield 550 Watt monocrystalline solar panel featuring 144 half-cut cells and multi-busbar technology. Provides superior performance across morning and late afternoon hours, making it ideal for Plateau State's sunshine profile.",
    isFeatured: true,
    isSolar: true,
    specifications: [
      { label: "Peak Power (Pmax)", value: "550W" },
      { label: "Cell Type", value: "Monocrystalline Half-Cell PERC" },
      { label: "Module Efficiency", value: "21.3%" },
      { label: "Open Circuit Voltage (Voc)", value: "49.8V" },
      { label: "Optimum Operating Current (Imp)", value: "13.20A" },
      { label: "Frame", value: "Anodized Aluminum Alloy (Silver/Black)" },
      { label: "Junction Box", value: "IP68 Weatherproof with MC4 Connectors" },
    ],
    imageSvg: "panel",
    warrantySummary: "10 Years Product / 25 Years Linear Performance Warranty",
  },

  // 4. LG 65" 4K Smart TV
  {
    id: "prod-lg-tv-65",
    slug: "lg-65-inch-4k-uhd-smart-nanocell-satellite-tv",
    name: "LG 65\" 4K UHD Smart NanoCell Satellite TV with Magic Remote",
    brand: "LG Electronics",
    brandSlug: "lg",
    category: "Television & Visuals",
    categorySlug: "television-visuals",
    department: "electronics",
    priceKobo: 89000000, // ₦890,000
    priceFormatted: "₦890,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Ultra-vibrant 65-inch 4K NanoCell display with α5 Gen7 AI Processor, webOS 24, HDR10 Pro, and integrated satellite receiver.",
    description: "Experience cinema-grade entertainment in your living room with pure RGB colors delivered by LG NanoCell technology. Featuring built-in webOS for instant access to Netflix, YouTube, Prime Video, and DStv Stream, plus the intuitive AI Magic Remote.",
    isFeatured: true,
    isSolar: false,
    specifications: [
      { label: "Screen Size", value: "65 Inches (164 cm)" },
      { label: "Resolution", value: "4K Ultra HD (3840 x 2160)" },
      { label: "Display Technology", value: "NanoCell Color Filter" },
      { label: "Processor", value: "α5 AI Processor 4K Gen7" },
      { label: "Operating System", value: "LG webOS 24 with ThinQ AI" },
      { label: "Audio Output", value: "20W (2.0 Channel with AI Sound Pro)" },
      { label: "Connectivity", value: "3x HDMI 2.1, 2x USB, Wi-Fi 5, Bluetooth 5.0" },
      { label: "Tuner", value: "DVB-T2/C/S2 (Built-in Free-to-Air Satellite)" },
    ],
    imageSvg: "tv",
    warrantySummary: "2 Years Official LG Nigeria Warranty",
  },

  // 5. Samsung 55" 4K Smart TV
  {
    id: "prod-sam-tv-55",
    slug: "samsung-55-inch-crystal-uhd-4k-smart-tv",
    name: "Samsung 55\" Crystal UHD 4K Smart TV (DU7000 Series)",
    brand: "Samsung",
    brandSlug: "samsung",
    category: "Television & Visuals",
    categorySlug: "television-visuals",
    department: "electronics",
    priceKobo: 64000000, // ₦640,000
    priceFormatted: "₦640,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Crystal UHD 4K Smart TV with PurColor, Crystal Processor 4K, Tizen OS, and ultra-slim bezel design.",
    description: "Samsung's 55-inch Crystal UHD brings crisp 4K upscaling and lifelike color depth. Powered by Samsung Tizen OS with support for SmartThings, Apple AirPlay 2, and gaming hub optimization.",
    isFeatured: false,
    isSolar: false,
    specifications: [
      { label: "Screen Size", value: "55 Inches" },
      { label: "Resolution", value: "4K UHD (3840 x 2160)" },
      { label: "Picture Engine", value: "Crystal Processor 4K" },
      { label: "Smart Platform", value: "Samsung Tizen OS" },
      { label: "Sound", value: "Object Tracking Sound Lite (OTS Lite)" },
      { label: "Ports", value: "3x HDMI, 1x USB, Optical Out, LAN" },
    ],
    imageSvg: "tv",
    warrantySummary: "2 Years Official Samsung Warranty",
  },

  // 6. Hisense 3.1ch Soundbar
  {
    id: "prod-his-audio-31",
    slug: "hisense-31-channel-300w-bluetooth-soundbar-wireless-subwoofer",
    name: "Hisense 3.1Ch 300W Bluetooth Soundbar with Wireless Subwoofer",
    brand: "Hisense",
    brandSlug: "hisense",
    category: "Home & Office Audio",
    categorySlug: "home-audio",
    department: "electronics",
    priceKobo: 22000000, // ₦220,000
    priceFormatted: "₦220,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "300W total audio output with dedicated center channel for crystal-clear movie dialogue, Dolby Audio, and wireless bass subwoofer.",
    description: "Upgrade your TV sound dramatically with the Hisense HS312 Soundbar. The 3.1 channel speaker array ensures crisp vocal clarity, while the wireless subwoofer fills your room with punchy, distortion-free bass.",
    isFeatured: true,
    isSolar: false,
    specifications: [
      { label: "Total Power", value: "300 Watts RMS" },
      { label: "Channels", value: "3.1 (Left, Center, Right + Subwoofer)" },
      { label: "Subwoofer", value: "6.5\" Wireless Subwoofer" },
      { label: "Audio Decoders", value: "Dolby Digital, DTS Virtual:X" },
      { label: "Connections", value: "HDMI ARC, Optical, Coaxial, USB, AUX, Bluetooth 5.0" },
      { label: "Wall Mountable", value: "Yes (Kit Included)" },
    ],
    imageSvg: "audio",
    warrantySummary: "1 Year Official Hisense Warranty",
  },

  // 7. LG XBOOM High Power Audio
  {
    id: "prod-lg-xboom",
    slug: "lg-xboom-1000w-high-power-hi-fi-entertainment-audio",
    name: "LG XBOOM 1000W High Power Entertainment System with DJ Lighting",
    brand: "LG Electronics",
    brandSlug: "lg",
    category: "Home & Office Audio",
    categorySlug: "home-audio",
    department: "electronics",
    priceKobo: 39500000, // ₦395,000
    priceFormatted: "₦395,000",
    stockStatus: "confirm_with_store",
    stockLabel: "Confirm Availability",
    summary: "1000W room-shaking audio system featuring Bass Blast, multi-color party lighting, karaoke creator, and dual USB recording.",
    description: "Built for celebrations, events, and true music lovers. LG XBOOM produces thunderous low-end frequencies with dedicated bass reflex ports and interactive DJ effects control via smartphone.",
    isFeatured: false,
    isSolar: false,
    specifications: [
      { label: "Output Power", value: "1000W RMS" },
      { label: "Lighting", value: "Multi-Color LED Speaker Lighting" },
      { label: "Special Features", value: "Karaoke Star, Vocal Effects, DJ Pad" },
      { label: "Wireless", value: "Bluetooth Multi-Phone Pairing" },
      { label: "Inputs", value: "Dual USB, Mic In (x2), CD Player, FM Tuner" },
    ],
    imageSvg: "audio",
    warrantySummary: "2 Years Official LG Warranty",
  },

  // 8. Hisense 250L Refrigerator
  {
    id: "prod-his-fridge-250",
    slug: "hisense-250l-top-mount-no-frost-double-door-refrigerator",
    name: "Hisense 250L Top Mount No-Frost Double Door Refrigerator",
    brand: "Hisense",
    brandSlug: "hisense",
    category: "Refrigeration & Cooling",
    categorySlug: "refrigeration-cooling",
    department: "electronics",
    priceKobo: 38500000, // ₦385,000
    priceFormatted: "₦385,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Energy-efficient 250-litre double-door refrigerator with Total No-Frost technology, multi-air flow cooling, and low-voltage tolerance.",
    description: "Engineered specifically for Nigerian power realities, this Hisense refrigerator runs efficiently on solar inverter setups and features wide voltage stabilization. Frost-free design ensures food preservation without icy buildup.",
    isFeatured: true,
    isSolar: false,
    specifications: [
      { label: "Capacity", value: "250 Litres Total Net Volume" },
      { label: "Defrost System", value: "Total No Frost" },
      { label: "Cooling Technology", value: "Multi-Air Flow Cooling" },
      { label: "Refrigerant", value: "Eco-friendly R600a" },
      { label: "Energy Rating", value: "A+ High Efficiency" },
      { label: "Shelves", value: "Tempered Glass Spill-Proof Shelves" },
      { label: "Lighting", value: "Interior Soft LED" },
    ],
    imageSvg: "fridge",
    warrantySummary: "1 Year Full / 5 Years Compressor Warranty",
  },

  // 9. Nexus 195L Chest Freezer
  {
    id: "prod-nex-freezer-195",
    slug: "nexus-195l-tropicalized-fast-freezing-chest-freezer",
    name: "Nexus 195L Tropicalized Fast-Freezing Chest Freezer",
    brand: "Nexus",
    brandSlug: "nexus",
    category: "Refrigeration & Cooling",
    categorySlug: "refrigeration-cooling",
    department: "electronics",
    priceKobo: 29500000, // ₦295,000
    priceFormatted: "₦295,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Tropicalized heavy-duty chest freezer with 100-hour cooling retention, fast-freeze function, and lockable safety lid.",
    description: "The Nexus 195L chest freezer is built for tropical climates. Its super-insulated walls maintain freezing temperatures for up to 100 hours after a power outage, protecting perishables safely.",
    isFeatured: false,
    isSolar: false,
    specifications: [
      { label: "Gross Capacity", value: "195 Litres" },
      { label: "Cooling Retention", value: "Up to 100 Hours after power cut" },
      { label: "Lid Features", value: "Safety Key Lock & Integrated Handle" },
      { label: "Interior", value: "Anti-Rust Embossed Aluminum Interior" },
      { label: "Drainage", value: "Front Defrost Water Drain" },
      { label: "Basket", value: "Removable Storage Wire Basket Included" },
    ],
    imageSvg: "freezer",
    warrantySummary: "2 Years Nexus Official Warranty",
  },

  // 10. Saisho 3-in-1 Blender
  {
    id: "prod-sai-blender",
    slug: "saisho-3-in-1-heavy-duty-electric-blender-grinder",
    name: "Saisho 3-in-1 Heavy Duty Electric Blender with Mill & Grinder",
    brand: "Saisho",
    brandSlug: "saisho",
    category: "Kitchen & Small Appliances",
    categorySlug: "kitchen-appliances",
    department: "electronics",
    priceKobo: 2800000, // ₦28,000
    priceFormatted: "₦28,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Heavy-duty electric kitchen blender with stainless steel serrated blades, 1.5L unbreakable jar, and 2 dry-mill grinder attachments.",
    description: "A staple for Nigerian homes. Easily blends tomatoes, pepper, beans for akara/moi-moi, tigernut, and dry spices with a reliable copper motor.",
    isFeatured: false,
    isSolar: false,
    specifications: [
      { label: "Motor Power", value: "350W Pure Copper Motor" },
      { label: "Jar Capacity", value: "1.5L Unbreakable PC Jar" },
      { label: "Attachments", value: "2x Dry Grinder Mills (Spices, Beans)" },
      { label: "Speed Controls", value: "2 Speeds + Pulse Function" },
      { label: "Blades", value: "Serrated Stainless Steel" },
    ],
    imageSvg: "blender",
    warrantySummary: "1 Year Store Warranty",
  },

  // 11. Samsung 32L Microwave
  {
    id: "prod-sam-micro-32",
    slug: "samsung-32l-solo-microwave-oven-ceramic-enamel",
    name: "Samsung 32L Solo Microwave Oven with Ceramic Enamel Interior",
    brand: "Samsung",
    brandSlug: "samsung",
    category: "Kitchen & Small Appliances",
    categorySlug: "kitchen-appliances",
    department: "electronics",
    priceKobo: 16500000, // ₦165,000
    priceFormatted: "₦165,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "32-litre capacity microwave with scratch-resistant ceramic enamel cavity, Triple Distribution System for even cooking, and Eco Mode.",
    description: "Durable, hygienic, and easy to clean. Samsung's ceramic enamel interior is 99.9% antibacterial and resistant to rust and scratches.",
    isFeatured: false,
    isSolar: false,
    specifications: [
      { label: "Cavity Capacity", value: "32 Litres" },
      { label: "Power Output", value: "1000W Cooking Power" },
      { label: "Interior Coating", value: "Ceramic Enamel (10-Yr Warranty on Cavity)" },
      { label: "Defrosting", value: "Power Defrost (Meat, Poultry, Fish, Bread)" },
      { label: "Control", value: "Tact + Dial Controls with Digital Display" },
    ],
    imageSvg: "microwave",
    warrantySummary: "2 Years Official Samsung Warranty",
  },

  // 12. Sollatek AVS30
  {
    id: "prod-sol-avs30",
    slug: "sollatek-avs30-automatic-voltage-switcher-30a",
    name: "Sollatek AVS30 Automatic Voltage Switcher 30-Amp Power Guard",
    brand: "Sollatek",
    brandSlug: "sollatek",
    category: "Electrical & Solar Accessories",
    categorySlug: "electrical-accessories",
    department: "solar",
    priceKobo: 4800000, // ₦48,000
    priceFormatted: "₦48,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Genuine UK-engineered 30A automatic voltage switcher protecting inverters, air conditioners, and entire home distribution boards from surges.",
    description: "Guards against low voltage, high voltage, brownouts, power back surges, and voltage spikes. Disconnects dangerous power and reconnects automatically only after power normalizes.",
    isFeatured: true,
    isSolar: true,
    specifications: [
      { label: "Current Rating", value: "30 Amps (Direct In-Line Wire)" },
      { label: "Nominal Voltage", value: "230V AC" },
      { label: "Low Voltage Disconnect", value: "185V AC (Adjustable)" },
      { label: "High Voltage Disconnect", value: "260V AC" },
      { label: "Delay Wait Time", value: "10s to 10m User-Configurable" },
      { label: "Indicators", value: "5 LED Status Display (Good, Wait, Bad)" },
    ],
    imageSvg: "accessories",
    warrantySummary: "5 Years Genuine Sollatek Manufacturer Warranty",
  },

  // 13. Solar DC Cable 16mm²
  {
    id: "prod-solar-cable-16",
    slug: "16mm2-double-insulated-flexible-solar-dc-cable-100m",
    name: "16mm² Double-Insulated Pure Copper Solar DC Cable (100m Roll)",
    brand: "Felicity Solar",
    brandSlug: "felicity-solar",
    category: "Electrical & Solar Accessories",
    categorySlug: "electrical-accessories",
    department: "solar",
    priceKobo: 18500000, // ₦185,000
    priceFormatted: "₦185,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Heavy-duty 16mm² tinned pure copper DC battery and solar cable with halogen-free, UV-resistant cross-linked insulation.",
    description: "Minimizes power loss between battery banks and inverters. Resistant to heat up to 120°C, UV degradation, acid, and ozone.",
    isFeatured: false,
    isSolar: true,
    specifications: [
      { label: "Conductor Size", value: "16mm² (Class 5 Tinned Copper)" },
      { label: "Voltage Rating", value: "1500V DC / 1000V AC" },
      { label: "Length", value: "100 Metres Continuous Coil" },
      { label: "Temperature Range", value: "-40°C to +120°C" },
      { label: "Standards", value: "TUV EN50618 Certified" },
    ],
    imageSvg: "accessories",
    warrantySummary: "25 Years Rated Outdoor Life",
  },

  // 14. Felicity Solar 60A MPPT Controller
  {
    id: "prod-feli-mppt-60",
    slug: "felicity-solar-60a-mppt-solar-charge-controller",
    name: "Felicity Solar 60A Smart MPPT Solar Charge Controller (12V/24V/48V)",
    brand: "Felicity Solar",
    brandSlug: "felicity-solar",
    category: "Solar & Power Solutions",
    categorySlug: "solar-power-solutions",
    department: "solar",
    priceKobo: 9500000, // ₦95,000
    priceFormatted: "₦95,000",
    stockStatus: "in_stock",
    stockLabel: "In Stock at Jos Store",
    summary: "Ultra-fast maximum power point tracking with 99.5% efficiency, multi-voltage auto-detection, and multi-stage battery charging.",
    description: "Extracts up to 30% more energy from solar arrays compared to PWM controllers. Suitable for 12V, 24V, 36V, and 48V battery systems with custom lithium parameters.",
    isFeatured: false,
    isSolar: true,
    specifications: [
      { label: "Rated Current", value: "60 Amps" },
      { label: "System Voltage", value: "12V / 24V / 36V / 48V Auto-Select" },
      { label: "Max PV Input Voltage", value: "150V DC" },
      { label: "Max PV Input Power", value: "2880W (@ 48V Battery)" },
      { label: "Tracking Efficiency", value: "≥ 99.5%" },
      { label: "Display", value: "Backlit Multi-Function LCD Screen" },
    ],
    imageSvg: "inverter",
    warrantySummary: "1 Year Official Felicity Warranty",
  },
];

// ------------------------------------------------------------------------------
// Catalogue Query Service Functions
// ------------------------------------------------------------------------------

export function getAllProducts(): CatalogueProduct[] {
  return PRODUCTS;
}

export function getFeaturedProducts(): CatalogueProduct[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getSolarProducts(): CatalogueProduct[] {
  return PRODUCTS.filter((p) => p.isSolar || p.department === "solar");
}

export function getElectronicsProducts(): CatalogueProduct[] {
  return PRODUCTS.filter((p) => !p.isSolar && p.department === "electronics");
}

export function getProductBySlug(slug: string): CatalogueProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): CatalogueProduct[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByBrand(brandSlug: string): CatalogueProduct[] {
  return PRODUCTS.filter((p) => p.brandSlug === brandSlug);
}

export function searchCatalogue(options?: {
  query?: string;
  categorySlug?: string;
  brandSlug?: string;
  department?: DepartmentType;
  sortBy?: "featured" | "price-asc" | "price-desc" | "name";
}): CatalogueProduct[] {
  let list = [...PRODUCTS];

  if (options?.query && options.query.trim().length > 0) {
    const q = options.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.specifications.some(
          (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        )
    );
  }

  if (options?.categorySlug && options.categorySlug !== "all") {
    list = list.filter((p) => p.categorySlug === options.categorySlug);
  }

  if (options?.brandSlug && options.brandSlug !== "all") {
    list = list.filter((p) => p.brandSlug === options.brandSlug);
  }

  if (options?.department) {
    list = list.filter((p) => p.department === options.department);
  }

  if (options?.sortBy) {
    switch (options.sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.priceKobo ?? 0) - (b.priceKobo ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.priceKobo ?? 0) - (a.priceKobo ?? 0));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  return list;
}

