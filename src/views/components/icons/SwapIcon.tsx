interface SwapIconProps {
  size?: number;
  className?: string;
}

// Icono de intercambio
export function SwapIcon({ size = 24, className = "" }: SwapIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
    >
      <g transform="translate(0,512) scale(0.1,-0.1)" fill="currentColor" stroke="none">
        <path d="M3528 4670 c-86 -46 -130 -146 -108 -242 12 -51 23 -64 278 -320 l266 -268 -1682 0 c-1499 0 -1687 -2 -1720 -16 -79 -33 -132 -110 -132 -194 0 -88 38 -152 115 -193 l40 -22 1686 -5 1686 -5 -258 -240 c-158 -146 -265 -253 -275 -274 -70 -147 35 -312 197 -311 80 1 107 24 567 483 289 289 449 456 462 483 14 29 20 61 20 114 l0 74 -462 464 c-283 283 -476 469 -497 478 -48 20 -138 17 -183 -6z" />
        <path d="M1405 2541 c-26 -12 -198 -177 -496 -477 -419 -421 -457 -462 -463 -499 -10 -70 -7 -115 13 -153 29 -55 907 -928 953 -947 143 -59 298 48 298 205 -1 81 -17 99 -495 553 l-60 57 1683 0 c1845 0 1720 -4 1786 58 81 76 88 220 13 300 -12 13 -40 34 -62 45 l-40 22 -1690 3 -1689 2 266 268 c262 263 266 268 278 322 15 67 3 118 -39 177 -53 74 -174 104 -256 64z" />
      </g>
    </svg>
  );
}
