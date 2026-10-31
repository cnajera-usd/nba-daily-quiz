export default function BallIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <clipPath id="ballClip">
          <circle cx="20" cy="20" r="18" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="18" fill="var(--accent)" />
      <g clipPath="url(#ballClip)" fill="none" stroke="#12161f" strokeWidth="2.2">
        <path d="M20 0V40M0 20H40" />
        <circle cx="-5.5" cy="20" r="16.6" />
        <circle cx="45.5" cy="20" r="16.6" />
      </g>
      <circle cx="20" cy="20" r="18" fill="none" stroke="#12161f" strokeWidth="1.8" />
    </svg>
  )
}