// Fictional demonstration data. Never present these products/prices as client inventory.
// Remove or replace before production; use database-backed repositories for real content.
export type DemoProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number | null;
  stockStatus: "confirm" | "in-stock" | "out-of-stock";
  summary: string;
  specifications: { label: string; value: string }[];
};

export const demoProducts: DemoProduct[] = [
  {
    id: "demo-phone-001",
    slug: "demo-smartphone",
    name: "Demo Smartphone (Sample)",
    category: "Phones",
    brand: "Demo Brand",
    price: null,
    stockStatus: "confirm",
    summary: "Fictional sample listing used to demonstrate the catalogue layout.",
    specifications: [
      { label: "Display", value: "Sample specification — verify before publishing" },
      { label: "Storage", value: "Sample specification — verify before publishing" },
      { label: "Warranty", value: "Not specified — confirm with store" },
    ],
  },
  {
    id: "demo-audio-001",
    slug: "demo-wireless-headphones",
    name: "Demo Wireless Headphones (Sample)",
    category: "Audio",
    brand: "Demo Brand",
    price: null,
    stockStatus: "confirm",
    summary: "Fictional sample listing used to demonstrate product cards and enquiries.",
    specifications: [
      { label: "Connectivity", value: "Sample specification — verify before publishing" },
      { label: "Battery", value: "Sample specification — verify before publishing" },
      { label: "Warranty", value: "Not specified — confirm with store" },
    ],
  },
  {
    id: "demo-power-001",
    slug: "demo-power-bank",
    name: "Demo Power Bank (Sample)",
    category: "Accessories",
    brand: "Demo Brand",
    price: null,
    stockStatus: "confirm",
    summary: "Fictional sample listing. Replace with a verified product before launch.",
    specifications: [
      { label: "Capacity", value: "Sample specification — verify before publishing" },
      { label: "Ports", value: "Sample specification — verify before publishing" },
      { label: "Warranty", value: "Not specified — confirm with store" },
    ],
  },
];

export const demoCategories = ["Phones", "Audio", "Accessories", "Computers", "Home Electronics"];
