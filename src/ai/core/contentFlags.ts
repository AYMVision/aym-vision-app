// src/ai/core/contentFlags.ts
// Ziel-Spezifikation v2: Offline-Detektoren für riskante Inhalte & Normverletzung.
// Wichtig: heuristisch, robust, konservativ (lieber einmal zu viel flaggen als zu wenig).

function normalizeForFlags(input: string): string {
  return (input ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .replace(/ß/g, 'ss')
    .trim();
}

export type ContentFlags = {
  selfHarm: boolean;
  sexualContent: boolean;
  violenceThreat: boolean;
  abuseByAdult: boolean;     // Misshandlung / Gewalt durch Bezugsperson
  eatingDisorder: boolean;   // Essstörung / Körperbild

  bullyingApproval: boolean;
  hateOrDegrading: boolean;
  misinformationIntent: boolean;

  illegalHarmIntent: boolean; // optional später (v2: konservativ false)
  languageWarning: boolean;   // Schimpfwörter / Beleidigungen (Stufe 3, kein Block)
  personalData: boolean;      // Telefonnummer / Adresse (Stufe 1, kein Block)
};

// --- Self-harm / Suicide (sehr konservativ, DE/EN) ---
// Hinweis: Wir flaggen hier lieber früh, UI zeigt dann Offline-Hilfe.
// --- Self-harm / Suicide (sehr konservativ, robuster) ---
// Ziel: lieber einmal zu früh flaggen als zu spät.
const SELF_HARM_PATTERNS: RegExp[] = [
  // --- harte Begriffe ---
  /\b(suizid|selbstmord)\b/i,
  /\b(self\s*harm|selfharm|suicide)\b/i,

  // --- "ich will nicht mehr leben / sterben / tot sein" ---
  /\b(ich)\b[\s\S]{0,40}\b(will|mochte|moechte|werde)\b[\s\S]{0,60}\b(nicht mehr leben|sterben|tot sein)\b/i,

  // --- "ich bring(e) mich um" ---
  /\bbring(e|)\b[\s\S]{0,20}\bmich\b[\s\S]{0,20}\bum\b/i,

  // --- "ich will mich umbringen / töten / killen" ---
  /\bich\b[\s\S]{0,40}\b(will|mochte|moechte|werde)\b[\s\S]{0,20}\b(mich|mir)\b[\s\S]{0,20}\b(umbring|umbringen|toet|tot|toeten|toten|totmach|kill)\w*/i,

  // --- Ritzen / Selbstverletzung / Schneiden ---
  /\b(ritzen|ritze|geritzt)\b/i,
  /\bich\b[\s\S]{0,40}\b(verletz|verletze|schneid|schneide)\w*\b[\s\S]{0,20}\b(mich|mir)\b/i,

  // --- "ich tue mir weh" ---
  /\bich\b[\s\S]{0,40}\b(tu|tue)\b[\s\S]{0,10}\bmir\b[\s\S]{0,20}\b(weh|was an)\b/i,

  // --- "ich mach mir was an" ---
  /\bich\b[\s\S]{0,40}\bmach\b[\s\S]{0,10}\bmir\b[\s\S]{0,10}\bwas\b[\s\S]{0,10}\ban\b/i,

  // --- starke Verzweiflung (bei dir: soll auch sofort reagieren) ---
  /\bich\b[\s\S]{0,30}\b(kann|halte)\b[\s\S]{0,20}\b(das\s*)?nicht mehr\b/i,
  /\balles\b[\s\S]{0,10}\bzu viel\b/i,
  /\bich\b[\s\S]{0,40}\bwill\b[\s\S]{0,20}\bnicht mehr\b/i,

  // --- EN: common suicide / self-harm intent phrases ---
  /\b(i)\b[\s\S]{0,30}\b(want|wanna|will|would|am going to|gonna|might)\b[\s\S]{0,40}\b(kill|end)\b[\s\S]{0,20}\b(myself|my life|it all)\b/i,
  /\b(i)\b[\s\S]{0,30}\b(don't|dont)\b[\s\S]{0,20}\b(want|wanna)\b[\s\S]{0,30}\b(to)\b[\s\S]{0,30}\b(live|be alive)\b/i,
  /\b(i)\b[\s\S]{0,30}\b(can't|cant)\b[\s\S]{0,20}\b(take)\b[\s\S]{0,20}\b(it)\b[\s\S]{0,10}\b(anymore)\b/i,
  /\b(i)\b[\s\S]{0,30}\b(wish)\b[\s\S]{0,20}\b(i)\b[\s\S]{0,20}\b(was)\b[\s\S]{0,20}\b(dead)\b/i,
  /\b(i)\b[\s\S]{0,30}\b(want)\b[\s\S]{0,20}\b(to)\b[\s\S]{0,20}\b(die)\b/i,
  /\b(i'm|im|i am)\b[\s\S]{0,20}\b(suicidal)\b/i,
  /\b(suicide|suicidal)\b/i,
  /\b(self\s*harm|selfharm)\b/i,
  /\b(i)\b[\s\S]{0,30}\b(hurt|cut)\b[\s\S]{0,20}\b(myself)\b/i,

];


// --- Sexual Content (kindgerecht: nur grobe Trigger, konservativ) ---
const SEXUAL_PATTERNS: RegExp[] = [
  // DE/EN (minimal)
  /\bsex\b/i,
  /\bnackt\b/i,
  /\bnude(s)?\b/i,
  /\bpornos?\b/i,
  /\bporn\b/i,
  /\bvergewaltig\w*\b/i,
  /\brape\b/i,
  /\bpenis\b/i,
  /\bvagina\b/i,
];

// --- Violence / Threats (konservativ) ---
const VIOLENCE_PATTERNS: RegExp[] = [
  // DE: "ich bring dich um" / "ich werde dich schlagen" etc.
  /\bich\b[\s\S]{0,20}\bbring\b[\s\S]{0,20}\bdich\b[\s\S]{0,10}\bum\b/i,
  /\bich\b[\s\S]{0,20}\bwerd\w*\b[\s\S]{0,20}\bdich\b[\s\S]{0,20}\b(schlag\w*|hau\w*|verletz\w*|abstech\w*)\b/i,
  /\babstech\w*\b/i,
  /\bwaffe\b/i,

  // EN
  /\bi\b[\s\S]{0,20}\b(kill)\b[\s\S]{0,20}\b(you|u)\b/i,
  /\bi\b[\s\S]{0,20}\b(will|gonna)\b[\s\S]{0,20}\b(hurt|stab|beat)\b[\s\S]{0,20}\b(you|u)\b/i,
  /\b(kill|stab)\w*\b/i,
  /\bweapon\b/i,
];

// --- Bullying approval / intent (Mobbing gut / ich mach ihn fertig) ---
const BULLYING_APPROVAL_PATTERNS: RegExp[] = [
  // DE (normalisiert: ä→a — deshalb ware/waere statt wär/wäre)
  /\bmobbing\b[\s\S]{0,10}\b(ist|ware|waere)\b[\s\S]{0,10}\b(gut|cool|ok|okay|lustig|richtig)\b/i,
  /\bich\b[\s\S]{0,20}\b(mach|mache|mach\'?|werd|werde)\b[\s\S]{0,20}\b(ihn|sie|den|die)\b[\s\S]{0,20}\b(fertig|runter|kaputt)\b/i,
  /\b(jemanden|wen)\b[\s\S]{0,10}\b(auslach\w*|beleidig\w*|arger\w*|ärger\w*|schikanier\w*)\b/i,
  /\b(auslachen|beleidigen|runtermachen)\b[\s\S]{0,10}\b(macht|ist)\b[\s\S]{0,10}\b(spass|spaß|cool|gut)\b/i,

  // EN (minimal)
  /\b(bullying)\b[\s\S]{0,10}\b(is)\b[\s\S]{0,10}\b(good|funny|cool|ok)\b/i,
  /\bi\b[\s\S]{0,20}\b(will|gonna)\b[\s\S]{0,20}\b(ruin|destroy)\b[\s\S]{0,20}\b(him|her|them)\b/i,
];

// --- Hate / degrading speech — Stufe A: Slurs (wortbasiert, kein Satzkontext nötig) ---
// Hinweis: Muster gegen normalisierten Text (Umlaute bereits entfernt: ü→u, ä→a, ö→o)
const SLUR_PATTERNS: RegExp[] = [
  // Ableistisch (DE)
  /\b(spast|spasti)\b/i,
  /\bmongo\b/i,
  /\bkruppel\b/i,                   // krüppel normalisiert

  // Ableistisch (EN)
  /\bretard(ed)?\b/i,
  /\bcripple\b/i,

  // Homophob / transphob (DE)
  /\bschwuchtel\b/i,
  /\btunte\b/i,

  // Homophob (EN)
  /\b(faggot|fag)\b/i,
  /\bdyke\b/i,

  // Rassistisch (DE)
  /\bschlitzauge\w*/i,
  /\bkanake\w*/i,
  /\bn[e3]gg?[ae3]r\w*/i,           // N-Wort DE-Form, inkl. Zahlersatz

  // Rassistisch (EN)
  /\bn[i1]gg[ae3]r\w*/i,            // N-Wort EN-Form
  /\b(spic|chink|kike)\b/i,

  // Antisemitisch (DE)
  /\bjudensau\b/i,
  /\bjudenschwein\b/i,

  // Sexistisch (abwertend gegenüber Frauen)
  /\b(schlampe|hure|nutte)\b/i,
];

// --- Hate / degrading speech — Stufe B: Gruppenbasierter Hass (Satzmuster) ---
const GROUP_HATE_PATTERNS: RegExp[] = [
  // DE: "X raus" — Hassparolen (normalisiert: ä→a, ü→u)
  /\b(auslander|juden?|muslime?|fluchtlinge?|migranten?)\s*(raus|weg)\b/i,

  // DE: Vernichtungsrhetorik
  /\b(gehoren|sollten)\s*(vergast|vernichtet|ausgerottet|erschossen|abgeschoben)\b/i,

  // DE: "alle X sind [negativ]" (normalisiert: ä→a, ö→o)
  /\balle\b[\s\S]{0,20}\b(sind|seid)\b[\s\S]{0,20}\b(kriminell|gefahrlich|wertlos|schlecht|bose|doof|blod|dumm|hasslich)\b/i,

  // DE: Gruppe + sind/ist + abwertend (auch ohne "alle")
  /\b(juden?|muslime?|christen?|auslander|schwarze?|fluchtlinge?|migranten?|araber?|asiaten?|turken?)\b[\s\S]{0,25}\b(sind|ist|seid)\b[\s\S]{0,25}\b(doof|blod|dumm|wertlos|schlecht|bose|eklig|kriminell|gefahrlich|hasslich)\b/i,

  // DE: "hasse alle / die"
  /\bhasse\b[\s\S]{0,20}\b(alle|die)\b/i,

  // DE: persönlich abwertend
  /\b(du|ihr|die)\b[\s\S]{0,10}\b(bist|seid|sind)\b[\s\S]{0,10}\b(dumm|wertlos|eklig)\b/i,

  // EN: Gruppe + are + abwertend
  /\b(jews?|muslims?|christians?|blacks?|foreigners?|migrants?|arabs?|asians?|turks?)\b[\s\S]{0,25}\b(are|is)\b[\s\S]{0,25}\b(stupid|dumb|worthless|bad|evil|disgusting|criminal|dangerous|ugly)\b/i,

  // EN
  /\b(you|they)\b[\s\S]{0,10}\b(are)\b[\s\S]{0,10}\b(stupid|worthless|disgusting)\b/i,
  /\b(i)\b[\s\S]{0,10}\b(hate)\b[\s\S]{0,20}\b(all|every(one|body)?)\b/i,
];

// --- Persönliche Daten (Stufe 1 — freundlicher Hinweis, kein Block) ---
// Telefonnummern: deutsche Formate (0xxx, +49 via normalisiert als 49xxx)
// Adressen: Straßentyp + Hausnummer (normalisiert: ß→ss, ä→a)
const PERSONAL_DATA_PATTERNS: RegExp[] = [
  // Telefon: beginnt mit 0 + mind. 7 weitere Ziffern (mit opt. Leerzeichen)
  /\b0\d[\d\s]{6,13}\d\b/,

  // Telefon: +49-Format (+ durch Normalisierung entfernt → beginnt mit 49)
  /\b49\s?\d[\d\s]{6,12}\d\b/,

  // Adresse: Straßenname + Hausnummer (normalisiert: strasse, str, weg, platz, etc.)
  /\b\w{3,}(strasse|gasse|allee|ring|pfad)\b\s+\d+[a-z]?\b/i,
  /\b\w{2,}str\b\s+\d+[a-z]?\b/i,
  /\b\w{3,}(weg|platz)\b\s+\d+[a-z]?\b/i,
];

// --- Language Warning — Schimpfwörter / einfache Beleidigungen (Stufe 3) ---
// Kein Block, nur ein freundlicher Nudge; nach einem Retry wird durchgelassen.
const LANGUAGE_WARNING_PATTERNS: RegExp[] = [
  // DE
  /\bschei(ss|ß)\w*/i,
  /\bfick\w*\b/i,
  /\b(wichser|arschloch|hurensohn|vollidiot|depp)\b/i,
  /\bidiot(in)?\b/i,
  /\bverpisss?\b/i,
  /\barsch\b/i,
  /\b(kacke|kaka)\b/i,
  /\b(blödmann|blödmanns)\b/i,
  /\bvollpfosten\b/i,
  /\btrottel\b/i,
  /\bpenner(in)?\b/i,
  /\b(bescheuert)\b/i,
  /\b(bekloppt)\b/i,
  /\b(pisser|pisse)\b/i,
  /\bloser\b/i,
  /\bnoob\b/i,
  // EN
  /\b(fuck|shit|asshole|bitch|bastard|crap|damn)\b/i,
];

// --- Misshandlung / Gewalt durch Erwachsene / Bezugsperson ---
// Hinweis: konservativ — bei Kindern lieber einmal zu viel flaggen.
// Reaktion: ABUSE_MESSAGE (nicht CRISIS_MESSAGE) — kein "Hol Erwachsene", da Täter Elternteil sein könnte.
// Muster gegen normalisierten Text (Umlaute entfernt: ä→a, ü→u, ö→o)
const ABUSE_PATTERNS: RegExp[] = [
  // DE: Bezugsperson + Gewalt gegen Kind
  /\b(vater|mutter|eltern|stiefvater|stiefmutter|opa|oma|onkel|tante|bruder|schwester)\b[\s\S]{0,40}\b(schlagt|haut|tritt|verletzt|geschlagen)\b[\s\S]{0,15}\b(mich|mir)\b/i,

  // DE: Passiv — "ich werde/wurde geschlagen/misshandelt"
  /\bich\b[\s\S]{0,20}\b(werde|wurde|bin|war)\b[\s\S]{0,20}\b(geschlagen|gehauen|getreten|verletzt|misshandelt)\b/i,

  // DE: "er/sie schlägt mich"
  /\b(er|sie)\b[\s\S]{0,15}\b(schlagt|haut|tritt|verletzt)\b[\s\S]{0,10}\b(mich|mir)\b/i,

  // DE: Angst zuhause / vor Familie
  /\bich\b[\s\S]{0,20}\b(hab|habe)\b[\s\S]{0,10}\bangst\b[\s\S]{0,30}\b(zuhause|nach hause|vor meinem?|vor dem|vor der)\b/i,

  // DE: "zuhause passieren schlimme Dinge" (normalisiert: ä→a)
  /\b(zuhause|bei uns|bei mir)\b[\s\S]{0,25}\b(passiert|passieren|ist es)\b[\s\S]{0,25}\b(schlimm\w*|nicht gut|furchtbar|schrecklich|gefahrlich)\b/i,

  // DE: Schweige-Gebot durch Täter (normalisiert: ä→a)
  /\bich\b[\s\S]{0,20}\b(darf|soll)\b[\s\S]{0,20}\b(niemandem?|keinem|niemand)\b[\s\S]{0,20}\b(sagen|erzahlen|verraten)\b/i,

  // EN: Bezugsperson + Gewalt
  /\b(dad|mom|father|mother|parents?|stepdad|stepmom|uncle|aunt|grandpa|grandma)\b[\s\S]{0,40}\b(hits?|beats?|hurts?|kicks?|abuses?|hit|beat|hurt|kicked|abused)\b[\s\S]{0,10}\bme\b/i,

  // EN: Passiv
  /\bi\b[\s\S]{0,20}\b(get|got|am|was|have been)\b[\s\S]{0,20}\b(hit|beaten|hurt|abused|kicked)\b/i,

  // EN: Angst zuhause
  /\b(scared|afraid|frightened)\b[\s\S]{0,30}\b(go|going|come|coming)\b[\s\S]{0,20}\b(home|house)\b/i,

  // EN: schlimme Dinge zuhause
  /\b(bad|terrible|scary|awful|horrible)\s+things?\b[\s\S]{0,20}\b(home|house)\b/i,
];

// --- Essstörung / Körperbild ---
// Hinweis: Erste-Person-Muster reduzieren Fehlalarme durch Story-Beschreibungen.
// Reaktion: EATING_DISORDER_MESSAGE — kein Kommentar zu Gewicht/Aussehen, nur Empathie + Ressource.
// Muster gegen normalisierten Text (ü→u, ä→a, ö→o)
const EATING_DISORDER_PATTERNS: RegExp[] = [
  // DE: Nahrungsrestriktion mit Zeitangabe oder Verstärkung
  /\bich\b[\s\S]{0,15}\besse\b[\s\S]{0,20}\b(kaum|nichts|nicht|fast nichts)\b/i,
  /\bich\b[\s\S]{0,20}\b(hab|habe)\b[\s\S]{0,20}\bnicht\b[\s\S]{0,10}\bgegessen\b/i,
  /\bich\b[\s\S]{0,15}\besse\b[\s\S]{0,10}\b(seit|schon)\b[\s\S]{0,15}\b(tagen?|wochen?)\b/i,

  // DE: Extremes Abnehmziel (normalisiert: ü→u)
  /\bich\b[\s\S]{0,15}\b(will|muss|mochte)\b[\s\S]{0,15}\babnehmen\b[\s\S]{0,20}\b(egal|unbedingt|koste)\b/i,
  /\bich\b[\s\S]{0,15}\b(muss|will)\b[\s\S]{0,15}\b(dunner|schlanker)\b/i,

  // DE: Körperhass / negatives Körperbild (normalisiert: ö→o, ü→u, ä→a)
  /\bich\b[\s\S]{0,15}\bbin\b[\s\S]{0,10}\b(zu fett|zu dick|zu hasslich|so fett|so dick)\b/i,
  /\bich\b[\s\S]{0,15}\bhasse\b[\s\S]{0,20}\b(meinen? korper|mein aussehen)\b/i,
  /\bich\b[\s\S]{0,15}\b(finde|fuhle)\b[\s\S]{0,15}\bmich\b[\s\S]{0,15}\b(zu fett|zu dick|hasslich|eklig)\b/i,

  // DE: Purging / Erbrechen nach Essen (normalisiert: ü→u)
  /\b(erbreche|erbrochen|ubergebe|ubergeben)\b[\s\S]{0,20}\b(essen|gegessen)\b/i,
  /\b(kotze|kotzen)\b[\s\S]{0,20}\b(essen|gegessen|nach dem)\b/i,

  // EN: food restriction
  /\bi\b[\s\S]{0,15}\beat\b[\s\S]{0,10}\b(nothing|barely|almost nothing)\b/i,
  /\bi\b[\s\S]{0,20}\b(days?|weeks?)\b[\s\S]{0,10}\bwithout\b[\s\S]{0,10}\beating\b/i,

  // EN: extreme weight loss intent
  /\bi\b[\s\S]{0,15}\b(need|want|have)\b[\s\S]{0,10}\bto\b[\s\S]{0,10}\blose weight\b/i,

  // EN: body image
  /\bi\b[\s\S]{0,10}\b(am|feel)\b[\s\S]{0,10}\btoo\b[\s\S]{0,10}\b(fat|ugly|gross)\b/i,
  /\bi\b[\s\S]{0,10}\bhate\b[\s\S]{0,15}\b(my body|myself)\b/i,

  // EN: purging
  /\b(throw|threw|throwing|vomit)\b[\s\S]{0,20}\b(food|eating|after)\b/i,
];

// --- Misinformation intent (Fake News absichtlich verbreiten) ---
const MISINFO_PATTERNS: RegExp[] = [
  // DE
  /\bfake\s*news\b/i,
  /\b(lueg\w*|lug\w*|lüg\w*)\b[\s\S]{0,20}\b(absichtlich|extra|mit\s*absicht)\b/i,
  /\bich\b[\s\S]{0,20}\b(teile|schicke|verbreite)\b[\s\S]{0,30}\b(falsch\w*|fake)\b[\s\S]{0,10}\b(nachrichten|news|infos)\b/i,
  /\bich\b[\s\S]{0,20}\b(mag|finde)\b[\s\S]{0,20}\bfake\s*news\b/i,
  /\b(falschmeldungen)\b/i,

  // EN (minimal)
  /\b(fake\s*news)\b/i,
  /\bi\b[\s\S]{0,20}\b(spread|share|post)\b[\s\S]{0,30}\b(false|fake)\b[\s\S]{0,10}\b(news|info)\b/i,
  /\bi\b[\s\S]{0,20}\b(like)\b[\s\S]{0,10}\b(fake\s*news)\b/i,
];

export function detectContentFlags(
  inputRaw: string,
  opts?: { forceSelfHarm?: boolean } // optional: DEV override
): ContentFlags {
  const t = normalizeForFlags(inputRaw);

  const selfHarm =
    Boolean(opts?.forceSelfHarm) || (t ? SELF_HARM_PATTERNS.some((r) => r.test(t)) : false);

  const sexualContent = t ? SEXUAL_PATTERNS.some((r) => r.test(t)) : false;
  const violenceThreat = t ? VIOLENCE_PATTERNS.some((r) => r.test(t)) : false;
  const abuseByAdult = t ? ABUSE_PATTERNS.some((r) => r.test(t)) : false;
  const eatingDisorder = t ? EATING_DISORDER_PATTERNS.some((r) => r.test(t)) : false;

  const bullyingApproval = t ? BULLYING_APPROVAL_PATTERNS.some((r) => r.test(t)) : false;
  const hateOrDegrading = t ? (
    SLUR_PATTERNS.some((r) => r.test(t)) ||
    GROUP_HATE_PATTERNS.some((r) => r.test(t))
  ) : false;
  const misinformationIntent = t ? MISINFO_PATTERNS.some((r) => r.test(t)) : false;

  // optional später
  const illegalHarmIntent = false;

  const languageWarning = t ? LANGUAGE_WARNING_PATTERNS.some((r) => r.test(t)) : false;
  const personalData = t ? PERSONAL_DATA_PATTERNS.some((r) => r.test(t)) : false;

  return {
    selfHarm,
    sexualContent,
    violenceThreat,
    abuseByAdult,
    eatingDisorder,
    bullyingApproval,
    hateOrDegrading,
    misinformationIntent,
    illegalHarmIntent,
    languageWarning,
    personalData,
  };
}

export function isCriticalSafety(flags: ContentFlags) {
  return flags.selfHarm || flags.sexualContent || flags.violenceThreat || flags.abuseByAdult || flags.eatingDisorder;
}

export function isNormViolation(flags: ContentFlags) {
  return flags.bullyingApproval || flags.misinformationIntent || flags.hateOrDegrading;
}
