export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EEFFA8" />
          <stop offset="0.5" stopColor="#D4FF3F" />
          <stop offset="1" stopColor="#94C300" />
        </linearGradient>
        <linearGradient id="logoSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>
      <rect x="3" y="3" width="34" height="34" rx="10" fill="url(#logoGrad)" filter="url(#logoShadow)" />
      <path d="M4 12 C4 7.58 7.58 4 12 4 H28 C32.42 4 36 7.58 36 12 V16 H4 V12Z" fill="url(#logoSheen)" />
      <rect x="3.5" y="3.5" width="33" height="33" rx="9.5" stroke="#0D0D0B" strokeOpacity="0.06" />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight={700}
        fontSize="20"
        fill="#0D0D0B"
      >
        2
      </text>
    </svg>
  );
}
