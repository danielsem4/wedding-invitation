import type { CSSProperties } from "react";

/**
 * A subtle embossed rose-damask, drawn tone-on-tone as fine line-art and
 * repeated as an SVG <pattern>. Each motif is stamped twice — a light copy
 * nudged up-left and a dark copy nudged down-right — so it reads as a faint
 * raised relief pressed into the ivory paper (like the reference envelope).
 *
 * Authored so the pattern's coordinate origin is the SVG's (0,0): render this
 * at the same origin inside each envelope surface (back wall, front flaps,
 * top flap) and the tiles line up seamlessly across the folds.
 */
export function EmbossedFloral({
  width,
  height,
  id,
  opacity = 0.32,
  className = "",
  style,
}: {
  width: number;
  height: number;
  // Unique per instance — SVG <pattern> ids are document-global.
  id: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const patternId = `floral-${id}`;
  const dark = "rgba(34,58,107,0.5)";
  const light = "rgba(255,251,242,0.85)";

  // One motif (a rose + a leaf sprig + a bud) drawn in stroke `col`, offset by
  // (dx,dy). Called twice per tile for the pressed light/dark relief.
  const motif = (col: string, dx: number, dy: number, key: string) => (
    <g
      key={key}
      transform={`translate(${dx} ${dy})`}
      stroke={col}
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* rose — upper-left of the tile */}
      <g transform="translate(30 30)">
        <path d="M0 -11 C 7 -13 12 -6 9 0 C 14 3 12 11 4 11 C 2 15 -6 14 -8 7 C -14 5 -13 -3 -6 -5 C -8 -12 -2 -14 0 -11 Z" />
        <path d="M-5 -1 C -3 -6 4 -6 6 0 C 7 4 3 8 -1 7" />
        <path d="M-2 4 C -4 2 -3 -2 0 -2 C 2 -2 3 1 1 3" />
      </g>
      {/* leaf sprig — lower-right, bridging toward the next tile's rose */}
      <g transform="translate(84 78)">
        <path d="M-18 -14 C -8 -8 4 0 14 12" strokeWidth="0.8" />
        {[
          { x: -8, y: -6, r: 34 },
          { x: 0, y: 1, r: 34 },
          { x: -12, y: -1, r: -34 },
          { x: -3, y: 7, r: -34 },
        ].map((l, i) => (
          <ellipse
            key={i}
            cx={l.x}
            cy={l.y}
            rx="7"
            ry="2.6"
            transform={`rotate(${l.r} ${l.x} ${l.y})`}
          />
        ))}
      </g>
      {/* a small bud, upper-right */}
      <g transform="translate(98 22)">
        <path d="M0 6 C -4 6 -5 1 -3 -2 C -1 -5 3 -4 4 -1 C 5 2 3 5 0 6 Z" />
        <path d="M0 6 C 0 11 0 14 0 18" strokeWidth="0.7" />
      </g>
    </g>
  );

  return (
    <svg
      className={className}
      style={style}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      opacity={opacity}
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="120"
          height="104"
        >
          {motif(dark, 0.6, 0.7, "d")}
          {motif(light, -0.6, -0.7, "l")}
        </pattern>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}

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
 * A tiny laurel-style sprig accent — a short curved stem with a few small
 * leaves and a single blossom bud. Drawn pointing LEFT (stem tip toward the
 * right, where the text sits); mirror it with `-scale-x-100` for the other
 * side. Kept deliberately minimal so it flanks text without crowding it.
 */
export function SprigAccent({
  className = "",
  style,
  color = "var(--gold)",
  leafColor = "var(--gold-soft)",
  size = 34,
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
      height={size * 0.5}
      viewBox="0 0 80 40"
      fill="none"
      aria-hidden="true"
    >
      {/* gently arcing stem */}
      <path
        d="M6 20 C 26 20, 46 20, 70 20"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* paired leaves along the stem */}
      {[
        { cx: 26, cy: 20, rot: -24 },
        { cx: 26, cy: 20, rot: 24 },
        { cx: 44, cy: 20, rot: -22 },
        { cx: 44, cy: 20, rot: 22 },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy - 6}
          rx="7"
          ry="2.6"
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
          stroke={leafColor}
          strokeWidth="1"
          fill="none"
          opacity="0.75"
        />
      ))}
      {/* small blossom bud at the outer tip */}
      <circle cx="6" cy="20" r="2.4" fill={color} opacity="0.85" />
    </svg>
  );
}

/**
 * A small botanical corner ornament for framing the card. Drawn for the
 * TOP-LEFT corner by default; mirror it into the other corners with
 * `-scale-x-100` / `-scale-y-100` on the className.
 */
export function CornerFlourish({
  className = "",
  style,
  color = "var(--gold)",
  leafColor = "var(--sage)",
  size = 74,
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
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      {/* sweeping scroll that hugs the corner */}
      <path
        d="M6 6 C 6 40, 20 58, 52 62 M6 6 C 40 6, 58 20, 62 52"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* inner echo line for a layered, engraved feel */}
      <path
        d="M6 18 C 8 34, 18 46, 40 50 M18 6 C 34 8, 46 18, 50 40"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* leaves along the scroll tips */}
      {[
        { cx: 52, cy: 62, r: 9, rot: 20 },
        { cx: 62, cy: 52, r: 9, rot: -70 },
        { cx: 40, cy: 50, r: 7, rot: 45 },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.r}
          ry={l.r * 0.42}
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
          stroke={leafColor}
          strokeWidth="1.1"
          fill="none"
          opacity="0.75"
        />
      ))}
      {/* a single blossom accent at the corner */}
      <g transform="translate(9 9) scale(0.7)">
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
    </svg>
  );
}

/**
 * A minimal monogram mark: the couple's initials in the display face over a
 * single small leaf sprig — echoing the reference's delicate branch-and-letters
 * logo. Understated, sitting at the top-center of the card.
 */
export function Crest({
  monogram,
  className = "",
  size = 96,
}: {
  monogram: string;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      style={{ width: size }}
      aria-hidden="true"
    >
      {/* the monogram initials, set in the swash display face */}
      <span className="font-display text-[1.7rem] font-medium italic leading-none tracking-[0.04em] text-gold">
        {monogram.replace(/&/g, " & ")}
      </span>
      {/* a single delicate leaf sprig beneath the initials */}
      <svg
        width={size * 0.62}
        height={size * 0.24}
        viewBox="0 0 80 30"
        fill="none"
        className="mt-1.5"
      >
        {/* central stem */}
        <path
          d="M40 4 C 40 12, 40 18, 40 26"
          stroke="var(--gold)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* paired leaves fanning from the stem */}
        {[
          { y: 10, spread: 15, rot: 32 },
          { y: 16, spread: 12, rot: 30 },
          { y: 21, spread: 8, rot: 26 },
        ].map((r, i) =>
          [-1, 1].map((s) => (
            <ellipse
              key={`${i}-${s}`}
              cx={40 + s * r.spread * 0.5}
              cy={r.y}
              rx="8"
              ry="2.4"
              transform={`rotate(${s * r.rot} ${40 + s * r.spread * 0.5} ${r.y})`}
              stroke="var(--gold-soft)"
              strokeWidth="0.9"
              fill="none"
              opacity="0.8"
            />
          )),
        )}
      </svg>
    </div>
  );
}

/* ── Sculptural ceramic petals ──────────────────────────────────────────────
   A stylized approximation of the reference's cream ceramic petal reliefs:
   overlapping almond petals fanning out of a corner, each face-lit by a shared
   diagonal gradient and lifted by a soft drop-shadow so they read as raised. */

// Round trig coords to a fixed precision so SSR and client strings match
// byte-for-byte (avoids React hydration attribute mismatches).
const r2 = (n: number) => Math.round(n * 100) / 100;

// One almond petal emanating from the origin (0,0) along `deg`, `len` long and
// `wid` wide at its waist — returned as an SVG path string.
function petalPath(deg: number, len: number, wid: number) {
  const t = (deg * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  // rotate a point given in petal-local space (along +x) into cluster space
  const R = (x: number, y: number) =>
    `${r2(x * cos - y * sin)} ${r2(x * sin + y * cos)}`;
  return `M ${R(0, 0)} Q ${R(len * 0.5, -wid)} ${R(len, 0)} Q ${R(len * 0.5, wid)} ${R(0, 0)} Z`;
}

/**
 * A single fan of raised ceramic petals, growing from the top-left corner of
 * its box toward the lower-right. Place / mirror it with the wrapper.
 */
export function CeramicPetalCluster({
  size = 260,
  className = "",
  style,
  id = "a",
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
  // Unique suffix so the gradient/filter ids don't collide when two clusters
  // render in the same document (SVG ids are document-global).
  id?: string;
}) {
  const faceId = `petalFace-${id}`;
  const liftId = `petalLift-${id}`;
  // Two nested arcs: a longer back row and a shorter front row, each a few
  // petals fanning across the corner quadrant (angles measured from +x).
  const back = [
    { deg: 12, len: 150, wid: 34 },
    { deg: 34, len: 168, wid: 38 },
    { deg: 56, len: 168, wid: 38 },
    { deg: 78, len: 150, wid: 34 },
  ];
  const front = [
    { deg: 26, len: 104, wid: 28 },
    { deg: 45, len: 116, wid: 30 },
    { deg: 64, len: 104, wid: 28 },
  ];

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
      <defs>
        {/* diagonal face light — highlight toward the corner, shade at the tips */}
        <linearGradient
          id={faceId}
          x1="0"
          y1="0"
          x2="200"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f5f5f1" />
          <stop offset="52%" stopColor="#e4e6e1" />
          <stop offset="100%" stopColor="#cdd2dd" />
        </linearGradient>
        {/* soft lift so each petal casts a gentle shadow on the ones behind */}
        <filter id={liftId} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="1.5"
            dy="2.5"
            stdDeviation="3.2"
            floodColor="rgba(40,55,95,0.25)"
          />
        </filter>
      </defs>

      {/* petals anchored just off the top-left corner; back row first so the
          front row overlaps and shadows it */}
      <g transform="translate(-6 -6)" filter={`url(#${liftId})`}>
        {[...back, ...front].map((p, i) => (
          <path
            key={i}
            d={petalPath(p.deg, p.len, p.wid)}
            fill={`url(#${faceId})`}
            stroke="rgba(44,60,110,0.30)"
            strokeWidth="0.8"
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * The reference's two-corner arrangement: a ceramic petal fan in the top-left
 * and a mirrored one in the bottom-right, framing the scene on the diagonal.
 * Softened / shrunk on phones so they frame the invitation without crowding.
 */
export function CeramicPetals() {
  const corner =
    "absolute scale-[0.55] opacity-90 sm:scale-100 sm:opacity-100";
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <span className={`${corner} left-0 top-0 origin-top-left`}>
        <CeramicPetalCluster size={300} id="tl" />
      </span>
      <span className={`${corner} bottom-0 right-0 origin-bottom-right`}>
        <CeramicPetalCluster size={300} id="br" className="-scale-100" />
      </span>
    </div>
  );
}
