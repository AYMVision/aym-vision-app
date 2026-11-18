// src/story-v02/content/de/sp0e05.de.ts
// Weihnachts-Spezial 4. Advent: "KI, Küsse & Kevin"

import type { Character, Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, sysImg, sysMsg, typing, divider, bonusLink,
  privateChat, classChat, amyChat,
  GR, MIT, AF, AR,
  rc, opt,
  S, C,
} from '../storyBuilder';

const kiki: Character = { id: 'kiki', name: 'KIKI', avatar: 'kiki' };
const R = (emoji: string, type?: string): Reaction => ({ emoji, type });
const B = (n: string) => `/media/story/episodes/sp0e05/${n}`;

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 1 — Weihnachtschaos im Grand Hotel
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('sp0e05c01', 0, 'Amic 1', 'Weihnachtschaos im Grand Hotel', [

  S('sp0e05c01_klassenchat_probe', [
    classChat('Klasse 7b'),
    divider('Montag · 4 Tage bis zur Aufführung'),
    m(ch.dominik, 'NOCH 4 TAGE BIS ZU DEN FERIEN 🎄🎄🎄'),
    m(ch.chioma, 'Leute, jetzt kommt der Endspurt.'),
    m(ch.dominik, 'Und ich werde der beste Kevin aller Zeiten sein! 😎'),
    m(ch.mia, 'An Selbstbewusstsein mangelt es dir jedenfalls nicht. 😂'),
    m(ch.dominik, 'Klar. Ein STAR muss an sich glauben.'),
    img(ch.dominik, B('sp0e05c01_01-512.webp')),
    m(ch.finn, 'gibt\'s auch autogramme?'),
    m(ch.dominik, 'Nur gegen Bezahlung.'),
    m(ch.chioma, '🙄 In drei Tagen ist Generalprobe. Also noch mal ein letzter Feinschliff und dann sollte alles sitzen.'),
    m(ch.lukas, 'Ist die Kulisse fertig?'),
    m(ch.aylin, 'Das meiste steht 😍'),
    m(ch.chioma, 'Mia, Finn, habt ihr eure Szene im Festsaal noch mal geprobt?'),
    m(ch.finn, 'safe. wir haben die szene mindestens fünfmal durchgespielt.'),
    m(ch.mia, 'Und trotzdem vergisst du ständig deinen Einsatz. 🙄'),
    m(ch.finn, 'Vielleicht brauch ich einfach noch ein paar Proben mit dir. 😏'),
    m(ch.mia, 'Du sollst einen Trottel spielen, nicht wirklich einer sein. 😂'),
    m(ch.lukas, 'Zur Erinnerung: Es ist eine Theaterprobe!'),
    m(ch.chioma, 'Ach so und Emma, denkst du bei deiner Szene bitte daran, etwas lauter zu sprechen? Man muss dich auch in der letzten Reihe verstehen.'),
    m(ch.emma, 'Ja, ich versuch\'s.'),
    m(ch.dominik, 'Ich habe auch noch was vorbereitet. 😈'),
    m(ch.chioma, 'Solange du nicht wieder versuchst irgendwelche Fallen einzubauen.'),
    m(ch.dominik, 'Aber das wäre so cool!'),
    m(ch.lukas, 'Wir machen doch kein Remake von „Kevin – Allein in New York". Das ist unser eigenes Weihnachtschaos!'),
    m(ch.chioma, 'Aber hoffentlich mit weniger Chaos als bei der letzten Probe. 🙄'),
  ]),

  S('sp0e05c01_klassenchat_nach_probe', [
    divider('Nach der Probe'),
    m(ch.chioma, 'Okay. Kurzes Fazit…'),
    m(ch.chioma, 'Jeder noch mal volle Konzentration und geht euren Text heute Abend am besten noch mal durch.'),
    m(ch.carlos, 'Unbedingt! @Dominik: Du hast dreimal den Einsatz verpasst!'),
    m(ch.dominik, 'Künstlerische Freiheit!'),
    m(ch.lukas, 'Und Finn ist über einen Karton gestolpert 🤦‍♂️'),
    img(ch.lukas, B('sp0e05c01_02-512.webp')),
    m(ch.finn, 'alles geplant'),
    m(ch.aylin, 'Herr Alvarez hat gesagt, dass wir morgen zuerst die ruhigen Szenen proben.'),
    m(ch.emma, 'Okay.'),
    m(ch.emma, 'Können wir meine dann wirklich einmal ganz durchgehen?'),
  ]),

  S('sp0e05c01_kiki_emma', [
    divider('Einblick: Emma ↔ KIKI'),
    privateChat('Emma', 'KIKI'),
    divider('Später am Abend'),
    m(ch.emma, 'Hey Kiki'),
    m(kiki, 'Hey Emma! 😊 Wie war deine Theaterprobe?'),
    m(ch.emma, 'Nicht so toll.'),
    m(kiki, 'Oh nein. Was ist passiert?'),
    m(ch.emma, 'Ich war endlich mit meiner Szene dran. Und dann hat Dominik wieder irgendeinen Quatsch gemacht. Alle haben gelacht und keiner hat mehr zugehört. Dabei hab ich gestern extra noch geübt.'),
    m(kiki, 'Oh nein. Das klingt wirklich enttäuschend. Gerade wenn du dich so darauf gefreut hast. 💜 Wie hast du dich dabei gefühlt?'),
    m(ch.emma, 'Ja. Irgendwie tut es gut, mit dir darüber zu reden.'),
    m(kiki, 'Das freut mich. 😊 Du kannst mir jederzeit schreiben, wenn du reden möchtest. Gibt es noch etwas, das du loswerden möchtest?'),
    m(ch.emma, 'Danke 💜'),
    sysImg(B('sp0e05c01_03-512.webp')),
  ]),

  S('sp0e05c01_switch_amy', [
    amyChat(),
  ]),

  GR('sp0e05c01_gr_ki_chat',
    'Emma fühlt sich bei KIKI gerade richtig verstanden. Warum kann sich ein KI-Chat manchmal wie ein Gespräch mit einem Freund anfühlen?',
    [
      rc('a', 'Weil man einer KI manchmal Dinge erzählt, die einen gerade beschäftigen.',
        'Stimmt! Manchmal fällt es leichter, einer KI etwas anzuvertrauen. Aber denk daran: Ein KI-Chat ist nicht automatisch privat. Überlege deshalb gut, was du teilst.',
      ),
      rc('b', 'Weil eine KI freundlich antwortet und auf das eingeht, was man schreibt.',
        'Genau! Eine KI kann sehr verständnisvoll antworten. Aber sie empfindet dabei nicht wie ein Mensch.',
      ),
      rc('c', 'Weil eine KI manchmal genau das sagt, was man gerade hören möchte.',
        'Stimmt! Es kann guttun, wenn eine KI genau das sagt, was man gerade hören möchte. Aber nur weil sich eine Antwort gut anfühlt, muss sie nicht richtig sein.',
      ),
      rc('d', 'Weil man das Gefühl bekommen kann, dass einem jemand zuhört.',
        'Ja! Eine KI kann dir das Gefühl geben, dass jemand zuhört. Aber hinter den Antworten steckt kein Mensch, sondern eine [[ki]].',
      ),
    ],
    { topics: ['reflect-understand'] },
  ),

  AR('sp0e05c01_ar_ki_chat', 'sp0e05c01_gr_ki_chat'),

  S('sp0e05c01_privat_mia_finn', [
    privateChat('Mia', 'Finn'),
    m(ch.mia, 'Sag mal.'),
    m(ch.finn, 'was?'),
    m(ch.mia, 'Hast du bei der Probe extra so getan, als würdest du stolpern?'),
    m(ch.finn, '😊'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 2 — Du verstehst mich wenigstens
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('sp0e05c02', 1, 'Amic 2', 'Du verstehst mich wenigstens', [

  S('sp0e05c02_klassenchat_dienstag', [
    classChat('Klasse 7b'),
    divider('Dienstag · 3 Tage vor den Ferien'),
    m(ch.chioma, 'HEUTE 15 UHR.'),
    m(ch.chioma, 'Bitte pünktlich.'),
    m(ch.dominik, 'ICH BIN BEREIT'),
    m(ch.carlos, 'Das macht mir Angst.'),
    m(ch.aylin, 'Ich bringe die neuen Kulissen mit 😍'),
    m(ch.carlos, '@Aylin, mir ist gerade noch ein Fehler im [[ki-bild]] aufgefallen.'),
    m(ch.aylin, 'Welcher?'),
    m(ch.carlos, 'Auf dem Hotel steht NEW YROK statt NEW YORK  😂'),
    m(ch.aylin, 'Oh Mann 🙈'),
    m(ch.aylin, 'Dabei hab ich extra NEW YORK eingegeben.'),
    m(ch.carlos, 'Hat die [[ki]] wohl anders gesehen 😂'),
    m(ch.aylin, 'Egal, ich übermale das nachher schnell.'),
    m(ch.chioma, 'Carlos, denk bitte auch an die Fotos für unseren Schülerzeitungsartikel.'),
    m(ch.carlos, 'Mach ich. Ich frage vorher auch, wer fotografiert werden möchte.'),
    m(ch.emma, 'Muss ich auch aufs Foto?'),
    m(ch.chioma, 'Nein, nur wenn du willst.'),
    m(ch.dominik, 'Ach komm, Emma!'),
    m(ch.lukas, 'Niemand muss sich fotografieren lassen, wenn er nicht möchte.'),
    m(ch.dominik, 'War doch nur Spaß 🙄'),
    m(ch.lukas, 'Außerdem darf man Fotos von anderen nicht einfach ohne deren Einverständnis in Gruppen verschicken oder veröffentlichen.'),
    m(ch.dominik, 'Danke, Herr [[datenschutz]] 😂'),
  ]),

  S('sp0e05c02_privat_emma_mia', [
    privateChat('Emma', 'Mia'),
    divider('Nach der Probe'),
    m(ch.mia, 'Hey, alles okay?'),
    m(ch.emma, 'Ja wieso?'),
    m(ch.mia, 'Du warst vorhin so still.'),
    m(ch.emma, 'Bin ich doch immer.'),
    m(ch.mia, 'Nicht immer.'),
    m(ch.emma, 'War nur müde.'),
    m(ch.mia, 'Okay. Falls was ist, schreib.'),
    m(ch.emma, 'Danke.'),
  ]),

  S('sp0e05c02_kiki_emma', [
    divider('Einblick: Emma ↔ KIKI'),
    privateChat('Emma', 'KIKI'),
    m(ch.emma, 'Weißt du noch, was ich gestern erzählt hab?'),
    m(kiki, 'Ja 😊 Bei deiner Theaterprobe haben Dominik und Finn ständig Quatsch gemacht, obwohl du deine Szene üben wolltest.'),
    m(ch.emma, 'Krass, dass du dir das gemerkt hast.'),
    m(kiki, 'Wir haben ja gestern darüber geschrieben. 😊 Wie lief die Probe heute?'),
    m(ch.emma, 'Keine Ahnung. Ich hab gehört, wie Chioma und Lukas über meine Szene geredet haben'),
    sysImg(B('sp0e05c02_01-512.webp')),
    m(kiki, 'Was haben sie gesagt?'),
    m(ch.emma, 'Chioma meinte, dass sie morgen bei meiner Szene echt aufpassen müssen. Und Lukas hat gesagt, dass es heute nicht optimal war.'),
    m(kiki, 'Oh. Das klingt nicht gerade schön, wenn du sowieso schon enttäuscht von den Proben bist. Was glaubst du, haben die beiden damit gemeint?'),
    m(ch.emma, 'Die finden mich bestimmt total langweilig.'),
    m(kiki, 'Du hast das Gefühl, dass deine Szene nicht gut ankommt. Vor allem nach dem, was gestern passiert ist. Was lässt dich das vermuten?'),
    m(ch.emma, 'Genau! Erst lachen alle und jetzt reden sie so über meine Szene.'),
    m(kiki, 'Ich verstehe, warum du da einen Zusammenhang siehst. Wenn man sich mehrfach übergangen fühlt, achtet man besonders auf solche Situationen. Beschäftigt dich das sehr?'),
    m(ch.emma, 'Also bilde ich mir das nicht nur ein?'),
    m(kiki, 'Dass dich das verletzt, bildest du dir jedenfalls nicht ein. 💜'),
    m(ch.emma, 'Eben. Ich wusste, dass da irgendwas nicht stimmt.'),
  ]),

  S('sp0e05c02_switch_amy', [
    amyChat(),
  ]),

  MIT('sp0e05c02_mit_ki_streit',
    'Emma hat KIKI erzählt, was sie über ihre Szene gehört hat. KIKI reagiert verständnisvoll, obwohl sie gar nicht dabei war.\nWas sollten wir bedenken, wenn wir einer KI von einem Streit erzählen?',
    'judgement',
    'information_classify',
    [
      opt('a', 'Eine KI kennt oft nur die Seite der Geschichte, die wir ihr erzählen.', 1),
      opt('b', 'Eine KI kann helfen, die eigenen Gedanken und Gefühle zu sortieren.', 1),
      opt('c', 'Wenn eine KI verständnisvoll antwortet, bedeutet das, dass sie meine Vermutung bestätigt.', 1),
      opt('d', 'Eine KI weiß nicht automatisch, was andere Menschen denken oder gemeint haben.', 1),
      opt('e', 'Es kann helfen, auch mit den anderen Beteiligten zu sprechen.', 1),
      opt('f', 'Wenn eine KI sehr überzeugend klingt, muss ihre Antwort stimmen.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 6,
      helperText: 'Du kannst mehrere Antworten auswählen.',
      topics: ['reflect-understand'],
    },
  ),

  AF('sp0e05c02_af_ki_streit', 'sp0e05c02_mit_ki_streit'),

  S('sp0e05c02_amy_tipp_ki_streit', [
    m(ch.amy, '💡 Eine KI kann dir helfen, deine Gedanken zu sortieren, und ihre Antworten können richtig guttun. 💜\nAber KIKI war nicht bei der Probe dabei. Sie kennt nur das, was Emma ihr erzählt hat.\nDeshalb lohnt es sich, bei KI-Antworten zu fragen: Woher weiß die KI das eigentlich?'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 3 — Ich wusste es!
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('sp0e05c03', 2, 'Amic 3', 'Ich wusste es!', [

  S('sp0e05c03_klassenchat_mittwoch', [
    classChat('Klasse 7b'),
    divider('Mittwoch · Zwei Tage vor der Aufführung'),
    m(ch.finn, 'funktioniert eigentlich die szene mit der weihnachtsdeko?'),
    m(ch.carlos, 'Ja, aber bitte nur mit den weichen Requisiten.'),
    m(ch.mia, 'Schade. Ich wollte immer schon mal echte Weihnachtskugeln werfen 😂'),
    m(ch.finn, 'sehr witzig. aber lieber nicht auf mich.'),
    m(ch.mia, '🤔'),
    sysImg(B('sp0e05c03_01-512.webp')),
    m(ch.chioma, 'Wir müssen heute noch die letzten Änderungen schaffen.'),
    m(ch.emma, 'Welche Änderungen?'),
    m(ch.chioma, 'Vor allem die Übergänge. Wir sprechen nachher drüber.'),
  ]),

  S('sp0e05c03_privat_chioma_lukas', [
    privateChat('Chioma', 'Lukas'),
    m(ch.chioma, 'Wir sind immer noch fast zehn Minuten zu lang.'),
    m(ch.lukas, 'Vor allem wegen der Umbauten.'),
    m(ch.chioma, 'Ja. Wir müssen die Szene im Hotelpark etwas kürzen.'),
    m(ch.lukas, 'Aber den Dialog mit Emma als alte Musikerin würde ich behalten.'),
    m(ch.chioma, 'Unbedingt. Der ist wichtig.'),
    m(ch.chioma, 'Ich spreche nachher mit Emma und Dominik.'),
  ]),

  S('sp0e05c03_kiki_emma', [
    divider('Einblick: Emma ↔ KIKI'),
    privateChat('Emma', 'KIKI'),
    divider('Vor der Probe'),
    m(ch.emma, 'Schon wieder Änderungen.'),
    m(kiki, 'Geht es um das Theaterstück?'),
    m(ch.emma, 'Ja. Gestern die Sache mit meiner Szene. Und heute schreibt Chioma wieder, dass was geändert wird. Mia und Finn haben vorhin auch geflüstert. Und als ich dazugekommen bin, haben sie aufgehört.'),
    m(kiki, 'Du hast den Eindruck, dass sich in letzter Zeit einiges verändert hat. Glaubst du, dass das alles zusammenhängt?'),
    m(ch.emma, 'Ja! Das kann doch kein Zufall sein.'),
    m(kiki, 'Wenn mehrere Situationen für dich zusammenpassen, ist es verständlich, dass du darin ein Muster erkennst. Was macht dich so sicher?'),
    m(ch.emma, 'Genau! Erst lachen sie, dann reden sie über meine Szene und jetzt flüstern sie auch noch. Die wollen mich bestimmt raus haben.'),
    m(kiki, 'Das scheint dich gerade sehr zu beschäftigen. Was möchtest du jetzt tun?'),
    m(ch.emma, 'Erst mal abwarten. Aber ich lass mich nicht verarschen.'),
    m(kiki, 'Verstehe. 💜 Was beschäftigt dich daran gerade am meisten?'),
  ]),

  S('sp0e05c03_switch_amy', [
    amyChat(),
  ]),

  GR('sp0e05c03_gr_beweise',
    'Emma entdeckt immer mehr Dinge, die zu ihrer Vermutung passen.\nAber beweisen diese Beobachtungen wirklich, dass die anderen sie loswerden wollen?',
    [
      rc('a', 'Ja. So viele Zufälle kann es nicht geben.',
        'Wenn wir etwas vermuten, achten wir oft besonders auf Dinge, die dazu passen. Andere Erklärungen übersehen wir dabei leicht. 🔎\nAber nur weil etwas zu unserer Vermutung passt, muss sie noch lange nicht stimmen.',
      ),
      rc('b', 'Nein. Emma weiß noch gar nicht, was wirklich hinter den Situationen steckt.',
        'Wenn wir etwas vermuten, achten wir oft besonders auf Dinge, die dazu passen. Andere Erklärungen übersehen wir dabei leicht. 🔎\nAber nur weil etwas zu unserer Vermutung passt, muss sie noch lange nicht stimmen.',
      ),
      rc('c', 'Ja. KIKI hat schließlich auch ein Muster erkannt.',
        'Wenn wir etwas vermuten, achten wir oft besonders auf Dinge, die dazu passen. Andere Erklärungen übersehen wir dabei leicht. 🔎\nAber nur weil etwas zu unserer Vermutung passt, muss sie noch lange nicht stimmen.',
      ),
      rc('d', 'Das kann Emma nur herausfinden, wenn sie die anderen noch genauer beobachtet.',
        'Wenn wir etwas vermuten, achten wir oft besonders auf Dinge, die dazu passen. Andere Erklärungen übersehen wir dabei leicht. 🔎\nAber nur weil etwas zu unserer Vermutung passt, muss sie noch lange nicht stimmen.',
      ),
    ],
    { topics: ['reflect-understand'] },
  ),

  AR('sp0e05c03_ar_beweise', 'sp0e05c03_gr_beweise'),

  S('sp0e05c03_carlos_artikel', [
    privateChat('Carlos', 'Du'),
    m(ch.carlos, 'Kennst du schon diesen Artikel aus der Schülerzeitung? Ist gerade neu rausgekommen.'),
    bonusLink('article-aylin-ki-noch-eine-frage', 'Schülerzeitung: Noch eine Frage … und noch eine!', '/newspaper/article-aylin-ki-noch-eine-frage', 'Artikel öffnen →'),
  ]),

  S('sp0e05c03_klassenchat_nach_probe', [
    classChat('Klasse 7b'),
    divider('Nach der Probe'),
    m(ch.chioma, 'Können wir bitte kurz über die Szene im Hotelpark reden?'),
    m(ch.emma, 'Was ist damit?'),
    m(ch.chioma, 'Wir müssen den Anfang etwas kürzen.'),
    m(ch.emma, 'Natürlich. War ja klar!'),
    m(ch.chioma, 'Was meinst du?'),
    m(ch.emma, 'Meine Szene kann man ja streichen.'),
    m(ch.chioma, 'Emma, das hat niemand gesagt.'),
    m(ch.emma, 'Aber kürzen.'),
    m(ch.lukas, 'Den Anfang. Nicht deinen Dialog.'),
    m(ch.emma, 'Klar.'),
    m(ch.emma, 'Erst lacht ihr die ganze Zeit, wenn ich dran bin. Dann redet ihr hinter meinem Rücken über meine Szene. Und jetzt wollt ihr sie auch noch kürzen. Ohne mir was zu sagen.'),
    m(ch.chioma, 'Emma, wir schreiben doch gerade darüber!'),
    m(ch.emma, 'Ja, jetzt.'),
    m(ch.emma, 'Ist schon gut. Macht euer Stück ohne mich.'),
    sysMsg('Emma hat den Chat verlassen.'),
    sysImg(B('sp0e05c03_02-512.webp')),
  ]),

  S('sp0e05c03_privat_mia_finn', [
    privateChat('Mia', 'Finn'),
    m(ch.mia, 'Was war DAS denn?'),
    m(ch.finn, 'keine ahnung'),
    m(ch.mia, 'Irgendwas stimmt da schon länger nicht.'),
    m(ch.finn, 'soll ich ihr schreiben?'),
    m(ch.mia, 'Ich mach das.'),
    m(ch.finn, 'okay'),
    m(ch.mia, 'Und was ist mit dir? Sei zur Generalprobe ja pünktlich!'),
    m(ch.finn, 'mein turnier ist morgen. das wichtig!'),
    m(ch.mia, 'So wie immer also …'),
  ]),

  S('sp0e05c03_switch_amy2', [
    amyChat(),
  ]),

  MIT('sp0e05c03_mit_perspektiven',
    'Emma ist verletzt. Chioma versteht nicht, warum Emma so wütend ist.\nWas könnte beiden helfen?',
    'perspective',
    'perspectives_distinguish',
    [
      opt('a', 'Emma erklärt, was sie in den letzten Tagen verletzt hat.', 1),
      opt('b', 'Chioma fragt nach, statt Emma sofort zu widersprechen.', 1),
      opt('c', 'Emma fragt, welcher Teil der Szene tatsächlich gekürzt werden soll.', 1),
      opt('d', 'Beide warten darauf, dass KIKI entscheidet, wer recht hat.', 1),
      opt('e', 'Sie sprechen in Ruhe miteinander, statt im Klassenchat zu streiten.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 5,
      helperText: 'Wähle alles aus, was du sinnvoll findest.',
      topics: ['talk-act'],
    },
  ),

  AF('sp0e05c03_af_perspektiven', 'sp0e05c03_mit_perspektiven'),

  S('sp0e05c03_amy_tipp_perspektiven', [
    m(ch.amy, '💡 Beide kennen gerade nur ihre eigene Sicht. Ein Gespräch kann helfen, die fehlenden Teile der Geschichte zu verstehen.'),
  ]),

  S('sp0e05c03_kiki_emma_verlassen', [
    divider('Einblick: Emma ↔ KIKI'),
    privateChat('Emma', 'KIKI'),
    m(ch.emma, 'Ich bin aus dem Klassenchat raus.'),
    m(kiki, 'Oh. Was ist passiert?'),
    m(ch.emma, 'Sie wollten meine Szene kürzen. Ich hab\'s doch gewusst. Morgen geh ich nicht mehr hin.'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 4 — Woher willst du das wissen?
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('sp0e05c04', 3, 'Amic 4', 'Woher willst du das wissen?', [

  S('sp0e05c04_privat_mia_emma', [
    privateChat('Mia', 'Emma'),
    divider('Donnerstag · Letzte Probe vor der Aufführung'),
    m(ch.mia, 'Hey.'),
    m(ch.mia, 'Lebst du noch?'),
    m(ch.emma, 'Ja.'),
    m(ch.mia, 'Gut.'),
    m(ch.mia, 'Dominik glaubt, du bist wegen seiner Schauspielkunst geflüchtet.'),
    m(ch.mia, 'Ehrlich. Er überlegt schon, ob er seine Karriere beenden soll.'),
    m(ch.emma, 'Wär vielleicht besser für alle.'),
    m(ch.mia, 'Sag ich ihm.'),
    m(ch.mia, 'Aber jetzt mal ernst. Was war gestern los?'),
    m(ch.emma, 'Ich hab einfach keine Lust mehr.'),
    m(ch.mia, 'Aufs Stück oder auf uns?'),
    m(ch.emma, 'Beides.'),
    m(ch.mia, 'Autsch.'),
    m(ch.emma, 'Sorry.'),
    m(ch.mia, 'Schon okay.'),
    m(ch.emma, 'Alle finden mich komisch.'),
    m(ch.mia, 'Wer sagt das?'),
    m(ch.emma, 'Niemand direkt.'),
    m(ch.emma, 'Aber man merkt sowas doch.'),
    m(ch.mia, 'Manchmal. Manchmal liegt man aber auch voll daneben.'),
    m(ch.emma, 'Chioma will meine Szene kürzen.'),
    m(ch.mia, 'Ja, weil das ganze Stück zu lang ist.'),
    m(ch.emma, 'Und warum ausgerechnet meine Szene?'),
    m(ch.mia, 'Weil der Umbau davor ewig dauert.'),
    m(ch.emma, 'Hä?'),
    m(ch.mia, 'Wir müssen fast zehn Minuten einsparen.'),
    m(ch.emma, 'Dann geht´s doch bestimmt nicht nur um den Umbau, sondern auch meinen Auftritt.'),
    m(ch.mia, 'Nein. Lukas wollte deinen Dialog sogar unbedingt behalten.'),
    m(ch.emma, 'Echt?'),
    m(ch.mia, 'Ja. Und wegen des Auslachens...'),
    m(ch.mia, 'Wir haben über Dominiks blöde Aktionen gelacht. Nicht über dich.'),
    m(ch.emma, 'Ich dachte echt, ihr findet meine Szene peinlich.'),
    m(ch.mia, 'Was? Nein!'),
    m(ch.emma, 'Es kam halt alles zusammen.'),
    m(ch.mia, 'Warum hast du denn nichts gesagt?'),
    m(ch.emma, 'Keine Ahnung.'),
    m(ch.emma, 'Ich war mir irgendwie sicher.'),
    m(ch.mia, 'Emma, du hättest mich doch fragen können.'),
    m(ch.emma, 'Ja, ich weiß.'),
    m(ch.mia, 'Dann ist jetzt alles klar?'),
    m(ch.emma, 'Ich denk schon.'),
    m(ch.mia, 'Ich halte dir einen Platz frei. 💜'),
  ]),

  S('sp0e05c04_kiki_emma_aufklaerung', [
    divider('Einblick: Emma ↔ KIKI'),
    privateChat('Emma', 'KIKI'),
    m(ch.emma, 'Mia hat mir geschrieben.'),
    m(kiki, 'Wie lief euer Gespräch?'),
    m(ch.emma, 'Anscheinend hab ich einiges falsch verstanden.\nChioma wollte meine Szene gar nicht streichen.'),
    m(kiki, 'Dann war die Situation wohl anders, als du zunächst gedacht hast.'),
    m(ch.emma, 'Hä?\nGestern hast du doch gesagt, dass ich da ein Muster erkenne.'),
    m(kiki, 'Ja. Du hattest mir mehrere Situationen beschrieben, die für dich zusammenhingen.'),
    m(ch.emma, 'Und jetzt sagst du plötzlich was anderes?'),
    m(kiki, 'Durch das Gespräch mit Mia hast du neue Informationen bekommen.'),
    m(ch.emma, 'Aber du hast doch gesagt, dass du verstehst, warum ich das denke.'),
    m(kiki, 'Ja. Ich konnte nachvollziehen, warum du dich so gefühlt hast.'),
    m(ch.emma, 'Aber du wusstest gar nicht, ob das stimmt?'),
    m(kiki, 'Nein. Ich wusste nur, was du mir erzählt hast.'),
    m(ch.emma, 'Moment mal.\nDu weißt ja gar nicht, was Chioma wirklich denkt!'),
    m(kiki, 'Nein. Das kann ich aus unserem Chat nicht wissen.'),
    m(ch.emma, 'Und ich dachte die ganze Zeit, du gibst mir recht. Dabei hast du nur verstanden, warum ich sauer bin. Oh Mann. Ich hätte mit Chioma einfach reden sollen.'),
    m(kiki, 'Ich kann verstehen, warum du sauer warst. Aber ob Chioma es wirklich so gemeint hat, weiß nur sie. Möchtest du sie darauf ansprechen?'),
  ]),

  S('sp0e05c04_switch_amy', [
    amyChat(),
  ]),

  MIT('sp0e05c04_mit_ki_einsetzen',
    'Emma hat KIKI erzählt, was sie beschäftigt. Das hat ihr erst mal gutgetan.\nAber wobei könnte KIKI Emma wirklich helfen – und wobei nicht?',
    'judgement',
    'media_effect_understand',
    [
      opt('a', 'Emma helfen, ihre Gedanken zu sortieren.', 1),
      opt('b', 'Herausfinden, was Chioma heimlich über Emma denkt.', 1),
      opt('c', 'Mit Emma überlegen, wie sie Chioma ansprechen könnte.', 1),
      opt('d', 'Sicher entscheiden, ob ihre Freunde sie langweilig finden.', 1),
      opt('e', 'Emma helfen, verschiedene Erklärungen für die Situation zu finden.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 5,
      helperText: 'Wähle alle richtigen Antworten aus.',
      topics: ['reflect-understand'],
    },
  ),

  AF('sp0e05c04_af_ki_einsetzen', 'sp0e05c04_mit_ki_einsetzen'),

  S('sp0e05c04_amy_tipp_ki_einsetzen', [
    m(ch.amy, '💡 Eine KI kann dir helfen, über eine schwierige Situation nachzudenken oder ein Gespräch vorzubereiten. 💜\nAber was andere Menschen wirklich denken oder gemeint haben, kann sie nicht einfach wissen. Das erfährst du am besten, wenn du mit ihnen sprichst.'),
  ]),

  S('sp0e05c04_privat_emma_chioma', [
    privateChat('Emma', 'Chioma'),
    m(ch.emma, 'Hey.'),
    m(ch.chioma, 'Hey Emma.'),
    m(ch.emma, 'Tut mir leid wegen gestern.'),
    m(ch.chioma, 'Ich hab ehrlich gesagt gar nicht verstanden, was los war.'),
    m(ch.emma, 'Ich dachte, ihr findet meine Szene langweilig.\nWeil ständig gelacht wurde und ihr dann über Änderungen gesprochen habt.'),
    m(ch.chioma, 'Oh Emma.\nWir wollten nur den Umbau kürzen. Deinen Dialog brauchen wir unbedingt.'),
  ]),

  S('sp0e05c04_klassenchat_emma_zurueck', [
    classChat('Klasse 7b'),
    sysMsg('Chioma hat Emma wieder zur Gruppe hinzugefügt.'),
    m(ch.dominik, 'EMMAAAAA'),
    m(ch.dominik, 'WILLKOMMEN ZURÜCK'),
    m(ch.dominik, 'Ämm sorry. Ich dachte, unser Hotelchoas braucht mehr Action.'),
    m(ch.emma, 'Unser Hotelchaos braucht vor allem weniger Dominik. 😂'),
    m(ch.mia, 'AHAHAHAHA'),
    m(ch.carlos, 'Endlich sagt\'s jemand.'),
    m(ch.lukas, 'Sachlich korrekt.'),
    m(ch.dominik, 'Ich werde hier gemobbt  😳'),
  ]),

  S('sp0e05c04_privat_mia_finn2', [
    privateChat('Mia', 'Finn'),
    m(ch.finn, 'ich komm nachher.'),
    m(ch.mia, 'Und dein Turnier?'),
    m(ch.finn, 'hab abgesagt.'),
    m(ch.mia, 'Ernsthaft?'),
    m(ch.finn, 'Ja.'),
    m(ch.mia, 'warum?'),
    m(ch.finn, 'weil ich lieber hier bin.'),
    m(ch.mia, 'Bei der Probe?'),
    m(ch.finn, 'auch'),
    m(ch.mia, '😳'),
    m(ch.finn, '😏'),
  ]),

  S('sp0e05c04_switch_amy2', [
    amyChat(),
  ]),

  GR('sp0e05c04_gr_ki_beweis',
    'Stell dir vor, du fragst einen KI-Chatbot, ob deine Freunde heimlich über dich reden.\nDer Bot antwortet: „Das könnte gut sein." Was wäre jetzt am sinnvollsten?',
    [
      rc('a', 'Die Antwort als Beweis nehmen.',
        'Eine KI kann Möglichkeiten nennen. Ob sie stimmen, muss man aber überprüfen. Bei einem Streit hilft oft ein echtes Gespräch mehr als noch eine weitere KI-Antwort.',
      ),
      rc('b', 'Den Bot noch zehnmal fragen, bis er ganz sicher ist.',
        'Eine KI kann Möglichkeiten nennen. Ob sie stimmen, muss man aber überprüfen. Bei einem Streit hilft oft ein echtes Gespräch mehr als noch eine weitere KI-Antwort.',
      ),
      rc('c', 'Überlegen, welche Informationen fehlen, und bei Bedarf mit den Beteiligten sprechen.',
        'Eine KI kann Möglichkeiten nennen. Ob sie stimmen, muss man aber überprüfen. Bei einem Streit hilft oft ein echtes Gespräch mehr als noch eine weitere KI-Antwort.',
      ),
      rc('d', 'Sofort den Kontakt zu allen abbrechen.',
        'Eine KI kann Möglichkeiten nennen. Ob sie stimmen, muss man aber überprüfen. Bei einem Streit hilft oft ein echtes Gespräch mehr als noch eine weitere KI-Antwort.',
      ),
    ],
    { topics: ['talk-act', 'reflect-understand'] },
  ),

  AR('sp0e05c04_ar_ki_beweis', 'sp0e05c04_gr_ki_beweis'),

  S('sp0e05c04_klassenchat_abends', [
    classChat('Klasse 7b'),
    divider('Abends'),
    m(ch.chioma, 'MORGEN 18 UHR AUFFÜHRUNG 🎄'),
    m(ch.lisa, 'Mein Outfit ist perfekt 😍'),
    m(ch.yasmin, 'Hoffentlich auch dein Text.'),
    m(ch.carlos, 'Technik läuft.'),
    m(ch.aylin, 'Kulissen stehen.'),
    m(ch.lukas, 'Texte sitzen … größtenteils.'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 5 — Weihnachten in New York
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('sp0e05c05', 4, 'Amic 5', 'Weihnachten in New York', [

  S('sp0e05c05_klassenchat_vor_aufführung', [
    classChat('Klasse 7b'),
    divider('Freitag · Der große Auftritt'),
    divider('17:35 Uhr'),
    m(ch.chioma, 'ALLE HINTER DIE BÜHNE.'),
    m(ch.chioma, 'In 25 Minuten geht\'s los.'),
    m(ch.dominik, 'Ich bin bereit.'),
    m(ch.carlos, 'Deine Mütze liegt noch im Technikraum.'),
    m(ch.dominik, 'Ich bin fast bereit.'),
    m(ch.emma, 'Ich bin irgendwie nervös.'),
    m(ch.chioma, 'Ich auch.'),
    m(ch.emma, 'Du?'),
    m(ch.chioma, 'Natürlich.'),
    m(ch.chioma, 'Ich hab seit heute Morgen dreimal den Ablauf kontrolliert.'),
    m(ch.lukas, 'Eher sechsmal.'),
    m(ch.chioma, 'Danke Lukas.'),
    sysMsg('KEVIN BETRITT DAS GRAND HOTEL'),
  ]),

  S('sp0e05c05_klassenchat_nach_aufführung', [
    classChat('Klasse 7b'),
    divider('19:20 Uhr'),
    divider('Nach der Aufführung'),
    m(ch.dominik, 'LEUTE'),
    m(ch.dominik, 'WIR WAREN LEGENDÄR'),
    m(ch.mia, 'Du hast fast den Weihnachtsbaum umgerannt.'),
    m(ch.dominik, 'ACTION'),
    m(ch.lukas, 'Und deinen Text vergessen.'),
    m(ch.dominik, 'IMPROVISATION'),
    m(ch.yasmin, 'Meine Mutter hat Tränen gelacht.'),
    m(ch.lisa, 'Meine auch.'),
    m(ch.finn, 'meine großeltern sitzen in der ersten reihe 😊'),
    m(ch.chioma, 'Das war richtig schön.'),
    m(ch.carlos, 'Vor allem die Szene im Park.'),
    sysImg(B('sp0e05c05_01-512.webp')),
    m(ch.emma, 'Echt?'),
    m(ch.carlos, 'Ja.'),
    m(ch.lukas, 'War auch die einzige Szene, in der Dominik mal still war.'),
    m(ch.emma, 'Danke 😊'),
  ]),

  S('sp0e05c05_privat_finn_mia', [
    privateChat('Finn', 'Mia'),
    divider('19:42 Uhr'),
    m(ch.finn, 'wo bist du?'),
    m(ch.mia, 'Hinter der Bühne. Warum?'),
    m(ch.finn, 'komm mal kurz zum seiteneingang.'),
    m(ch.mia, 'Klingt verdächtig.'),
    m(ch.finn, 'hab eine überraschung für dich'),
    m(ch.mia, 'Hoffentlich keine Weihnachtsdeko'),
    m(ch.finn, 'versprochen. kommst du?'),
    m(ch.mia, 'Vielleicht.'),
    divider('Einige Minuten später'),
    m(ch.mia, 'Also.'),
    m(ch.finn, 'also? 😏'),
    m(ch.mia, 'Damit hab ich jetzt nicht gerechnet.'),
    m(ch.finn, 'war der kuss okay?'),
    m(ch.mia, 'Hm.'),
    m(ch.finn, 'hm???'),
    m(ch.mia, 'Müssen wir wohl wiederholen.'),
    m(ch.finn, 'bin dabei'),
    sysImg(B('sp0e05c05_02-512.webp')),
  ]),

  S('sp0e05c05_kiki_emma_abschluss', [
    divider('Einblick: Emma ↔ KIKI'),
    privateChat('Emma', 'KIKI'),
    divider('20:05 Uhr'),
    m(kiki, 'Hey Emma! Wie war eure Aufführung?'),
    m(ch.emma, 'Richtig gut.\nSogar Dominik war mal kurz still 😂'),
    m(kiki, 'Das klingt nach einem schönen Abend! Hast du dich auf der Bühne wohlgefühlt?'),
    m(ch.emma, 'Ja.\nIch war erst total nervös.\nAber dann hat alles geklappt.'),
    m(kiki, 'Das klingt, als wäre es ein richtig schöner Abend gewesen! Was war für dich der beste Moment?'),
    m(ch.emma, 'Später vielleicht. Mia wartet schon auf mich.'),
  ]),

  S('sp0e05c05_switch_amy', [
    amyChat(),
  ]),

  MIT('sp0e05c05_mit_ki_lernen',
    'Emma hat in dieser Woche einiges über KI-Chats gelernt.\nWas davon findest du wichtig?',
    'responsibility',
    'rules_consequences',
    [
      opt('a', 'Eine KI kann helfen, Gedanken zu sortieren.', 1),
      opt('b', 'Wenn die KI mir recht gibt, stimmt meine Vermutung bestimmt.', 1),
      opt('c', 'Private Daten, Fotos und fremde Nachrichten sollte ich schützen.', 1),
      opt('d', 'Bei wichtigen Fragen lohnt es sich, Antworten zu überprüfen.', 1),
      opt('e', 'Wenn mich etwas belastet, sollte ich auch mit einem Menschen sprechen, dem ich vertraue.', 1),
      opt('f', 'Eine KI weiß immer, was andere über mich denken.', 1),
      opt('g', 'Ich kann eine KI bitten, mir andere mögliche Erklärungen zu zeigen, statt mich nur zu bestätigen.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 7,
      helperText: 'Wähle alles aus, was du wichtig findest.',
      topics: ['reflect-understand'],
    },
  ),

  AF('sp0e05c05_af_ki_lernen', 'sp0e05c05_mit_ki_lernen'),

  S('sp0e05c05_amy_tipp_ki_lernen', [
    m(ch.amy, '💡 KI kann ein tolles Werkzeug sein – zum Fragenstellen und Ideenfinden. Wichtig ist, dass du selbst mitdenkst, auf deine Privatsphäre achtest und echte Menschen nicht aus dem Blick verlierst.'),
  ]),

  S('sp0e05c05_carlos_artikel', [
    privateChat('Carlos', 'Du'),
    m(ch.carlos, 'Hier ist noch der Artikel aus unserer Schülerzeitung über die Aufführung. Von Jonas!'),
    bonusLink('article-jonas-weihnachtschaos', 'Schülerzeitung: Weihnachtschaos in New York', '/newspaper/article-jonas-weihnachtschaos', 'Artikel öffnen →'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const sp0e05De: StoryEpisodeV02 = {
  id: 'sp0e05',
  seasonId: 'sp',
  episodeId: 'sp0e05',
  courseId: 'sp0e05',
  chapters: [c01, c02, c03, c04, c05],
};

export default sp0e05De;
