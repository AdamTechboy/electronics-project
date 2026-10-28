import React from "react";

interface ProductSvgProps {
  type: string;
  className?: string;
  alt?: string;
}

export function ProductSvg({ type, className = "product-svg", alt }: ProductSvgProps) {
  switch (type) {
    case "inverter":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Solar Inverter Illustration"}
        >
          {/* Background subtle radial glow */}
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Main Inverter Chassis */}
          <rect x="75" y="35" width="170" height="170" rx="12" fill="#1F2A44" stroke="#0F172A" strokeWidth="2" />
          {/* Beveled Top Edge */}
          <path d="M75 47C75 40.3726 80.3726 35 87 35H233C239.627 35 245 40.3726 245 47V60H75V47Z" fill="#2B3A5C" />
          <rect x="90" y="44" width="8" height="8" rx="2" fill="#16A34A" />
          <rect x="104" y="44" width="8" height="8" rx="2" fill="#F5A623" />
          <rect x="118" y="44" width="8" height="8" rx="2" fill="#EF4444" />
          {/* Brand plate */}
          <rect x="140" y="43" width="75" height="10" rx="3" fill="#152033" />
          <text x="177" y="51" fill="#F5A623" fontSize="6" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            HYBRID INVERTER
          </text>
          {/* Glowing Smart LCD Screen */}
          <rect x="95" y="70" width="130" height="65" rx="6" fill="#0C1524" stroke="#F5A623" strokeWidth="1.5" />
          <rect x="100" y="75" width="120" height="55" rx="4" fill="#070D18" />
          {/* Screen Content */}
          <text x="108" y="90" fill="#22C55E" fontSize="9" fontWeight="bold">PV: 385V</text>
          <text x="168" y="90" fill="#F5A623" fontSize="9" fontWeight="bold">BAT: 52.8V</text>
          <text x="108" y="108" fill="#38BDF8" fontSize="13" fontWeight="bold">5.0 kVA</text>
          <text x="168" y="108" fill="#A855F7" fontSize="8" fontWeight="bold">OUTPUT: 230V</text>
          <path d="M108 118H212" stroke="#1F2A44" strokeWidth="2" />
          <circle cx="114" cy="122" r="2" fill="#22C55E" />
          <text x="120" y="124" fill="#94A3B8" fontSize="6">PURE SINE WAVE</text>
          {/* Cooling Vents */}
          <g opacity="0.7">
            <line x1="95" y1="150" x2="225" y2="150" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="95" y1="157" x2="225" y2="157" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="95" y1="164" x2="225" y2="164" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="95" y1="171" x2="225" y2="171" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="95" y1="178" x2="225" y2="178" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Power Switch & Terminals */}
          <rect x="145" y="188" width="30" height="10" rx="3" fill="#DC2626" />
          <text x="160" y="195" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">POWER</text>
          {/* DC Battery Terminals at bottom */}
          <rect x="100" y="205" width="16" height="8" rx="2" fill="#DC2626" />
          <rect x="204" y="205" width="16" height="8" rx="2" fill="#1E293B" />
        </svg>
      );

    case "battery":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Lithium Battery Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Wall-Mount Battery Chassis */}
          <rect x="80" y="30" width="160" height="180" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Side handles */}
          <rect x="68" y="70" width="12" height="40" rx="4" fill="#94A3B8" />
          <rect x="240" y="70" width="12" height="40" rx="4" fill="#94A3B8" />
          {/* Dark Glass Center Panel */}
          <rect x="94" y="45" width="132" height="150" rx="8" fill="#1E293B" />
          {/* Brand header */}
          <text x="160" y="65" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            LiFePO4 LITHIUM
          </text>
          <text x="160" y="76" fill="#94A3B8" fontSize="7" textAnchor="middle">
            48V 200Ah · 10.24 kWh
          </text>
          {/* State of Charge Gauge Bar */}
          <rect x="110" y="90" width="100" height="14" rx="4" fill="#0F172A" stroke="#334155" />
          <rect x="112" y="92" width="22" height="10" rx="2" fill="#22C55E" />
          <rect x="136" y="92" width="22" height="10" rx="2" fill="#22C55E" />
          <rect x="160" y="92" width="22" height="10" rx="2" fill="#22C55E" />
          <rect x="184" y="92" width="22" height="10" rx="2" fill="#22C55E" />
          <text x="160" y="117" fill="#22C55E" fontSize="8" fontWeight="bold" textAnchor="middle">
            STATE OF CHARGE: 100%
          </text>
          {/* BMS status indicators */}
          <g>
            <circle cx="120" cy="135" r="4" fill="#22C55E" />
            <text x="128" y="138" fill="#CBD5E1" fontSize="6">RUN</text>
            <circle cx="155" cy="135" r="4" fill="#3B82F6" />
            <text x="163" y="138" fill="#CBD5E1" fontSize="6">SOC</text>
            <circle cx="190" cy="135" r="4" fill="#64748B" />
            <text x="198" y="138" fill="#CBD5E1" fontSize="6">ALM</text>
          </g>
          {/* Heavy Terminals */}
          <rect x="106" y="155" width="24" height="24" rx="4" fill="#DC2626" />
          <text x="118" y="171" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
          <rect x="190" y="155" width="24" height="24" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <text x="202" y="171" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">-</text>
          {/* Breaker switch */}
          <rect x="145" y="160" width="30" height="15" rx="3" fill="#334155" />
          <text x="160" y="170" fill="#F8FAFC" fontSize="6" fontWeight="bold" textAnchor="middle">BMS 125A</text>
        </svg>
      );

    case "panel":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Solar Panel Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Sun Ray Effect */}
          <path d="M250 30L270 50M275 25L290 35M280 60L300 70" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
          {/* Angled Solar Panel Frame */}
          <g transform="rotate(-8 160 120)">
            <rect x="80" y="35" width="160" height="170" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
            {/* Dark Blue Silicon Wafer Backing */}
            <rect x="86" y="41" width="148" height="158" rx="3" fill="#0E2A4A" />
            {/* Solar Cell Grid */}
            <g stroke="#1E4D7B" strokeWidth="1">
              {/* Vertical Busbars */}
              <line x1="123" y1="41" x2="123" y2="199" />
              <line x1="160" y1="41" x2="160" y2="199" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="197" y1="41" x2="197" y2="199" />
              {/* Horizontal Cell Divisions */}
              <line x1="86" y1="67" x2="234" y2="67" />
              <line x1="86" y1="93" x2="234" y2="93" />
              <line x1="86" y1="120" x2="234" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="86" y1="146" x2="234" y2="146" />
              <line x1="86" y1="173" x2="234" y2="173" />
            </g>
            {/* Monocrystalline Diamond Cell Corners */}
            <g fill="#07192C">
              <circle cx="123" cy="67" r="2" />
              <circle cx="160" cy="67" r="2" />
              <circle cx="197" cy="67" r="2" />
              <circle cx="123" cy="93" r="2" />
              <circle cx="160" cy="93" r="2" />
              <circle cx="197" cy="93" r="2" />
              <circle cx="123" cy="146" r="2" />
              <circle cx="160" cy="146" r="2" />
              <circle cx="197" cy="146" r="2" />
              <circle cx="123" cy="173" r="2" />
              <circle cx="160" cy="173" r="2" />
              <circle cx="197" cy="173" r="2" />
            </g>
            {/* Anti-reflective Glass Glare Sheen */}
            <path d="M88 45L220 180H230L98 45H88Z" fill="white" opacity="0.12" />
          </g>
          <rect x="110" y="195" width="100" height="18" rx="4" fill="#1F2A44" opacity="0.9" />
          <text x="160" y="207" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle">
            550W MONO PERC
          </text>
        </svg>
      );

    case "tv":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Smart TV Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* TV Outer Bezel */}
          <rect x="45" y="42" width="230" height="135" rx="5" fill="#0B0F17" stroke="#334155" strokeWidth="2" />
          {/* Active 4K Display Screen */}
          <rect x="49" y="46" width="222" height="127" rx="3" fill="#0F172A" />
          {/* Vibrant Cinema Screen Visual (Gradient Sunset & Mountain) */}
          <defs>
            <linearGradient id="tvScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="40%" stopColor="#4338CA" />
              <stop offset="70%" stopColor="#BE185D" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
          </defs>
          <rect x="49" y="46" width="222" height="127" rx="3" fill="url(#tvScreenGrad)" />
          {/* Mountain Silhouettes */}
          <path d="M49 140L100 95L145 130L200 80L271 145V173H49V140Z" fill="#0F172A" opacity="0.75" />
          <circle cx="195" cy="85" r="14" fill="#FEF08A" opacity="0.9" />
          {/* 4K UHD Badge */}
          <rect x="58" y="55" width="40" height="14" rx="3" fill="#000000" opacity="0.75" />
          <text x="78" y="65" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
            4K HDR
          </text>
          {/* Brand Logo at bottom center bezel */}
          <text x="160" y="176" fill="#94A3B8" fontSize="4.5" fontWeight="bold" textAnchor="middle">
            SMART webOS
          </text>
          {/* TV Stand Legs */}
          <path d="M85 178L70 202H62L80 178H85Z" fill="#475569" />
          <path d="M235 178L250 202H258L240 178H235Z" fill="#475569" />
          <line x1="55" y1="202" x2="265" y2="202" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "audio":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Soundbar and Subwoofer Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Sleek Soundbar Bar */}
          <rect x="40" y="145" width="240" height="26" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          {/* Mesh Grille Texture */}
          <g opacity="0.4" stroke="#64748B" strokeWidth="1">
            <line x1="50" y1="152" x2="270" y2="152" strokeDasharray="2 3" />
            <line x1="50" y1="158" x2="270" y2="158" strokeDasharray="2 3" />
            <line x1="50" y1="164" x2="270" y2="164" strokeDasharray="2 3" />
          </g>
          {/* Center LED status display */}
          <rect x="145" y="152" width="30" height="12" rx="3" fill="#020617" />
          <text x="160" y="161" fill="#38BDF8" fontSize="6" fontWeight="bold" textAnchor="middle">
            ARC · 300W
          </text>
          {/* Wireless Subwoofer Tower */}
          <rect x="75" y="55" width="70" height="85" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          {/* Subwoofer Driver Cone */}
          <circle cx="110" cy="95" r="25" fill="#0F172A" stroke="#475569" strokeWidth="3" />
          <circle cx="110" cy="95" r="14" fill="#334155" />
          <circle cx="110" cy="95" r="6" fill="#0F172A" />
          {/* Bass Reflex Port */}
          <circle cx="110" cy="127" r="5" fill="#020617" stroke="#475569" />
          {/* Dolby Atmos / Bluetooth Badges */}
          <rect x="180" y="80" width="75" height="35" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="217" y="95" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">
            DOLBY AUDIO
          </text>
          <text x="217" y="107" fill="#F5A623" fontSize="6.5" fontWeight="bold" textAnchor="middle">
            BLUETOOTH 5.0
          </text>
        </svg>
      );

    case "fridge":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Refrigerator Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Refrigerator Body */}
          <rect x="105" y="30" width="110" height="180" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* Upper Freezer Door */}
          <rect x="110" y="35" width="100" height="55" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
          <rect x="115" y="70" width="6" height="14" rx="2" fill="#64748B" />
          {/* Digital Dispenser / Temp Display */}
          <rect x="165" y="45" width="35" height="22" rx="3" fill="#1E293B" />
          <text x="182" y="55" fill="#38BDF8" fontSize="6" textAnchor="middle">-18°C</text>
          <text x="182" y="63" fill="#22C55E" fontSize="5" textAnchor="middle">NO FROST</text>
          {/* Lower Fridge Door */}
          <rect x="110" y="95" width="100" height="110" rx="5" fill="#F8FAFC" stroke="#CBD5E1" />
          <rect x="115" y="105" width="6" height="25" rx="2" fill="#64748B" />
          {/* Brand plate */}
          <text x="160" y="115" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">
            HISENSE
          </text>
          {/* Inverter Technology Badge */}
          <rect x="135" y="145" width="50" height="18" rx="4" fill="#0F172A" />
          <text x="160" y="157" fill="#F5A623" fontSize="6" fontWeight="bold" textAnchor="middle">
            INVERTER COMP
          </text>
          <rect x="115" y="210" width="12" height="5" rx="2" fill="#475569" />
          <rect x="193" y="210" width="12" height="5" rx="2" fill="#475569" />
        </svg>
      );

    case "freezer":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Chest Freezer Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Main Freezer Chest Body */}
          <rect x="70" y="70" width="180" height="130" rx="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          {/* Top Lid */}
          <rect x="66" y="55" width="188" height="22" rx="6" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          {/* Handle with Key Lock */}
          <rect x="140" y="68" width="40" height="12" rx="3" fill="#334155" />
          <circle cx="160" cy="74" r="2.5" fill="#F8FAFC" />
          {/* Control Panel at Bottom Right */}
          <rect x="195" y="150" width="45" height="35" rx="4" fill="#0F172A" />
          <circle cx="207" cy="162" r="3" fill="#22C55E" />
          <circle cx="218" cy="162" r="3" fill="#EF4444" />
          <circle cx="229" cy="162" r="3" fill="#F5A623" />
          <text x="217" y="177" fill="#CBD5E1" fontSize="5" fontWeight="bold" textAnchor="middle">FAST FREEZE</text>
          {/* 100 Hours Cold Retention Badge */}
          <rect x="90" y="105" width="85" height="24" rx="5" fill="#1E293B" />
          <text x="132" y="117" fill="#38BDF8" fontSize="7" fontWeight="bold" textAnchor="middle">100-HOUR COOLING</text>
          <text x="132" y="125" fill="#94A3B8" fontSize="5.5" textAnchor="middle">POWER-CUT RETENTION</text>
          {/* Feet */}
          <rect x="85" y="200" width="16" height="6" rx="2" fill="#475569" />
          <rect x="219" y="200" width="16" height="6" rx="2" fill="#475569" />
        </svg>
      );

    case "microwave":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Microwave Oven Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Microwave Cabinet */}
          <rect x="65" y="60" width="190" height="120" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          {/* Mirror Door Glass */}
          <rect x="75" y="70" width="125" height="100" rx="5" fill="#0A0F1D" stroke="#334155" strokeWidth="1" />
          {/* Door Mesh Screen Inside */}
          <rect x="85" y="80" width="105" height="80" rx="3" fill="#111827" />
          <circle cx="137" cy="120" r="22" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          <rect x="70" y="90" width="6" height="60" rx="3" fill="#64748B" />
          {/* Control Panel on Right */}
          <rect x="205" y="70" width="42" height="100" rx="4" fill="#0F172A" />
          {/* Digital Timer Clock */}
          <rect x="210" y="75" width="32" height="16" rx="3" fill="#020617" />
          <text x="226" y="86" fill="#22C55E" fontSize="8" fontWeight="bold" textAnchor="middle">12:30</text>
          {/* Buttons */}
          <circle cx="218" cy="102" r="4" fill="#334155" />
          <circle cx="234" cy="102" r="4" fill="#334155" />
          <circle cx="218" cy="115" r="4" fill="#334155" />
          <circle cx="234" cy="115" r="4" fill="#334155" />
          {/* Rotary Dial */}
          <circle cx="226" cy="138" r="10" fill="#475569" stroke="#94A3B8" />
          <circle cx="226" cy="138" r="3" fill="#0F172A" />
          {/* Start / Stop */}
          <rect x="211" y="154" width="30" height="10" rx="2" fill="#16A34A" />
          <text x="226" y="161" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">START</text>
        </svg>
      );

    case "blender":
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Blender Illustration"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Glass Jar */}
          <path d="M130 50L138 140H182L190 50H130Z" fill="#F0FDF4" stroke="#94A3B8" strokeWidth="2" opacity="0.9" />
          {/* Jar Lid with Cap */}
          <rect x="125" y="44" width="70" height="10" rx="3" fill="#1E293B" />
          <rect x="150" y="38" width="20" height="8" rx="2" fill="#F5A623" />
          {/* Measurement marks on jar */}
          <line x1="145" y1="70" x2="155" y2="70" stroke="#64748B" strokeWidth="1.5" />
          <line x1="145" y1="85" x2="155" y2="85" stroke="#64748B" strokeWidth="1.5" />
          <line x1="145" y1="100" x2="155" y2="100" stroke="#64748B" strokeWidth="1.5" />
          <line x1="145" y1="115" x2="155" y2="115" stroke="#64748B" strokeWidth="1.5" />
          {/* Stainless steel blade inside */}
          <path d="M152 135L160 128L168 135L160 132L152 135Z" fill="#334155" />
          {/* Jar Handle */}
          <path d="M190 65C205 65 205 120 183 120" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Motor Base */}
          <path d="M135 140L125 195H195L185 140H135Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <rect x="130" y="195" width="60" height="6" rx="2" fill="#1E293B" />
          {/* Speed Rotary Knob */}
          <circle cx="160" cy="168" r="10" fill="#0F172A" stroke="#F5A623" strokeWidth="1.5" />
          <line x1="160" y1="168" x2="160" y2="161" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
          <text x="160" y="185" fill="#334155" fontSize="5" fontWeight="bold" textAnchor="middle">0 - 1 - 2 - PULSE</text>
        </svg>
      );

    case "accessories":
    default:
      return (
        <svg
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          role="img"
          aria-label={alt || "Power Protection and Accessories"}
        >
          <rect width="320" height="240" rx="16" fill="#F0F4F8" />
          <circle cx="160" cy="120" r="90" fill="#E2EBF4" opacity="0.6" />
          {/* Automatic Voltage Switcher Chassis */}
          <rect x="105" y="45" width="110" height="150" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          {/* Header plate */}
          <rect x="115" y="55" width="90" height="24" rx="4" fill="#0F172A" />
          <text x="160" y="68" fill="#F5A623" fontSize="8" fontWeight="bold" textAnchor="middle">
            SOLLATEK AVS30
          </text>
          <text x="160" y="75" fill="#94A3B8" fontSize="5.5" textAnchor="middle">
            AUTOMATIC VOLTAGE SWITCHER
          </text>
          {/* 3 Status Traffic Light LEDs */}
          <g>
            <circle cx="130" cy="95" r="7" fill="#DC2626" />
            <text x="130" y="112" fill="#DC2626" fontSize="5" fontWeight="bold" textAnchor="middle">BAD</text>
            <circle cx="160" cy="95" r="7" fill="#F5A623" />
            <text x="160" y="112" fill="#D97706" fontSize="5" fontWeight="bold" textAnchor="middle">WAIT</text>
            <circle cx="190" cy="95" r="7" fill="#16A34A" />
            <text x="190" y="112" fill="#16A34A" fontSize="5" fontWeight="bold" textAnchor="middle">GOOD</text>
          </g>
          {/* Rating label */}
          <rect x="125" y="125" width="70" height="22" rx="4" fill="#F1F5F9" stroke="#CBD5E1" />
          <text x="160" y="137" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">30 AMPS</text>
          <text x="160" y="144" fill="#64748B" fontSize="5" textAnchor="middle">230V · 50/60Hz</text>
          {/* Heavy Cable Glands */}
          <rect x="125" y="195" width="20" height="12" rx="3" fill="#334155" />
          <rect x="175" y="195" width="20" height="12" rx="3" fill="#334155" />
        </svg>
      );
  }
}

