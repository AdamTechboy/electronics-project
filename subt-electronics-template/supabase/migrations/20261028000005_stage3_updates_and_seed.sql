-- ==============================================================================
-- Muhammad Kairu Electronics — Migration 5: Stage 3 Storefront Policies, Categories & Catalogue Seed
-- Adds policy fields to store_settings, syncs core categories & brands, and seeds verified products.
-- ==============================================================================

-- 1. Add Editable Store Content Fields to store_settings
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS delivery_info TEXT,
ADD COLUMN IF NOT EXISTS warranty_policy TEXT,
ADD COLUMN IF NOT EXISTS about_text TEXT;

-- 2. Update Singleton Store Settings with Verified Jos Identity
UPDATE public.store_settings
SET
    business_name = 'Muhammad Kairu Electronics',
    tagline = 'Powering Homes. Entertaining Families.',
    address = 'No. 41 Ahmadu Bello Way, Shop 31A, Rochas Plaza, opposite Zenith Bank, Jos, Plateau State, Nigeria',
    phone = '07038365737',
    whatsapp = '07038365737',
    email = 'mkelectronics@gmail.com',
    primary_color = '#1F2A44',
    secondary_color = '#F5A623',
    background_color = '#F7F5F0',
    accent_color = '#16A34A',
    opening_hours = 'Monday – Saturday: 8:30 AM – 6:00 PM',
    delivery_info = 'Same-day showroom pickup at Rochas Plaza, Jos. Live testing before collection. Coordinated transport across Plateau State and Northern Nigeria.',
    warranty_policy = 'Official manufacturer warranties on all brand-new electronics (1–5 years). All units tested on-bench before customer handover.',
    about_text = 'Plateau State specialist retailer for hybrid solar inverters, lithium storage batteries, Tier-1 solar panels, and premier home entertainment.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- 3. Sync Categories with Verified Storefront Departments
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active)
VALUES
    ('10000000-0000-0000-0000-000000000011'::uuid, 'Solar & Power Solutions', 'solar-power-solutions', 'Hybrid inverters, monocrystalline solar panels, LiFePO4 batteries, and MPPT controllers.', 1, true),
    ('10000000-0000-0000-0000-000000000012'::uuid, 'Television & Visuals', 'television-visuals', '4K Smart TVs, OLED, QLED, and digital satellite televisions from top global brands.', 2, true),
    ('10000000-0000-0000-0000-000000000013'::uuid, 'Home & Office Audio', 'home-audio', 'Soundbars, Bluetooth party speakers, home theatre systems, and wireless audio.', 3, true),
    ('10000000-0000-0000-0000-000000000014'::uuid, 'Refrigeration & Cooling', 'refrigeration-cooling', 'Low-voltage and energy-efficient refrigerators, chest freezers, and air cooling.', 4, true),
    ('10000000-0000-0000-0000-000000000015'::uuid, 'Kitchen & Small Appliances', 'kitchen-appliances', 'High-durability blenders, microwave ovens, electric kettles, and kitchen essentials.', 5, true),
    ('10000000-0000-0000-0000-000000000016'::uuid, 'Electrical & Solar Accessories', 'electrical-accessories', 'Surge protectors, automatic voltage switchers (AVS), DC solar cables, and changeovers.', 6, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- 4. Sync Brands with Verified Manufacturer Partners
INSERT INTO public.brands (id, name, slug, is_active)
VALUES
    ('20000000-0000-0000-0000-000000000011'::uuid, 'Felicity Solar', 'felicity-solar', true),
    ('20000000-0000-0000-0000-000000000012'::uuid, 'LG Electronics', 'lg', true),
    ('20000000-0000-0000-0000-000000000013'::uuid, 'Samsung', 'samsung', true),
    ('20000000-0000-0000-0000-000000000014'::uuid, 'Hisense', 'hisense', true),
    ('20000000-0000-0000-0000-000000000015'::uuid, 'Nexus', 'nexus', true),
    ('20000000-0000-0000-0000-000000000016'::uuid, 'Sollatek', 'sollatek', true),
    ('20000000-0000-0000-0000-000000000017'::uuid, 'Saisho', 'saisho', true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    is_active = EXCLUDED.is_active;

-- 5. Seed Core Verified Products
INSERT INTO public.products (
    id, category_id, brand_id, name, slug, summary, description,
    price_kobo, currency, stock_status, warranty_details,
    is_published, is_archived, is_featured, specifications
)
VALUES
    (
        '30000000-0000-0000-0000-000000000001'::uuid,
        '10000000-0000-0000-0000-000000000011'::uuid,
        '20000000-0000-0000-0000-000000000011'::uuid,
        'Felicity Solar 5kVA 48V Pure Sine Wave Hybrid Inverter',
        'felicity-solar-5kva-48v-pure-sine-wave-hybrid-inverter',
        'Heavy-duty 5kVA/5kW hybrid solar inverter with built-in 80A MPPT charge controller and high-voltage PV input.',
        'The Felicity Solar 5kVA 48V Hybrid Inverter is engineered for Nigerian homes and commercial offices seeking robust, uninterrupted power. It handles high-surge inductive loads like deep freezers, pumping machines, and AC units effortlessly, with pure sine wave output and seamless grid/solar switching.',
        84500000, 'NGN', 'in_stock', '1 Year Official Manufacturer Warranty',
        true, false, true,
        '[{"label": "Rated Power", "value": "5000W / 5kVA Continuous"}, {"label": "Nominal System Voltage", "value": "48V DC"}, {"label": "Waveform", "value": "Pure Sine Wave"}, {"label": "MPPT Controller", "value": "Built-in 80A MPPT (120V - 450V DC)"}, {"label": "Max Solar Array", "value": "5000W PV Input"}, {"label": "Surge Power", "value": "10000VA (5 seconds)"}]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000002'::uuid,
        '10000000-0000-0000-0000-000000000011'::uuid,
        '20000000-0000-0000-0000-000000000011'::uuid,
        'Felicity Solar 10kWh 48V LiFePO4 Lithium Battery Wall-Mount',
        'felicity-solar-10kwh-48v-lithium-lifepo4-battery',
        'High-density 10kWh 48V 200Ah Lithium Iron Phosphate (LiFePO4) battery with smart BMS, 6000+ cycle life, and LCD screen.',
        'Designed for premium long-term energy storage, the Felicity Solar 10kWh Wall-Mount Lithium Battery delivers deep discharge capability (90% DoD) without thermal runaway risk. Built-in Battery Management System (BMS) safeguards against overcharge, over-discharge, and temperature fluctuations.',
        215000000, 'NGN', 'in_stock', '5 Years Manufacturer Warranty',
        true, false, true,
        '[{"label": "Usable Energy", "value": "10.0 kWh (200Ah @ 51.2V)"}, {"label": "Chemistry", "value": "Lithium Iron Phosphate (LiFePO4)"}, {"label": "Cycle Life", "value": "6000+ Cycles @ 80% DoD"}, {"label": "Max Discharge", "value": "120A Continuous"}, {"label": "BMS Protection", "value": "Overvoltage, Undervoltage, Thermal"}]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000003'::uuid,
        '10000000-0000-0000-0000-000000000011'::uuid,
        '20000000-0000-0000-0000-000000000011'::uuid,
        'Felicity Solar 550W Half-Cell Monocrystalline Solar Panel',
        'felicity-solar-550w-tier1-monocrystalline-solar-panel',
        'Tier-1 550W half-cut monocrystalline PERC solar panel engineered for high efficiency in low-light and high-temperature conditions.',
        'High-yield 550 Watt monocrystalline solar panel featuring 144 half-cut cells and multi-busbar technology. Provides superior performance across morning and late afternoon hours, making it ideal for Plateau State sunshine profile.',
        11000000, 'NGN', 'in_stock', '10 Years Product / 25 Years Performance Warranty',
        true, false, true,
        '[{"label": "Peak Power", "value": "550W"}, {"label": "Cell Type", "value": "Monocrystalline Half-Cell PERC"}, {"label": "Module Efficiency", "value": "21.3%"}, {"label": "Open Circuit Voltage", "value": "49.8V"}, {"label": "Operating Current", "value": "13.20A"}]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000004'::uuid,
        '10000000-0000-0000-0000-000000000012'::uuid,
        '20000000-0000-0000-0000-000000000012'::uuid,
        'LG 65" 4K UHD Smart NanoCell Satellite TV with Magic Remote',
        'lg-65-inch-4k-uhd-smart-nanocell-satellite-tv',
        'Ultra-vibrant 65-inch 4K NanoCell display with a5 Gen7 AI Processor, webOS 24, HDR10 Pro, and integrated satellite receiver.',
        'Experience cinema-grade entertainment in your living room with pure RGB colors delivered by LG NanoCell technology. Featuring built-in webOS for instant access to Netflix, YouTube, Prime Video, and DStv Stream, plus the intuitive AI Magic Remote.',
        89000000, 'NGN', 'in_stock', '2 Years Official LG Nigeria Warranty',
        true, false, true,
        '[{"label": "Screen Size", "value": "65 Inches"}, {"label": "Resolution", "value": "4K Ultra HD (3840 x 2160)"}, {"label": "Processor", "value": "a5 AI Processor 4K Gen7"}, {"label": "OS", "value": "LG webOS 24 with ThinQ AI"}, {"label": "Audio", "value": "20W AI Sound Pro"}]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000005'::uuid,
        '10000000-0000-0000-0000-000000000013'::uuid,
        '20000000-0000-0000-0000-000000000014'::uuid,
        'Hisense 3.1Ch 300W Bluetooth Soundbar with Wireless Subwoofer',
        'hisense-31-channel-300w-bluetooth-soundbar-wireless-subwoofer',
        '300W total audio output with dedicated center channel for crystal-clear movie dialogue, Dolby Audio, and wireless bass subwoofer.',
        'Upgrade your TV sound dramatically with the Hisense HS312 Soundbar. The 3.1 channel speaker array ensures crisp vocal clarity, while the wireless subwoofer fills your room with punchy, distortion-free bass.',
        22000000, 'NGN', 'in_stock', '1 Year Official Hisense Warranty',
        true, false, true,
        '[{"label": "Total Power", "value": "300W RMS"}, {"label": "Channels", "value": "3.1 (L/C/R + Subwoofer)"}, {"label": "Subwoofer", "value": "6.5 Inch Wireless Sub"}, {"label": "Decoders", "value": "Dolby Digital, DTS Virtual:X"}, {"label": "Ports", "value": "HDMI ARC, Optical, Bluetooth 5.0"}]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000006'::uuid,
        '10000000-0000-0000-0000-000000000014'::uuid,
        '20000000-0000-0000-0000-000000000014'::uuid,
        'Hisense 250L Top Mount No-Frost Double Door Refrigerator',
        'hisense-250l-top-mount-no-frost-double-door-refrigerator',
        'Energy-efficient 250-litre double-door refrigerator with Total No-Frost technology, multi-air flow cooling, and low-voltage tolerance.',
        'Engineered specifically for Nigerian power realities, this Hisense refrigerator runs efficiently on solar inverter setups and features wide voltage stabilization. Frost-free design ensures food preservation without icy buildup.',
        38500000, 'NGN', 'in_stock', '1 Year Full / 5 Years Compressor Warranty',
        true, false, true,
        '[{"label": "Capacity", "value": "250 Litres"}, {"label": "Defrost", "value": "Total No Frost"}, {"label": "Cooling", "value": "Multi-Air Flow"}, {"label": "Refrigerant", "value": "Eco-friendly R600a"}, {"label": "Energy Rating", "value": "A+ High Efficiency"}]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000007'::uuid,
        '10000000-0000-0000-0000-000000000016'::uuid,
        '20000000-0000-0000-0000-000000000016'::uuid,
        'Sollatek AVS30 Automatic Voltage Switcher 30-Amp Power Guard',
        'sollatek-avs30-automatic-voltage-switcher-30a',
        'Genuine UK-engineered 30A automatic voltage switcher protecting inverters, air conditioners, and entire home distribution boards from surges.',
        'Guards against low voltage, high voltage, brownouts, power back surges, and voltage spikes. Disconnects dangerous power and reconnects automatically only after power normalizes.',
        4800000, 'NGN', 'in_stock', '5 Years Genuine Sollatek Warranty',
        true, false, true,
        '[{"label": "Current Rating", "value": "30 Amps"}, {"label": "Nominal Voltage", "value": "230V AC"}, {"label": "Low Voltage Cut", "value": "185V AC"}, {"label": "High Voltage Cut", "value": "260V AC"}, {"label": "Indicators", "value": "5 LED Status Display"}]'::jsonb
    )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    price_kobo = EXCLUDED.price_kobo,
    stock_status = EXCLUDED.stock_status,
    warranty_details = EXCLUDED.warranty_details,
    is_published = EXCLUDED.is_published,
    is_featured = EXCLUDED.is_featured,
    specifications = EXCLUDED.specifications;

-- 6. Initialize Inventory Records for Seeded Products
INSERT INTO public.inventory_records (product_id, quantity, low_stock_threshold, note)
SELECT id, 10, 2, 'Initial verified inventory at Rochas Plaza Jos showroom'
FROM public.products
ON CONFLICT (product_id) DO NOTHING;
