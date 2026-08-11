interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
});

export function CameraIcon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3.5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 17.5V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12 2.8 4.8 5.6v6.1c0 4.4 2.9 8.3 7.2 9.5 4.3-1.2 7.2-5.1 7.2-9.5V5.6L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SensorIcon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="13.5" r="5.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10.1" cy="12.6" r="0.95" fill="currentColor" />
      <circle cx="13.9" cy="12.6" r="0.95" fill="currentColor" />
      <path d="M4.4 7.4A10.6 10.6 0 0 1 12 4.2c2.9 0 5.6 1.2 7.6 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.4 4.4A14.6 14.6 0 0 1 12 1.8c1.6 0 3.2.3 4.6.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}

export function GridIcon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      {[5, 9.5, 14, 18.5].map((y) =>
        [5, 9.5, 14, 18.5].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" fill="currentColor" />),
      )}
    </svg>
  );
}

export function ChevronIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 14 8" fill="none" aria-hidden className={className}>
      <path d="M1 1.5 7 6.5l6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MinusIcon() {
  return (
    <svg width="11" height="2" viewBox="0 0 11 2" fill="none" aria-hidden>
      <path d="M1 1h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
      <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export const STEP_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  camera: CameraIcon,
  shield: ShieldIcon,
  sensor: SensorIcon,
  grid: GridIcon,
};
