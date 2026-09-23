import { content } from "@/lib/content";

// Royal-blue palette for this clean, minimal card. Kept local (Tailwind
// arbitrary values) so the surrounding envelope's own tokens are untouched.
const BLUE = "#2b3f9c"; // primary — names, frame, monogram, headings
const BLUE_SOFT = "#7181b3"; // muted slate-blue — subtitle & secondary lines

/** Title-case a possibly ALL-CAPS name for the script display face. */
const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());

/** The couple's initials inside a thin vertical oval — the crowning mark. */
function Monogram({ monogram }: { monogram: string }) {
  const initials = monogram.replace(/[^\p{L}]/gu, ""); // "D&S" → "DS"
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 150 }}>
      <svg
        width={120}
        height={150}
        viewBox="0 0 120 150"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0"
      >
        <ellipse cx="60" cy="75" rx="47" ry="66" stroke={BLUE} strokeWidth="1" />
      </svg>
      <span
        className="font-script leading-none"
        style={{ color: BLUE, fontSize: "3.6rem" }}
      >
        {initials}
      </span>
    </div>
  );
}

/** One parents column: emphasized label over the names. */
function ParentColumn({ label, names }: { label: string; names: readonly string[] }) {
  return (
    <div className="flex-1">
      <p className="text-[13px] font-semibold tracking-wide" style={{ color: BLUE }}>
        {label}
      </p>
      {names.map((name, i) => (
        <p key={i} className="mt-1.5 text-[12.5px] leading-snug" style={{ color: BLUE_SOFT }}>
          {name}
        </p>
      ))}
    </div>
  );
}

/**
 * The invitation content — rendered statically (already "printed" on the card).
 * The reveal comes from the card physically sliding out of the envelope.
 *
 * A clean, minimal treatment: a pure-white face inside a single thin royal-blue
 * keyline, an interlocking "DS" script monogram in a slim oval, the couple's
 * names in a formal roundhand calligraphy, and royal-blue type throughout with
 * no ornament. Hebrew-primary; English appears only for the couple's names and
 * the "are getting married" subtitle. Every Hebrew line is set `dir="rtl"`.
 */
export function InvitationCard() {
  const dateParts = content.date.split(".");

  return (
    <div className="relative bg-white px-9 py-10 sm:px-10 sm:py-11">
      {/* Single thin royal-blue frame hugging the card */}
      <div
        className="pointer-events-none absolute inset-[13px] rounded-[2px] border"
        style={{ borderColor: BLUE }}
      />

      {/* Content column */}
      <div className="relative flex flex-col items-center gap-4 px-2">
        {/* Monogram — the crowning mark */}
        <Monogram monogram={content.envelope.monogram} />

        {/* Opening verse */}
        <p
          dir="rtl"
          className="font-hebrew max-w-[19rem] text-center text-[13.5px] leading-relaxed"
          style={{ color: BLUE }}
        >
          &ldquo;{content.verse}&rdquo;
        </p>

        {/* Couple's names — the centerpiece, one line of calligraphy script */}
        <h1
          className="font-script leading-none"
          style={{ color: BLUE, fontSize: "3.4rem" }}
        >
          {titleCase(content.namesEn)}
        </h1>

        {/* Subtitle — letter-spaced serif caps */}
        <p
          className="text-[12px] uppercase tracking-[0.3em]"
          style={{ color: BLUE_SOFT }}
        >
          {content.subtitleEn}
        </p>

        {/* Invitation body */}
        <div dir="rtl" className="font-hebrew mt-2 text-center">
          <p className="text-[16px] font-semibold leading-relaxed" style={{ color: BLUE }}>
            {content.invite[0]}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: BLUE_SOFT }}>
            {content.invite[1]}
          </p>
        </div>

        {/* Venue — lead-in, name, then city */}
        <div className="text-center">
          <p dir="rtl" className="font-hebrew text-[13px]" style={{ color: BLUE_SOFT }}>
            {content.venue.lead}
          </p>
          <p
            dir="rtl"
            className="font-hebrew mt-2 text-[1.35rem] tracking-[0.12em]"
            style={{ color: BLUE }}
          >
            {content.venue.name}
          </p>
          <p dir="rtl" className="font-hebrew mt-1.5 text-[15px]" style={{ color: BLUE }}>
            {content.venue.place}
          </p>
        </div>

        {/* Date — large, letter-spaced, thin pipe separators */}
        <p
          className="mt-1 flex items-center gap-3 text-[1.7rem] font-medium tracking-[0.15em]"
          style={{ color: BLUE }}
        >
          {dateParts.map((part, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span className="text-[1.3rem] font-thin opacity-60">|</span>}
              {part}
            </span>
          ))}
        </p>

        {/* Parents — two balanced columns (dir=rtl → bride on the right) */}
        <div
          dir="rtl"
          className="font-hebrew mt-4 flex w-full justify-between gap-4 px-1 text-center"
        >
          <ParentColumn
            label={content.parents.bride.label}
            names={content.parents.bride.names}
          />
          <ParentColumn
            label={content.parents.groom.label}
            names={content.parents.groom.names}
          />
        </div>
      </div>
    </div>
  );
}
