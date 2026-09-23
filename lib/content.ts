// ─────────────────────────────────────────────────────────────
//  WEDDING DETAILS — edit everything here. No other file needs to change.
//  Hebrew is the primary language; keep every string exactly as written
//  (nikud, gershayim ״, geresh ׳, and ז״ל are intentional — do not "fix" them).
// ─────────────────────────────────────────────────────────────

export const content = {
  // Opening verse (Song of Songs 3:4) — one elegant line at the top of the card
  verse: "עַד שֶׁמָּצָאתִי אֵת שֶׁאָהֲבָה נַפְשִׁי אֲחַזְתִּיו וְלֹא אַרְפֶּנּוּ",

  // The couple — the visual centerpiece (large calligraphy script)
  namesEn: "SHOVAL & DANIEL",
  subtitleEn: "are getting married", // letter-spaced serif caps

  // Invitation body (two Hebrew lines)
  invite: [
    "שמחים ונרגשים להזמינכם לחגוג עמנו את יום נישואינו",
    "שיתקיים ביום רביעי, כ״ה בחשוון תשפ״ז",
  ],

  // Wedding date — shown prominently (rendered as "04 | 11 | 2026")
  date: "04.11.2026",

  // Venue — a lead-in ("at the halls of"), the name, then the city
  venue: {
    lead: "באולמי",
    name: "ADIA | עדיה",
    place: "יבנה",
  },

  // Parents — two balanced columns (right = bride, left = groom)
  parents: {
    bride: {
      label: "הורי הכלה",
      names: ["עמליה ג׳יברי", "אמיר ג׳יברי ז״ל"],
    },
    groom: {
      label: "הורי החתן",
      names: ["תמי לוי", "אלכסנדר סמרג׳יאן"],
    },
  },

  // Envelope face — the intertwined initials embossed on the cream wax seal
  envelope: {
    monogram: "D&S", // intertwined D & S cipher on the wax seal
  },
} as const;

export type Content = typeof content;
