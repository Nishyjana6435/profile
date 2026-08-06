// Dummy placeholder mark — swap for the real logo asset later.
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path d="M17 3 C10 7, 10 10, 17 12 C10 14, 10 17, 17 21" strokeLinecap="round" />
    </svg>
  );
}
