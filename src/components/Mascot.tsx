/** A replaceable, deliberately simplified IPP mascot study; not a traced official illustration.
 * Intrinsic SVG colors never inherit the user's light/dark or seed palette. */
export function Mascot({ className = '' }: { className?: string }) {
  return <svg className={`mascot ${className}`} viewBox="0 0 240 216" fill="none" aria-hidden="true" focusable="false">
    <g stroke="#514c70" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round">
      <path className="mascot-tail" d="M182 170c51-31 54 31 29 26-16-3-8-21 1-12" stroke="#8c88b1" strokeWidth="13" />
      <path d="M46 100C34 32 73 17 123 28c54-16 84 37 71 96l10 29-27 10H58l-24-15z" fill="#9692b9" />
      <g className="mascot-ear ear-left"><path d="M48 77 36 16Q64 18 85 46" fill="#a5a1c8" /><path d="m48 56-4-27 23 20" fill="#efe4dc" strokeWidth="2" /></g>
      <g className="mascot-ear ear-right"><path d="m151 45 41-29q14 23 3 64" fill="#a5a1c8" /><path d="m169 47 19-18 1 30" fill="#efe4dc" strokeWidth="2" /></g>
      <path d="M101 35Q83 5 112 9q20 4 12 24" fill="#a5a1c8" />
      <path d="M72 142q-9 7-15 23l-9 43h145l-10-45-20-23" fill="#fff0cf" />
      <path d="m98 144 21 18 23-18 15 20-36 28-37-26z" fill="#dfcced" />
      <path d="m99 142 20 21-16 17-19-27m56-11-21 21 18 16 20-26" fill="#fffbef" />
      <path d="M59 89c0-27 124-27 124 0v29c-4 30-32 43-61 43-32 0-60-15-63-43z" fill="#fff0e4" />
      <path d="M54 100q-6-50 38-64c34-9 64-3 86 22l12 45-24-21q-8 1-27-17 1 19-16 24-23-4-34-27-5 26-35 38" fill="#a5a1c8" />
      <path d="M101 39q4 24 30 22-3-14-13-22" fill="#79759f" stroke="none" />
      <path d="M54 89q-16 28-12 57-13 8-10 13 17 13 35-2-6-17 1-37" fill="#9692b9" />
      <path d="M184 87q18 28 11 58 15 13 5 19-20 6-30-10 12-21 2-41" fill="#9692b9" />
      <path d="m175 99 16-4m-16 12 17-4m-16 12 14-3" stroke="#625c84" strokeWidth="2" />
      <g className="mascot-eyes" strokeWidth="2">
        <path d="M76 104q14-12 26 0v21q-13 10-26 0z" fill="#534e74" />
        <path d="M138 104q14-12 26 0v21q-13 10-26 0z" fill="#534e74" />
        <path d="M79 117h20v7q-9 8-20 0zm62 0h20v7q-9 8-20 0z" fill="#8cc8e0" stroke="none" />
        <ellipse cx="85" cy="107" rx="5" ry="6" fill="#fff" stroke="none" /><ellipse cx="147" cy="107" rx="5" ry="6" fill="#fff" stroke="none" />
        <circle cx="96" cy="121" r="2.5" fill="#fff" stroke="none" /><circle cx="158" cy="121" r="2.5" fill="#fff" stroke="none" />
        <path d="m76 104-4-3m92 3 4-3" />
      </g>
      <ellipse cx="72" cy="133" rx="9" ry="4" fill="#efbfc2" stroke="none" /><ellipse cx="168" cy="133" rx="9" ry="4" fill="#efbfc2" stroke="none" />
      <path d="M115 139q6 7 12-1" strokeWidth="2" />
      <g className="mascot-bell"><circle cx="120" cy="180" r="12" fill="#e8ba59" stroke="#9b742f" strokeWidth="2" /><path d="M110 178h20m-10 3v8" stroke="#9b742f" strokeWidth="2" /><circle cx="117" cy="174" r="3" fill="#fff0b6" stroke="none" /></g>
      <g fill="#fff0e4"><path d="M48 208v-9c-1-12 25-12 26 0v9m89 0v-9c-1-12 25-12 26 0v9" /><path d="M57 201v6m8-6v6m107-6v6m8-6v6" strokeWidth="1.6" /></g>
    </g>
  </svg>;
}
export function CatSignature({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 104 68" className={`cat-signature ${className}`} fill="none" aria-hidden="true" focusable="false"><path d="M15 50V13l23 14q14-7 28 0l23-14v37q-35 20-74 0Z" fill="#c4bfdd" stroke="#655c8b" strokeWidth="3" strokeLinejoin="round" /><path d="M34 40v12m-6-6h12m23-6v12m-6-6h12" stroke="#655c8b" strokeWidth="3" strokeLinecap="round" /><path d="m48 54 4 3 4-3" stroke="#655c8b" strokeWidth="2" strokeLinecap="round" /></svg>;
}
export function PawMark({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 40 40" className={`paw-mark ${className}`} fill="currentColor" aria-hidden="true" focusable="false"><ellipse cx="9" cy="15" rx="4" ry="5" transform="rotate(-28 9 15)" /><ellipse cx="17" cy="9" rx="4" ry="5" /><ellipse cx="27" cy="10" rx="4" ry="5" transform="rotate(15 27 10)" /><ellipse cx="33" cy="18" rx="4" ry="5" transform="rotate(30 33 18)" /><path d="M9 29c0-5 7-14 12-14s13 10 13 15c0 8-10 2-13 2s-12 5-12-3Z" /></svg>;
}
