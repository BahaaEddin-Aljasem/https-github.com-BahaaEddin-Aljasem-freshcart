export function GroceryCartIllustration() {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-labelledby="grocery-cart-title grocery-cart-description"
      className="block aspect-[1.6] w-full rounded-2xl bg-white"
    >
      <title id="grocery-cart-title">Fresh groceries in a shopping cart</title>
      <desc id="grocery-cart-description">A shopping cart filled with colorful vegetables and fruit.</desc>
      <defs>
        <filter id="cart-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0f172a" floodOpacity=".12" />
        </filter>
        <linearGradient id="carrot-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#f45132" />
        </linearGradient>
      </defs>
      <rect x="14" y="12" width="452" height="276" rx="18" fill="#fff" filter="url(#cart-shadow)" />
      <rect x="372" y="42" width="74" height="198" rx="8" fill="#fff0e8" />
      <path d="M383 88c-17-20-10-37 5-44 4 17 2 28-5 44Zm17 4c-4-25 8-39 24-37-2 17-11 30-24 37Zm-17 26c-18-9-24-25-14-38 13 11 19 24 14 38Z" fill="#a6d68d" opacity=".8" />
      <path d="M376 219c15-19 31-20 42-10 10-19 19-16 29-8v39h-71Z" fill="#f3b4ac" opacity=".65" />

      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="m105 92-31 1" stroke="#ff7056" strokeWidth="9" />
        <path d="m75 93-13-3" stroke="#ff7056" strokeWidth="8" />

        <path d="M134 107c-19-20-13-40 1-50 13 13 15 31-1 50Zm19-9c-9-25-1-42 16-48 8 19 1 36-16 48Zm20 2c1-26 13-38 31-36 1 20-10 32-31 36Z" fill="#55af4a" stroke="#55af4a" strokeWidth="3" />
        <path d="M139 113c-23-15-22-35-9-47 15 13 20 29 9 47Zm37 0c-6-25 5-41 22-44 6 19-1 34-22 44Z" fill="#7fc34f" stroke="#7fc34f" strokeWidth="3" />

        <path d="M123 132c-17-20-8-43 8-48 12 13 10 34-8 48Z" fill="#f5a623" stroke="#ef9a1f" strokeWidth="2" />
        <path d="M127 115c5-7 7-14 8-22" fill="none" stroke="#ffd35b" strokeWidth="3" />
        <path d="M109 135c-14-22-4-39 13-43 10 15 6 32-13 43Z" fill="#ef4b3b" stroke="#e44135" strokeWidth="2" />
        <path d="M108 103c7-8 15-10 22-7" fill="none" stroke="#69ad46" strokeWidth="4" />

        <path d="M169 119c-2-22 14-35 30-29 12 17 4 35-13 41Z" fill="#8bc34a" stroke="#73b43e" strokeWidth="2" />
        <path d="M171 116c-15-15-12-30 2-37 12 12 12 25-2 37Z" fill="#55a947" stroke="#4b9f40" strokeWidth="2" />
        <circle cx="205" cy="127" r="22" fill="#f34b3f" />
        <path d="M199 107c1-7 6-10 11-11m-7 13c-8-8-15-8-18-3 6 6 11 7 18 3Z" fill="#53a84a" stroke="#53a84a" strokeWidth="3" />

        <path d="M227 126c-9-19 1-34 17-35 15 14 10 31-7 39Z" fill="#f6c847" stroke="#efbb37" strokeWidth="2" />
        <path d="M239 123c-3-15-1-23 5-31" fill="none" stroke="#fff0a7" strokeWidth="3" />
        <circle cx="270" cy="122" r="24" fill="#f0443b" />
        <path d="M266 99c0-7 5-12 11-12m-7 13c-8-8-16-8-20-3 6 6 14 8 20 3Z" fill="#4a9d42" stroke="#4a9d42" strokeWidth="3" />
        <path d="M286 119c-5-20 7-34 23-33 11 17 4 33-14 39Z" fill="#ff9d22" stroke="#f18d1d" strokeWidth="2" />
        <path d="M292 118c2-9 5-17 11-24" fill="none" stroke="#ffd068" strokeWidth="3" />
        <path d="M311 122c-2-20 11-32 26-28 9 18 1 32-16 36Z" fill="#5caf47" stroke="#4c9f3f" strokeWidth="2" />
        <path d="M316 115c-10-12-6-24 5-29 10 10 10 20-5 29Z" fill="#7fbe4a" stroke="#72b141" strokeWidth="2" />

        <path d="m138 129 256 20-17 69-220-17Z" fill="#fff" stroke="#b8c9d4" strokeWidth="4" />
        <path d="m153 136 15 62m29-59 8 62m30-60 2 64m31-61-5 63m33-60-11 62m39-60-17 62m46-59-23 61" fill="none" stroke="#cfdae0" strokeWidth="3" />
        <path d="m140 150 245 19m-237 12 230 18" fill="none" stroke="#cfdae0" strokeWidth="3" />
        <path d="m151 201 22 47 142 6m-143-7-28 31m170-25 29 25" fill="none" stroke="#b8c9d4" strokeWidth="5" />
        <path d="m373 218 13 22h-66" fill="none" stroke="#b8c9d4" strokeWidth="5" />
        <circle cx="170" cy="270" r="9" fill="#fff" stroke="#b8c9d4" strokeWidth="5" />
        <circle cx="330" cy="270" r="9" fill="#fff" stroke="#b8c9d4" strokeWidth="5" />
      </g>
    </svg>
  );
}
