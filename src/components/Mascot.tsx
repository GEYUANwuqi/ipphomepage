/** Small brand motifs only; the character illustration is intentionally deferred. */
export function CatSignature({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 104 68" className={`cat-signature ${className}`} fill="none" aria-hidden="true" focusable="false"><path d="M15 50V13l23 14q14-7 28 0l23-14v37q-35 20-74 0Z" fill="#c4bfdd" stroke="#655c8b" strokeWidth="3" strokeLinejoin="round" /><path d="M34 40v12m-6-6h12m23-6v12m-6-6h12" stroke="#655c8b" strokeWidth="3" strokeLinecap="round" /><path d="m48 54 4 3 4-3" stroke="#655c8b" strokeWidth="2" strokeLinecap="round" /></svg>;
}
export function PawMark({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 40 40" className={`paw-mark ${className}`} fill="currentColor" aria-hidden="true" focusable="false"><ellipse cx="9" cy="15" rx="4" ry="5" transform="rotate(-28 9 15)" /><ellipse cx="17" cy="9" rx="4" ry="5" /><ellipse cx="27" cy="10" rx="4" ry="5" transform="rotate(15 27 10)" /><ellipse cx="33" cy="18" rx="4" ry="5" transform="rotate(30 33 18)" /><path d="M9 29c0-5 7-14 12-14s13 10 13 15c0 8-10 2-13 2s-12 5-12-3Z" /></svg>;
}
