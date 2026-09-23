import type { CSSProperties } from "react";

// Round trig-derived coordinates to a fixed precision so the SSR string and the
// client string are byte-identical (avoids React hydration attribute mismatches
// from full-precision floats serializing differently on server vs. browser).
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Toile-de-Jouy style engraved pastoral landscape, drawn in fine taupe
 * line-art on nothing (transparent) so it can sit over ivory paper.
 *
 * IMPORTANT: it is authored in the envelope's own coordinate space
 * (viewBox 0 0 404 252 = W×H). Rendering the SAME component into each
 * envelope surface (flap, back wall, pocket) and nudging it vertically with
 * `top` lets the scene line up seamlessly across the fold — the flap shows
 * the hills + villa, the pocket shows the foreground ruins + tree, and the
 * belly band bridges them.
 */
export function ToileLandscape({
  width,
  height,
  style,
  className = "",
  color = "var(--toile)",
  soft = "var(--toile-soft)",
}: {
  width: number;
  height: number;
  style?: CSSProperties;
  className?: string;
  color?: string;
  soft?: string;
}) {
  // A single cypress / poplar spire.
  const cypress = (x: number, base: number, h: number, w: number, key: string) => (
    <g key={key}>
      <path
        d={`M ${x} ${base} C ${x - w} ${base - h * 0.3}, ${x - w * 0.55} ${base - h * 0.72}, ${x} ${base - h} C ${x + w * 0.55} ${base - h * 0.72}, ${x + w} ${base - h * 0.3}, ${x} ${base} Z`}
        stroke={color}
        strokeWidth="0.7"
        fill="none"
        opacity="0.55"
      />
      <line x1={x} y1={base} x2={x} y2={base - h * 0.9} stroke={color} strokeWidth="0.5" opacity="0.4" />
    </g>
  );

  return (
    <svg
      className={className}
      style={style}
      width={width}
      height={height}
      viewBox="0 0 404 252"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* ── faint sky hatching / distant haze ─────────────────────── */}
      <g stroke={soft} strokeWidth="0.5" opacity="0.35">
        {[16, 26, 36, 46].map((y) => (
          <line key={y} x1="8" y1={y} x2="250" y2={y - 4} />
        ))}
      </g>

      {/* ── overhanging branch from the top-right (frames the scene) ─ */}
      <g stroke={color} strokeWidth="0.8" opacity="0.6" strokeLinecap="round">
        <path d="M404 6 C 360 14, 320 8, 286 30 C 268 42, 250 40, 236 54" fill="none" />
        <path d="M300 20 C 292 10, 288 6, 286 -2" fill="none" strokeWidth="0.6" />
        <path d="M330 12 C 326 4, 326 2, 328 -4" fill="none" strokeWidth="0.6" />
        <path d="M262 44 C 256 36, 254 34, 256 26" fill="none" strokeWidth="0.6" />
      </g>
      {/* leaves along the branch */}
      <g fill="none" stroke={color} strokeWidth="0.55" opacity="0.5">
        {[
          [292, 12], [304, 22], [318, 14], [332, 24], [276, 34], [262, 30], [250, 46], [238, 50],
        ].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="4.5" ry="1.8" transform={`rotate(${-40 + i * 12} ${cx} ${cy})`} />
        ))}
      </g>

      {/* ── rolling hills / horizon ───────────────────────────────── */}
      <g fill="none" strokeLinecap="round">
        <path d="M0 96 C 70 74, 120 82, 190 70 C 250 60, 320 72, 404 62" stroke={color} strokeWidth="0.9" opacity="0.55" />
        <path d="M0 112 C 90 98, 150 104, 230 92 C 300 82, 360 92, 404 86" stroke={color} strokeWidth="0.8" opacity="0.45" />
        <path d="M0 84 C 60 70, 110 66, 170 60" stroke={soft} strokeWidth="0.6" opacity="0.4" />
        {/* light hillside hatching */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={40 + i * 16}
            y1={92 - i}
            x2={54 + i * 16}
            y2={104 - i}
            stroke={soft}
            strokeWidth="0.4"
            opacity="0.3"
          />
        ))}
      </g>

      {/* ── hilltop villa (upper-mid, echoing the reference) ───────── */}
      <g stroke={color} strokeWidth="0.7" fill="none" opacity="0.65">
        {/* main house block */}
        <path d="M120 74 h34 v20 h-34 z" />
        {/* low roof */}
        <path d="M117 74 L137 64 L157 74" strokeWidth="0.6" />
        {/* attached tower */}
        <path d="M154 66 h12 v28 h-12 z" />
        <path d="M152 66 L160 60 L168 66" strokeWidth="0.6" />
        {/* windows / door ticks */}
        <g strokeWidth="0.5" opacity="0.8">
          <line x1="127" y1="80" x2="127" y2="86" />
          <line x1="135" y1="80" x2="135" y2="86" />
          <line x1="145" y1="80" x2="145" y2="86" />
          <line x1="159" y1="74" x2="159" y2="80" />
        </g>
      </g>

      {/* ── cypress spires along the ridge ────────────────────────── */}
      {cypress(172, 96, 34, 6, "c1")}
      {cypress(182, 98, 26, 5, "c2")}
      {cypress(196, 100, 40, 7, "c3")}
      {cypress(232, 94, 30, 6, "c4")}
      {cypress(300, 92, 36, 7, "c5")}
      {cypress(312, 96, 24, 5, "c6")}

      {/* distant clustered foliage on the far hill */}
      <g fill="none" stroke={soft} strokeWidth="0.5" opacity="0.4">
        {[[70, 92], [86, 96], [250, 88], [268, 92], [344, 90], [360, 94]].map(([cx, cy], i) => (
          <path key={i} d={`M ${cx - 8} ${cy} C ${cx - 8} ${cy - 8}, ${cx + 8} ${cy - 8}, ${cx + 8} ${cy} C ${cx + 8} ${cy + 3}, ${cx - 8} ${cy + 3}, ${cx - 8} ${cy} Z`} />
        ))}
      </g>

      {/* ── mid-ground ground line (under where the seal sits) ─────── */}
      <path d="M0 150 C 100 142, 200 150, 404 144" stroke={soft} strokeWidth="0.6" fill="none" opacity="0.4" />

      {/* ── foreground classical colonnade / ruins (lower-left) ───── */}
      <g stroke={color} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round">
        {/* entablature */}
        <line x1="18" y1="176" x2="118" y2="172" />
        <line x1="18" y1="180" x2="118" y2="176" strokeWidth="0.5" opacity="0.7" />
        {/* columns (fluted uprights) */}
        {[26, 46, 66, 86, 106].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={178} x2={x - 1} y2={234} />
            <line x1={x + 6} y1={178} x2={x + 5} y2={234} />
            <line x1={x + 3} y1={180} x2={x + 2} y2={232} strokeWidth="0.4" opacity="0.5" />
            {/* capital + base */}
            <line x1={x - 2} y1={178} x2={x + 8} y2={178} strokeWidth="0.6" />
            <line x1={x - 2} y1={234} x2={x + 8} y2={234} strokeWidth="0.6" />
          </g>
        ))}
        {/* a fallen block / rubble in front */}
        <path d="M20 240 h26 v8 h-26 z" strokeWidth="0.6" opacity="0.5" />
        <path d="M120 226 l14 -3 l2 9 l-14 3 z" strokeWidth="0.55" opacity="0.5" />
      </g>

      {/* ── foreground leafy tree (lower-right) ───────────────────── */}
      <g stroke={color} fill="none" strokeLinecap="round" opacity="0.62">
        {/* trunk + limbs */}
        <path d="M372 252 C 366 224, 372 206, 360 182 C 354 170, 356 158, 366 146" strokeWidth="1.1" />
        <path d="M362 196 C 346 190, 336 192, 326 200" strokeWidth="0.7" />
        <path d="M366 172 C 380 166, 388 168, 396 178" strokeWidth="0.7" />
        <path d="M360 182 C 348 176, 342 176, 334 182" strokeWidth="0.6" opacity="0.8" />
      </g>
      {/* canopy — a scatter of fine leaf ticks */}
      <g stroke={color} strokeWidth="0.5" opacity="0.5" fill="none">
        {Array.from({ length: 34 }).map((_, i) => {
          const a = (i / 34) * Math.PI * 2;
          const rx = 30 + (i % 5) * 3;
          const ry = 26 + (i % 4) * 3;
          const cx = r2(364 + Math.cos(a) * rx * 0.6);
          const cy = r2(150 + Math.sin(a) * ry * 0.55);
          return (
            <ellipse key={i} cx={cx} cy={cy} rx="4" ry="1.6" transform={`rotate(${(i * 47) % 180} ${cx} ${cy})`} />
          );
        })}
      </g>

      {/* ── foreground shrubbery ticks along the base ─────────────── */}
      <g stroke={soft} strokeWidth="0.5" opacity="0.4" fill="none">
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 140 + i * 12;
          return <path key={i} d={`M ${x} 250 q 3 -7 6 0`} />;
        })}
      </g>
    </svg>
  );
}

/**
 * A realistic cream / ivory wax seal with a tone-on-tone embossed cipher.
 * The molten edge comes from a turbulence displacement filter; the raised feel
 * from layered soft shadows; the debossed detail (beaded ring, initials,
 * sprig) from paired light+dark offset copies of each mark.
 */
export function WaxSeal({
  monogram,
  size = 108,
  tone = "cream",
}: {
  monogram: string;
  size?: number;
  // "cream" = warm ivory wax (site default); "gold" = bronze-gold metallic
  // wax; "navy" = cobalt wax with a light cipher, for the toile de Jouy look.
  tone?: "cream" | "gold" | "navy";
}) {
  // The intertwined initials, e.g. "D&S" → "D" and "S" overlapped.
  const letters = monogram.replace(/&/g, "").split("");

  // Tone palette — the whole seal recolors from this one object.
  const P =
    tone === "gold"
      ? {
          hi: "#edcd82",
          mid: "#c9a24a",
          shade: "#8c6a2c",
          rimLight: "rgba(255,246,214,0.6)",
          rimDark: "rgba(88,64,24,0.5)",
          embDark: "rgba(84,60,20,0.5)",
          embLight: "rgba(255,246,214,0.8)",
          embMid: "#c9a24a",
          mono: "#f2d98c",
        }
      : tone === "navy"
      ? {
          hi: "#4f6cae",
          mid: "#2c4c9c",
          shade: "#1a2f63",
          rimLight: "rgba(210,222,248,0.6)",
          rimDark: "rgba(16,30,72,0.5)",
          embDark: "rgba(20,35,80,0.55)",
          embLight: "rgba(214,226,250,0.8)",
          embMid: "#2c4c9c",
          mono: "#dfe6f5",
        }
      : {
          hi: "var(--wax-hi)",
          mid: "var(--wax)",
          shade: "var(--wax-shade)",
          rimLight: "rgba(255,250,240,0.55)",
          rimDark: "rgba(120,96,58,0.28)",
          embDark: "rgba(120,96,58,0.42)",
          embLight: "rgba(255,251,242,0.75)",
          embMid: "var(--wax)",
          mono: "var(--gold)",
        };

  // One debossed mark rendered three times: dark (down-right), light
  // (up-left), and a mid body — the classic pressed-wax illusion.
  const emboss = (node: (fill: string, dx: number, dy: number, op: number) => React.ReactNode) => (
    <>
      {node(P.embDark, 0.5, 0.7, 1)}
      {node(P.embLight, -0.5, -0.7, 1)}
      {node(P.embMid, 0, 0, 1)}
    </>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-label={`Wax seal with the monogram ${monogram}`}
      role="img"
    >
      <defs>
        <radialGradient id="waxfill" cx="40%" cy="34%" r="72%">
          <stop offset="0%" stopColor={P.hi} />
          <stop offset="55%" stopColor={P.mid} />
          <stop offset="100%" stopColor={P.shade} />
        </radialGradient>
        <filter id="molten" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="raise" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="2.2" floodColor="rgba(24,40,90,0.5)" />
        </filter>
      </defs>

      {/* the wax puddle — irregular molten edge + soft outer shadow */}
      <g filter="url(#raise)">
        <circle cx="50" cy="50" r="41" fill="url(#waxfill)" filter="url(#molten)" />
      </g>

      {/* inner sheen ring + pressed rim shadow */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={P.rimLight} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="40" fill="none" stroke={P.rimDark} strokeWidth="1.4" />

      {/* fine debossed inner circles */}
      {emboss((fill, dx, dy) => (
        <circle key={`ic-${dx}`} cx={50 + dx} cy={50 + dy} r="33" fill="none" stroke={fill} strokeWidth="0.7" />
      ))}

      {/* beaded ring — a ring of small debossed dots */}
      {emboss((fill, dx, dy) => (
        <g key={`bead-${dx}`}>
          {Array.from({ length: 44 }).map((_, i) => {
            const a = (i / 44) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={r2(50 + dx + Math.cos(a) * 30)}
                cy={r2(50 + dy + Math.sin(a) * 30)}
                r="0.9"
                fill={fill}
              />
            );
          })}
        </g>
      ))}

      {/* tiny botanical sprig above the cipher (like the reference) */}
      {emboss((fill, dx, dy) => (
        <g key={`sprig-${dx}`} stroke={fill} strokeWidth="0.7" fill="none" strokeLinecap="round">
          <path d={`M${50 + dx} ${28 + dy} q 0 5 0 9`} />
          {[-1, 1].map((s) => (
            <g key={s}>
              <path d={`M${50 + dx} ${31 + dy} q ${3 * s} -1 ${5 * s} -3`} />
              <path d={`M${50 + dx} ${34 + dy} q ${3 * s} -1 ${5 * s} -3`} />
            </g>
          ))}
        </g>
      ))}

      {/* the intertwined cipher — soft gold, raised out of the wax with a
          paired light/dark emboss */}
      {(
        [
          [P.embDark, 0.5, 0.7],
          [P.embLight, -0.5, -0.7],
          [P.mono, 0, 0],
        ] as const
      ).map(([fill, dx, dy]) => (
        <text
          key={`mono-${dx}`}
          x={50 + dx}
          y={62 + dy}
          textAnchor="middle"
          fill={fill}
          fillOpacity={fill === P.mono ? 0.9 : 1}
          style={{
            fontFamily: "var(--font-display), var(--font-serif), serif",
            fontStyle: "italic",
            fontSize: "34px",
            letterSpacing: "-1px",
          }}
        >
          {letters.join("")}
        </text>
      ))}
    </svg>
  );
}
