import { content } from "@/lib/content";
import { FloralSprig } from "./Florals";

/** A small gold divider with a center diamond. */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-0.5">
      <span className="h-px w-10 bg-gold/50 sm:w-14" />
      <span className="rotate-45 text-gold text-[9px] leading-none">◆</span>
      <span className="h-px w-10 bg-gold/50 sm:w-14" />
    </div>
  );
}

/** One parents column: emphasized label over the names. */
function ParentColumn({ label, names }: { label: string; names: readonly string[] }) {
  return (
    <div className="flex-1">
      <p className="text-[12px] font-medium tracking-wide text-ink">{label}</p>
      {names.map((name, i) => (
        <p key={i} className="mt-1 text-[12px] leading-snug text-ink-soft">
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
 * Hebrew-primary; English appears only for the couple's names, the script
 * subtitle, and "ADIA". Every Hebrew line is set `dir="rtl"` so the browser
 * lays it out correctly — never reversed by hand.
 */
export function InvitationCard() {
  // "SHOVAL & DANIEL" → stacked focal treatment on the narrow card.
  const names = content.namesEn.split(/\s*&\s*/);
  const stacked = names.length === 2;

  return (
    <div className="relative flex flex-col items-center gap-2.5 px-7 py-8 text-ink">
      {/* בס״ד — upper-right corner */}
      <span
        dir="rtl"
        className="font-hebrew absolute right-4 top-3 text-[11px] tracking-wide text-ink-soft"
      >
        {content.bsd}
      </span>

      {/* Opening verse */}
      <p
        dir="rtl"
        className="font-hebrew mt-1 max-w-[15rem] text-center text-[13px] leading-relaxed text-ink-soft"
      >
        {content.verse}
      </p>

      {/* Botanical sprig — the single permitted illustration */}
      <FloralSprig size={58} className="opacity-90" />

      {/* Couple's names — the centerpiece */}
      <h1 className="font-display flex flex-col items-center text-ink">
        {stacked ? (
          <>
            <span className="text-[2.35rem] font-medium uppercase leading-[1.02] tracking-[0.16em] sm:text-[2.6rem]">
              {names[0]}
            </span>
            <span className="my-0.5 text-xl font-normal text-gold">&amp;</span>
            <span className="text-[2.35rem] font-medium uppercase leading-[1.02] tracking-[0.16em] sm:text-[2.6rem]">
              {names[1]}
            </span>
          </>
        ) : (
          <span className="text-[2rem] font-medium uppercase leading-tight tracking-[0.14em]">
            {content.namesEn}
          </span>
        )}
      </h1>

      {/* Handwritten subtitle */}
      <p className="font-script text-[1.6rem] leading-none text-gold">
        {content.subtitleEn}
      </p>

      <Divider />

      {/* Invitation body */}
      <div dir="rtl" className="font-hebrew text-center text-ink">
        <p className="text-[15px] leading-relaxed">{content.invite[0]}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          {content.invite[1]}
        </p>
      </div>

      {/* Date — prominent */}
      <p className="font-display text-[1.55rem] tracking-[0.14em] text-ink">
        {content.date}
      </p>

      {/* Venue */}
      <div className="text-center">
        <p className="font-display text-[0.95rem] tracking-[0.12em] text-gold">
          {content.venue.name}
        </p>
        <p dir="rtl" className="font-hebrew mt-1 text-[13px] text-ink-soft">
          {content.venue.place}
        </p>
      </div>

      {/* Event times — one balanced line */}
      <p dir="rtl" className="font-hebrew text-center text-[13px] text-ink">
        {content.times}
      </p>

      {/* Closing */}
      <p dir="rtl" className="font-hebrew text-[13px] text-sage">
        {content.closing}
      </p>

      <Divider />

      {/* Parents — two balanced columns (dir=rtl → bride on the right) */}
      <div dir="rtl" className="font-hebrew flex w-full justify-between gap-4 px-1 text-center">
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
  );
}
