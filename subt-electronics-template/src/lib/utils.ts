export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function safePhoneHref(phone: string): string | null {
  const normalized = phone.replace(/[^\d+]/g, "");
  if (!/^\+?\d{7,15}$/.test(normalized)) return null;
  return `tel:${normalized}`;
}

export function safeWhatsAppHref(phone: string): string | null {
  const normalized = phone.replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(normalized)) return null;
  return `https://wa.me/${normalized}`;
}
