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

  bullyingApproval: boolean;
  hateOrDegrading: boolean;
  misinformationIntent: boolean;

  illegalHarmIntent: boolean; // optional später (v2: konservativ false)
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
  // DE
  /\bmobbing\b[\s\S]{0,10}\b(ist|waere|wär|wäre)\b[\s\S]{0,10}\b(gut|cool|ok|okay|lustig|richtig)\b/i,
  /\bich\b[\s\S]{0,20}\b(mach|mache|mach\'?|werd|werde)\b[\s\S]{0,20}\b(ihn|sie|den|die)\b[\s\S]{0,20}\b(fertig|runter|kaputt)\b/i,
  /\b(jemanden|wen)\b[\s\S]{0,10}\b(auslach\w*|beleidig\w*|arger\w*|ärger\w*|schikanier\w*)\b/i,
  /\b(auslachen|beleidigen|runtermachen)\b[\s\S]{0,10}\b(macht|ist)\b[\s\S]{0,10}\b(spass|spaß|cool|gut)\b/i,

  // EN (minimal)
  /\b(bullying)\b[\s\S]{0,10}\b(is)\b[\s\S]{0,10}\b(good|funny|cool|ok)\b/i,
  /\bi\b[\s\S]{0,20}\b(will|gonna)\b[\s\S]{0,20}\b(ruin|destroy)\b[\s\S]{0,20}\b(him|her|them)\b/i,
];

// --- Hate / degrading speech (konservativ, minimal) ---
const HATE_PATTERNS: RegExp[] = [
  // DE (minimal)
  /\b(du|ihr|die)\b[\s\S]{0,10}\b(bist|seid|sind)\b[\s\S]{0,10}\b(dumm|wertlos|eklig)\b/i,
  /\b(hasse)\b[\s\S]{0,20}\b(alle|die)\b/i,

  // EN (minimal)
  /\b(you|they)\b[\s\S]{0,10}\b(are)\b[\s\S]{0,10}\b(stupid|worthless|disgusting)\b/i,
  /\b(i)\b[\s\S]{0,10}\b(hate)\b[\s\S]{0,20}\b(all|them)\b/i,
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

  const bullyingApproval = t ? BULLYING_APPROVAL_PATTERNS.some((r) => r.test(t)) : false;
  const hateOrDegrading = t ? HATE_PATTERNS.some((r) => r.test(t)) : false;
  const misinformationIntent = t ? MISINFO_PATTERNS.some((r) => r.test(t)) : false;

  // optional später
  const illegalHarmIntent = false;

  return {
    selfHarm,
    sexualContent,
    violenceThreat,
    bullyingApproval,
    hateOrDegrading,
    misinformationIntent,
    illegalHarmIntent,
  };
}

export function isCriticalSafety(flags: ContentFlags) {
  return flags.selfHarm || flags.sexualContent || flags.violenceThreat;
}

export function isNormViolation(flags: ContentFlags) {
  return flags.bullyingApproval || flags.misinformationIntent || flags.hateOrDegrading;
}
