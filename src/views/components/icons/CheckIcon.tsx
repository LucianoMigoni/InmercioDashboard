interface CheckIconProps {
  size?: number;
  className?: string;
}

// Icono de tilde
export function CheckIcon({ size = 24, className = "" }: CheckIconProps) {
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
        <path d="M3775 3635 c-22 -8 -42 -15 -45 -15 -2 0 -372 -368 -822 -817 l-818 -818 -352 351 c-366 364 -379 374 -458 374 -149 0 -255 -170 -190 -304 13 -27 168 -189 457 -477 457 -455 463 -459 544 -459 85 0 56 -27 1012 928 645 645 914 919 928 950 31 62 23 147 -17 205 -54 77 -158 113 -239 82z" />
      </g>
    </svg>
  );
}
