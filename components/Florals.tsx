import type { CSSProperties } from "react";

/**
 * Delicate line-art floral sprig (SVG). Reusable — position it with the
 * `className` / `style` props and recolor with `color` / `leafColor`.
 */
export function FloralSprig({
  className = "",
  style,
  color = "var(--gold)",
  leafColor = "var(--sage)",
  size = 180,
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
  leafColor?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      {/* main stem */}
      <path
        d="M40 170 C 70 130, 95 110, 120 70 C 135 46, 150 30, 165 20"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* small branches */}
      <path
        d="M92 96 C 108 92, 122 96, 134 108"
        stroke={leafColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M112 76 C 96 68, 84 66, 70 70"
        stroke={leafColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* leaves */}
      {[
        { cx: 70, cy: 70, r: 9, rot: -30 },
        { cx: 134, cy: 108, r: 9, rot: 30 },
        { cx: 60, cy: 118, r: 8, rot: -55 },
        { cx: 150, cy: 82, r: 8, rot: 20 },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.r}
          ry={l.r * 0.45}
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
          stroke={leafColor}
          strokeWidth="1.1"
          fill="none"
          opacity="0.7"
        />
      ))}

      {/* blossoms — five-petal outlines */}
      {[
        { cx: 160, cy: 26, s: 1 },
        { cx: 122, cy: 66, s: 0.8 },
        { cx: 88, cy: 100, s: 0.65 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.cx} ${b.cy}) scale(${b.s})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-9"
              rx="5"
              ry="9"
              transform={`rotate(${a})`}
              stroke={color}
              strokeWidth="1.2"
              fill="var(--paper)"
              opacity="0.95"
            />
          ))}
          <circle cx="0" cy="0" r="3" fill={color} opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Four florals arranged in the page corners, framing the scene.
 */
export function CornerFlorals() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <FloralSprig
        className="absolute -left-6 -top-6 opacity-80 sm:left-2 sm:top-2"
        size={200}
      />
      <FloralSprig
        className="absolute -right-6 -top-6 -scale-x-100 opacity-80 sm:right-2 sm:top-2"
        size={200}
      />
      <FloralSprig
        className="absolute -bottom-6 -left-6 -scale-y-100 opacity-70 sm:bottom-2 sm:left-2"
        size={180}
      />
      <FloralSprig
        className="absolute -bottom-6 -right-6 -scale-100 opacity-70 sm:bottom-2 sm:right-2"
        size={180}
      />
    </div>
  );
}
