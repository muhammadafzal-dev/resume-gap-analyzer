export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ResumeGap"
    >
      <rect width="32" height="32" rx="7" fill="#0f172a" />
      <rect x="6" y="5" width="14" height="18" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="9" y="9"  width="8" height="1.5" rx="0.75" fill="#3b82f6" />
      <rect x="9" y="12" width="6" height="1.5" rx="0.75" fill="#475569" />
      <rect x="9" y="15" width="7" height="1.5" rx="0.75" fill="#475569" />
      <rect x="9" y="18" width="4" height="1.5" rx="0.75" fill="#f87171" />
      <circle cx="22" cy="23" r="4.5" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <line x1="25.2" y1="26.2" x2="27.5" y2="28.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
