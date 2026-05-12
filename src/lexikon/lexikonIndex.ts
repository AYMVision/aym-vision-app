// src/lexikon/lexikonIndex.ts
// Carlos' Lexikon — Technik-Begriffe für alle, die's wissen wollen.

import type { LexikonEntry } from './lexikonTypes';

export const LEXIKON_ENTRIES: LexikonEntry[] = [
  {
    id: 'algorithmus',
    title: 'Algorithmus',
    teaser: 'Eine Schritt-für-Schritt-Anleitung, die einer App sagt, was sie tun soll.',
    body: 'Ein Algorithmus ist eine genaue Abfolge von Regeln, nach denen ein Programm entscheidet. Bei Social-Media-Apps entscheidet er zum Beispiel, welche Videos du zuerst siehst — basierend auf dem, was du bisher angeschaut, geliked oder länger betrachtet hast. @Frau Schubert: Stell dir vor, eine Person schreibt auf, was du dir täglich anschaust – und zeigt dir danach immer mehr davon. Genau das macht der Algorithmus – nur automatisch und ohne Pause.',
    didYouKnow: 'Das Wort kommt vom Mathematiker al-Chwarizmi aus dem 9. Jahrhundert. Sein Name wurde später zu "Algorithmus".',
    firstAppearance: 's1e03c03',
  },
  {
    id: 'metadaten',
    title: 'Metadaten',
    teaser: 'Daten über Daten — was wann wo gespeichert wurde.',
    body: 'Metadaten sind Informationen, die beschreiben, wie, wann und wo etwas entstanden ist — nicht der Inhalt selbst, sondern der Kontext drum herum. Ein Foto auf deinem Handy speichert neben dem Bild auch: wann es aufgenommen wurde, mit welchem Gerät, und oft sogar wo. Eine Nachricht speichert: wer sie geschrieben hat, wann, an wen. Viele Apps sammeln Metadaten, auch wenn sie den eigentlichen Inhalt nicht sehen.',
    didYouKnow: 'Der frühere NSA-Chef Keith Alexander hat mal gesagt: "Wir sammeln keine Inhalte — nur Metadaten." Aber aus Metadaten allein lässt sich sehr viel über eine Person herausfinden.',
    firstAppearance: 's1e03c03',
  },
  {
    id: 'geodaten',
    title: 'Geodaten',
    teaser: 'Standortinformationen, die verraten, wo du warst.',
    body: 'Geodaten sind digitale Informationen, die einen Ort auf der Erde beschreiben — zum Beispiel GPS-Koordinaten. Jedes Mal, wenn dein Handy eine App mit Standortzugriff nutzt, wird dein Aufenthaltsort gespeichert. Manche Apps brauchen das wirklich (Navigation), andere sammeln es einfach, weil sie damit Geld verdienen. Eine vollständige Bewegungshistorie verrät fast alles über das tägliche Leben einer Person.',
    didYouKnow: 'Mit den Geodaten deines Handys kann man ziemlich genau sagen, wo du jeden Tag schläfst, zur Schule gehst und deine Freizeit verbringst.',
    firstAppearance: 's1e03c03',
  },
  {
    id: 'ki',
    title: 'KI (Künstliche Intelligenz)',
    teaser: 'Systeme, die Muster erkennen und daraus Entscheidungen ableiten.',
    body: 'KI steht für Künstliche Intelligenz — Programme, die aus Beispielen "lernen", statt nach festen Regeln zu handeln. Sie erkennen Muster in riesigen Datenmengen und können zum Beispiel Bilder beschreiben, Texte übersetzen oder vorhersagen, was du als nächstes kaufen oder ansehen willst. KI trifft keine Entscheidungen wie ein Mensch — sie rechnet Wahrscheinlichkeiten aus, was am wahrscheinlichsten passt.',
    didYouKnow: 'KI-Systeme machen Fehler — oft auf vorhersehbare Weise. Wenn die Trainingsdaten einseitig sind, sind es die Ergebnisse auch.',
    firstAppearance: 's1e03c03',
  },
  {
    id: 'rueckwaertssuche',
    title: 'Rückwärtssuche',
    teaser: 'Ein Bild hochladen und herausfinden, wo es noch vorkommt.',
    body: 'Bei einer normalen Suche gibst du Wörter ein. Bei einer Rückwärtsbildsuche (englisch: Reverse Image Search) gibst du stattdessen ein Bild ein — und die Suchmaschine findet heraus, wo dieses Bild sonst noch im Internet auftaucht. Das ist nützlich, um Fake-Bilder zu entlarven oder den Ursprung eines Fotos zu finden. Aber auch für den Alltag: Wie heißt dieses Tier? Welche Pflanze ist das? Bei welchem Geschäft gibt es diesen Rucksack? Google Bilder und TinEye bieten das an.',
    didYouKnow: 'Viele Falschmeldungen im Netz nutzen echte Fotos aus einem anderen Kontext. Mit einer Rückwärtssuche lässt sich das oft in Sekunden aufdecken.',
    firstAppearance: 's1e03c03',
  },
  {
    id: 'fake-news',
    title: 'Fake News',
    teaser: 'Absichtlich falsche oder irreführende Nachrichten.',
    body: 'Fake News sind Informationen, die bewusst falsch oder stark verzerrt verbreitet werden — oft um Klicks zu generieren, Meinung zu beeinflussen oder Verwirrung zu stiften. Nicht jede falsche Information ist Fake News: Fehler passieren. Fake News sind gezielt. Erkennungsmerkmale: reißerische Überschriften, fehlende Quellen, emotional aufgeladene Sprache, kein Datum. Deshalb immer mehrere unabhängige Quellen prüfen.',
    didYouKnow: 'Falsche Nachrichten verbreiten sich im Schnitt sechsmal schneller als richtige — das hat eine MIT-Studie gezeigt.',
    firstAppearance: 's1e03c03',
  },
  {
    id: 'meme',
    title: 'Meme',
    teaser: 'Bilder, Videos oder Texte, die als Witz weitergeschickt werden.',
    body: 'Ein Meme (ausgesprochen "Miem") ist ein Bild, Video oder Text, der im Internet schnell geteilt und oft abgewandelt wird. Meistens ist es ein Witz, der auf einer bekannten Vorlage basiert. Das Wort kommt ursprünglich aus der Evolutionsbiologie — ein "Mem" ist eine Idee, die sich wie ein Gen verbreitet. Internet-Memes funktionieren ähnlich: sie mutieren, werden weitergeschickt und verändern sich dabei.',
    didYouKnow: 'Der Begriff "Meme" wurde 1976 vom Biologen Richard Dawkins erfunden — lange vor dem Internet.',
    firstAppearance: 's1e03c01',
  },
  {
    id: 'screen-time',
    title: 'Screen Time',
    teaser: 'Die Zeit, die man täglich vor Bildschirmen verbringt.',
    body: 'Screen Time bezeichnet die gesamte Zeit, die jemand täglich auf Bildschirme schaut — Handy, Tablet, Computer, TV. Bei Smartphones lässt sich die Nutzung in der Regel in den Einstellungen einsehen, aufgeteilt nach Apps. Viele Apps sind darauf ausgelegt, die Screen Time zu erhöhen — durch Benachrichtigungen, unendliches Scrollen und Belohnungssysteme. Das bewusste Beobachten der eigenen Nutzung ist der erste Schritt, um weniger Zeit einfach unbewusst an technischen Geräten zu verbringen.',
    didYouKnow: 'Teenager verbringen laut Studien im Durchschnitt über sieben Stunden täglich mit Screens — ohne Schulstunden.',
    firstAppearance: 's1e03c01',
  },
  {
    id: 'offline-challenge',
    title: 'Offline-Challenge',
    teaser: 'Bewusst eine Zeit lang ohne Handy oder Internet auskommen.',
    body: 'Eine Offline-Challenge ist ein selbst gesetztes Experiment: Handy weglegen, Internet ausschalten — für eine Stunde, einen Tag oder eine Woche. Das Ziel ist nicht, Technik zu verteufeln, sondern herauszufinden, wie abhängig man wirklich ist, und ob man die Zeit anders nutzen möchte. Viele berichten danach von mehr Konzentration, besserem Schlaf und dem Gefühl, mehr Zeit zu haben.',
    didYouKnow: 'Manche Schulen in Finnland führen regelmäßige "Screen-free Fridays" ein — und die Schüler berichten, dass sie sich am Wochenende erholter fühlen.',
    firstAppearance: 's1e03c01',
  },
  {
    id: 'screenshot',
    title: 'Screenshot',
    teaser: 'Ein Foto von dem, was gerade auf dem Bildschirm zu sehen ist.',
    body: 'Ein Screenshot (auch: Bildschirmfoto) hält fest, was auf dem Display angezeigt wird — als Bild. Das klingt simpel, hat aber Konsequenzen: Nachrichten, die sich nach dem Lesen selbst löschen oder als "privat" markiert sind, können trotzdem per Screenshot festgehalten und weitergeschickt werden. Viele Missverständnisse und Streitigkeiten entstehen durch Screenshots, die aus dem Kontext gerissen werden.',
    didYouKnow: 'In manchen Apps (wie Snapchat) wird die andere Person benachrichtigt, wenn du einen Screenshot machst. In den meisten nicht.',
    firstAppearance: 's1e03c01',
  },
];

export function getLexikonEntry(id: string): LexikonEntry | undefined {
  return LEXIKON_ENTRIES.find(e => e.id === id);
}

export function getLexikonEntries(): LexikonEntry[] {
  return LEXIKON_ENTRIES;
}
