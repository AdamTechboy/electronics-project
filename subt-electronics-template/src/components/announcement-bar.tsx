import React from "react";
import { STORE_INFO, createWhatsAppEnquiryUrl } from "@/lib/catalogue-data";

export function AnnouncementBar() {
  const whatsappUrl = createWhatsAppEnquiryUrl();

  return (
    <div className="announcement-bar">
      <div className="container announcement-inner">
        <div className="announcement-location">
          <span>📍</span>
          <span>
            Showroom: <strong>{STORE_INFO.shortAddress}</strong> (opp. Zenith Bank)
          </span>
        </div>
        <div className="announcement-contact">
          <span className="announcement-hours">🕒 {STORE_INFO.openingHours}</span>
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="announcement-link"
            aria-label={`Call ${STORE_INFO.name} directly at ${STORE_INFO.phoneDisplay}`}
          >
            <span>📞</span> {STORE_INFO.phoneDisplay}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-link whatsapp"
            aria-label="Direct WhatsApp enquiry with Muhammad Kairu Electronics"
          >
            <span>💬</span> WhatsApp Enquiries
          </a>
        </div>
      </div>
    </div>
  );
}

