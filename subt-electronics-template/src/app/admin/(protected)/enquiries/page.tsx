import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EnquiriesManager, type EnquiryItem } from "./enquiries-manager";

interface DbEnquiryRow {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  product_name: string | null;
  message: string;
  status: string;
  created_at: string;
  enquiry_notes: Array<{ id: string; note: string; created_at: string }> | null;
}

export default async function AdminEnquiriesPage() {
  let enquiries: EnquiryItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("enquiries")
        .select(`
          id,
          reference,
          name,
          phone,
          email,
          product_name,
          message,
          status,
          created_at,
          enquiry_notes ( id, note, created_at )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        enquiries = (data as unknown as DbEnquiryRow[]).map((row) => ({
          id: row.id,
          reference: row.reference,
          name: row.name,
          phone: row.phone,
          email: row.email,
          product_name: row.product_name,
          message: row.message,
          status: row.status as EnquiryItem["status"],
          created_at: row.created_at,
          notes: row.enquiry_notes || [],
        }));
      }
    } catch (err) {
      console.warn("Enquiries fetch error:", err);
    }
  }

  return <EnquiriesManager initialEnquiries={enquiries} />;
}
