import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { STORE_INFO } from "@/lib/catalogue-data";
import { SettingsManager, type SettingsData } from "./settings-manager";

export default async function AdminSettingsPage() {
  let settings: SettingsData = {
    business_name: STORE_INFO.name,
    tagline: STORE_INFO.tagline,
    address: STORE_INFO.address,
    phone: STORE_INFO.phone,
    whatsapp: STORE_INFO.whatsapp,
    email: STORE_INFO.email,
    opening_hours: STORE_INFO.openingHours,
    delivery_info: "",
    warranty_policy: "",
    about_text: "",
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        settings = {
          business_name: data.business_name || STORE_INFO.name,
          tagline: data.tagline || STORE_INFO.tagline,
          address: data.address || STORE_INFO.address,
          phone: data.phone || STORE_INFO.phone,
          whatsapp: data.whatsapp || STORE_INFO.whatsapp,
          email: data.email || STORE_INFO.email,
          opening_hours: data.opening_hours || STORE_INFO.openingHours,
          delivery_info: data.delivery_info || "",
          warranty_policy: data.warranty_policy || "",
          about_text: data.about_text || "",
        };
      }
    } catch (err) {
      console.warn("Settings fetch error:", err);
    }
  }

  return <SettingsManager initialSettings={settings} />;
}
