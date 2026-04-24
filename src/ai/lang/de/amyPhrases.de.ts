// src/ai/lang/de/amyPhrases.de.ts
// Alle Amy-Texte zentral (i18n-fähig). KI-Core bleibt text-frei.

export const AMY_PHRASES_DE = {
  emojis: {
    owl: '🦉',
  },

  // Übergang zum Impuls (Brücke). Kurz, ruhig, nicht drängend.
  // Keys: aligned | generic | 'off-topic'
  bridge: {
    aligned: [
      'Genau daran kann man gut anknüpfen.',
       'Ich bleib kurz bei deinem Gedanken.',
      'Ich greif das auf und geh einen Schritt weiter.',
     'Lass uns daran anknüpfen.',
     'Ich bleib noch bei dem, was du gesagt hast.',
      'Daran kann man gut ansetzen.',
      'Von hier aus können wir kurz weiterdenken.',
      'Ein Gedanke, der das abrundet:',
      'Ich geb dir dazu noch einen Gedanken mit.',
      'Dazu kommt jetzt noch ein Impuls.',
      'Ich knüpfe daran an.',
      'Dazu passt noch ein Gedanke.',
    ],

    generic: [
      'Ergänzend möchte ich dir noch etwas mitgeben.',
      'Da kann man noch einen Aspekt dazunehmen.',
      'Ich knüpfe daran an und ordne es ein.',
      'Ich bleib bei deinem Gedanken und ergänze eine Sache.',
        'Ich bring dazu noch einen anderen Gedanken rein.',
     'Ich ergänze das um einen weiteren Gedanken.',
         'Ich geb dir dazu noch einen kleinen Gedanken mit.',
    'Dazu passt noch ein Impuls.',
    'Zum Schluss noch ein kleiner Impuls.',
    'Ein Gedanke, der das abrundet:',
    'Ich geb dir dazu noch einen weiteren Gedanken mit.',
      'Ich setz da noch etwas daneben.',
      'Ich ergänze das mit einem Impuls.',
      'Dazu noch ein Gedanke.',
      'Ich ergänze noch:'

    ],

    'off-topic': [
        'Ich bring dazu noch einen anderen Gedanken rein.',
      'Daneben gibt es noch einen Gedanken, der hier auch dazugehört.',
     'Ich ergänze das um einen weiteren Gedanken.',
      'Dazu passt noch ein anderer Blick.',
      'Ich geb dir dazu noch einen kleinen Gedanken mit.',
          'Zum Schluss noch ein kleiner Impuls.',
          'Ein Gedanke, der das abrundet:',
          'Ich geb dir dazu noch einen Gedanken mit.',
          'Dazu kommt noch ein kurzer Impuls.',
          'Ich setz da noch eine Sache daneben.'
    ],
  },


  // --------------------
  // A (Warm, zugewandt, nicht übertrieben)
  // --------------------
aIntroByType: {
      GENERAL: [
    'Schön, wie du das beschreibst. 🤩',
    'Da hast du dir viele Gedanken gemacht. ⭐',
    'Das hast du gut erklärt. ⭐',
     'Wunderbar. 👏',
    'Bravo. 👏',
          'Danke, dass du das teilst. ⭐',
      'Ich verstehe, was du meinst. ⭐',
      'Das ist klar gesagt. ⭐',
    
  ],
  FEELING: [
    'Danke, dass du das sagst. 🙏',
    'Ich verstehe, was du meinst. 💡',
    'Das klingt nach einem echten Gefühl. ⭐',
     'Danke, dass du das teilst. 🙏',
   'Ich kann gut nachvollziehen, was du meinst. 💡',
   'Schön, wie du das beschreibst. 🤩',
   'Da hast du dir viele Gedanken gemacht. ⭐',
         'Danke, dass du das sagst. ⭐',
       'Das kann ich gut verstehen. 💡',
       'Schöne Erklärung. 🌟',
       'Du beschreibst das toll. 🤩',
       'Du beschreibst Gefühle sehr klar.',
       
  ],

  ACTION: [
    'Das klingt nach einem Plan. 🤩',
    'Du hast einen Plan. 🤩',
    'Das hast du gut durchdacht. ⭐',
    'Ich kann gut nachvollziehen, was du schreibst. 💡',
    'Schön, wie du das beschreibst. 🤩',
    'Da hast du dir viele Gedanken gemacht. ⭐',
    'Das hast du gut erklärt. ⭐',
     'Wunderbar. 👏',
    'Bravo. 👏',
    'Du verstehst was davon. 💯',
    'Schöne Erklärung. 🌟',
    'Du beschreibst das toll. 🤩',
    'Du gehst direkt auf den nächsten Schritt.',
          'Danke, das ist klar beschrieben. ⭐',
      'Ich sehe, was du meinst. ⭐',
  ],
  CHALLENGE: [
    'Coole Idee. 🌟',
    'Das ist kreativ gedacht. 🌟',
    'Schön, wie du das beschreibst. 🤩',
    'Da hast du dir viele Gedanken gemacht. ⭐',
    'Wunderbar. 👏',
    'Bravo. 👏',
    'Schöne Erklärung. 🌟',
    'Du beschreibst das toll. 🤩',
          'Cool, du hast eine gute Idee. 🌟',
      'Danke, das ist kreativ gedacht. 🌟',
      'Das ist eine konkrete Idee. 🌟',
  ],
  PERSPECTIVE: [
    'Ich verstehe deine Einordnung. ✨',
    'Du hast das gut erklärt. ✨',
     'Das hast du gut durchdacht. ⭐',
     'Schön, wie du das beschreibst. 🤩',
     'Da hast du dir viele Gedanken gemacht. ⭐',
     'Das hast du gut erklärt. ⭐',
      'Wunderbar. 👏',
    'Bravo. 👏',
    'Schöne Erklärung. 🌟',
    'Du beschreibst das toll. 🤩',
    'Du ordnest die Situation gut ein.',
          'Danke, das ist gut eingeordnet. 🌟',
      'Ich verstehe deinen Blick darauf. 🌟',
  ],
  KNOWLEDGE: [
    'Das ist gut begründet. ✨',
    'Das klingt nachvollziehbar. 🌟',
    'Das hast du gut durchdacht. ⭐',
   'Schön, wie du das beschreibst. 🤩',
   'Das hast du gut erklärt. ⭐',
   'Wunderbar. 👏',
    'Bravo. 👏',
    'Du verstehst was davon. 💯',
    'Schöne Erklärung. 🌟',
    'Du beschreibst das toll. 🤩',
    'Du nennst einen wichtigen Grund.',
          'Danke, das ist gut erklärt. 🌟',
      'Das ist verständlich gesagt. 🌟',
  ],
},

  // Wenn keine Spiegelung verwendet wird:
aOutroByType: {
    GENERAL: [
    'Das ist ein starker Gedanke. 🦉',
    'Das hast du toll beschrieben. 🦉',
    'Du greifst genau das auf, worum es hier geht. 🦉',
          'Das ist ein klarer Gedanke. 🦉',
      'Das ist gut verständlich. 🦉',
    

  ],
  FEELING: [
    'Das ist ein nachvollziehbares Gefühl. 🦉',
    'Das ist ein starker Gedanke. 🦉',
    'Das hast du toll besch',
    'Du greifst genau das auf, worum es hier geht. 🦉',


  ],
  ACTION: [
    'Das ist ein starker Gedanke. 🦉',
    'Das passt zur Situation. 🦉',
    'Das hast du gut zusammenfassen. 🦉',
      'Deine Antwort trifft den Punkt. 🦉',
  'Du greifst den Kern gut auf. 🦉',
  'Das klingt stimmig. 🦉',
       'Damit hast du einen klaren nächsten Schritt. 🦉',
      'Das ist eine klare Richtung. 🦉',
      'Damit kann man gut weitergehen. 🦉',

  ],
  CHALLENGE: [
    'Das ist ein starker Gedanke. 🦉',
    'Das passt zur Situation. 🦉',
    'Das klingt stimmig. 🦉',
      'Das ist eine super Idee. 🦉',
      'Das ist ein guter Ansatz. 🦉',
      'Damit kann man was anfangen. 🦉',

  ],
  PERSPECTIVE: [
    'Das ist ein klarer Gedanke. 🦉',
    'Da hast du einen klaren Gedanken formuliert. 🦉',
  'Da hast du einen starken Gedanken formuliert. 🦉',
  'Das ist ein starker Gedanke. 🦉',
  'Das passt zur Situation. 🦉',
  'Das hast du gut zusammenfassen. 🦉',
    'Deine Antwort trifft den Punkt. 🦉',
  'Du greifst den Kern gut auf. 🦉',
  'Das klingt stimmig. 🦉',
  'Du greifst genau das auf, worum es hier geht. 🦉',
  'Das passt sehr gut zur Situation. 🦉',
        'So kann man das gut einordnen. 🦉',
      'Das ist ein verständlicher Blick darauf. 🦉',
      'Das ist eine nachvollziehbare Einordnung. 🦉',

  ],
  KNOWLEDGE: [
    'Das ist ein starker Gedanke. 🦉',
    'Das hast du gut zusammenfassen. 🦉',
      'Deine Antwort trifft den Punkt. 🦉',
  'Du greifst den Kern gut auf. 🦉',
  'Das klingt stimmig. 🦉',
  'Du greifst genau das auf, worum es hier geht. 🦉',
   'Da triffst du einen zentralen Punkt. 🦉',
      'Das ist gut erklärt. 🦉',
      'Das ist ein wichtiger Punkt. 🦉',

  ],
},


  // --------------------
  // B (kurz, passend – entlastend)
  // --------------------


bIntroByType: {
  FEELING: [
    'Ich verstehe, was du meinst.',
    'Okay, ich verstehe dich.',
    'Das klingt nach einem echten Gefühl.',
    'Ich verstehe, was du meinst. 💡',
    'Danke.',
          'Verstanden.',
  ],
  ACTION: [
    'Das klingt nach einem ersten Plan. 🦉',
    'Alles klar. 👍',
    'Verstanden. 🙂',
    'Danke. ✅',
    'Kurz und klar. ✅',
    'Okay, danke. 🙂',
    
  ],
  CHALLENGE: [
    'Das ist kreativ gedacht. 🦉',
    'Alles klar. 👍',
    'Verstanden. 🙂',
    'Danke. ✅',
    'Kurz und klar. ✅',
    'Okay, danke. 🙂',
  ],
  PERSPECTIVE: [
    'Ich verstehe deine Einordnung. 🦉',
    'Okay, ich verstehe dich. 👍',
    'Ich verstehe, was du meinst. 💡',
    'Alles klar. 👍',
    'Verstanden. 🙂',
    'Danke. ✅',
    'Okay, danke. 🙂',
  ],
  KNOWLEDGE: [
    'Ich verstehe, was du meinst. 💡',
    'Alles klar. 👍',
    'Verstanden. 🙂',
    'Danke. ✅',
    'Kurz und klar. ✅',
    'Okay, danke. 🙂',

  ],
      GENERAL: [
      'Okay. 🙂',
      'Verstanden. 💡',
      'Alles klar. 👍',
    ],
},


bOutroByType: {
  FEELING: [
    'Wenn du magst, kannst du mir morgen auch noch mehr erzählen. 🦉',
    'Morgen freue ich mich auf weitere Gedanken von dir. 🦉',
    'Das ist verständlich. 🦉',

  ],
  ACTION: [
     'Das passt für den Moment. 🦉',
     'Das ist okay so. Wenn du magst, kannst du mir morgen auch noch mehr erzählen. 🦉',
     'Das ist ein valider Punkt. 🦉',
     'Das ist eine passende Kurzfassung. 🦉',
     'Eine passende Kurzfassung! 🦉',
     'Damit triffst du schon einen Aspekt. 🦉',
     'Das klingt stimmig. 🦉',

    
  ],
  CHALLENGE: [
     'Das passt für den Moment. 🦉',
     'Das ist okay so. Wenn du magst, kannst du mir morgen auch noch mehr erzählen. 🦉',
     'Das ist ein valider Punkt. 🦉',
     'Das ist eine passende Kurzfassung. 🦉',
     'Das ist verständlich. 🦉',
     'Das klingt stimmig. 🦉',

  ],
  PERSPECTIVE: [
     'Das passt für den Moment. 🦉',
     'Das ist okay so. Wenn du magst, kannst du mir morgen auch noch mehr erzählen. 🦉',
     'Das ist ein valider Punkt. 🦉',
     'Das ist eine passende Kurzfassung. 🦉',
     'Das ist verständlich. 🦉',
     'Damit triffst du schon einen Aspekt. 🦉',
     'Da berührst du einen Teil der Situation. 🦉',
     'Das passt zu einem Teil der Situation. 🦉',
     'Das klingt stimmig. 🦉',

  ],
  KNOWLEDGE: [
     'Das passt für den Moment. 🦉',
     'Das ist okay so. Wenn du magst, kannst du mir morgen auch noch mehr erzählen. 🦉',
     'Das ist ein valider Punkt. 🦉',
     'Das ist eine passende Kurzfassung. 🦉',
     'Das ist verständlich. 🦉',
     'Damit triffst du schon einen Aspekt. 🦉',
     'Damit schaust du auf einen Aspekt der Frage. 🦉',
     'Das klingt stimmig. 🦉',


  ],
      GENERAL: [
          'Das passt für den Moment. Wenn du magst, kannst du mir morgen auch noch mehr erzählen. 🦉',
    'Das ist okay so.',
    'Das ist ein valider Punkt. 🦉',
    'Das ist verständlich. 🦉',
    ],
},


  // --------------------
  // Retry (C/UNSICHER) – ruhig, nicht beschämend
  // --------------------

  
  retryGeneric: [
    'Ich kann das noch nicht gut einordnen.',
    'Ich kann deine Antwort noch nicht gut einordnen.',
    'Hm – ich verstehe noch nicht, was du meinst.',
    'Hm – ich verstehe deine Antwort noch nicht.',
    'Mir ist noch nicht klar, was du sagen möchtest.',
    'Ich brauche noch ein bisschen mehr, um das zu verstehen.',
    'Das ist noch etwas zu unklar für mich.',
    'Das ist mir noch etwas unklar.',
    'Ich sehe noch nicht, wie das zur Frage passt.',
    'Das geht in eine andere Richtung als die Frage.',
  ],

  // 🔸 UNSICHER: entlastend, "weiß nicht / verstehe nicht"
retryUnsicher: [
  'Alles gut. Das ist nicht schlimm.',
  'Kein Problem. Du musst es nicht sofort wissen.',
  'Das ist verständlich. Manchmal braucht man kurz einen Moment.',
  'Alles okay. Lass es uns ganz simpel machen.',
],

// 🔸 C: eher Quatsch/zu wenig Substanz -> ruhig zurückführen
retryC: [
  'Ich kann damit noch nichts anfangen.',
      'Ich kann das noch nicht gut einordnen.',
    'Ich kann deine Antwort noch nicht gut einordnen.',
    'Hm – ich verstehe noch nicht, was du meinst.',
    'Hm – ich verstehe deine Antwort noch nicht.',
    'Mir ist noch nicht klar, was du sagen möchtest.',
    'Ich brauche noch ein bisschen mehr, um das zu verstehen.',
    'Das ist noch etwas zu unklar für mich.',
    'Das ist mir noch etwas unklar.',
    'Ich sehe noch nicht, wie das zur Frage passt.',
    'Das geht in eine andere Richtung als die Frage.',

],



  // Off-topic Steuerung: nur Aussagen, keine zweite Frage.
  steerBackStatements: [
    'Schau nochmal kurz auf die Frage oben.',
    'Geh nochmal kurz zurück zum Kern der Frage.',
   'Bitte erkläre deine Antwort noch ausführlicher.',
   'Vielleicht hilft es dir noch einmal zum Text zu scrollen?',
   'Versuche es bitte noch einmal',
   'Schreibe deine Antwort bitte noch einmal',
  ],

  // --------------------
  // MiniTipType Texte (fix, keine Generierung)
  // --------------------
miniTips: {
  focus_question: [
    'Ein Satz zur Frage reicht.',
    'Ein Satz, der zur Frage passt, reicht völlig.',
    'Überlege gerne kurz.',
    'Nimm dir einen Moment zum Nachdenken.',
    'Du kannst dir dafür Zeit lassen.',
    'Du musst nichts perfekt formulieren.',
    'Alles, was dir einfällt, ist willkommen.',
    'Lass dir Zeit.',
    'Schreib auf, was sich stimmig anfühlt.',
    'Es gibt kein Richtig oder Falsch.',
    'Vertrau deinem Gefühl.',
    'Probiere es einfach.'


  ],
  example_from_story: [
    'Nimm die Szene aus der Story als Beispiel.',
    'Ein Beispiel aus der Story-Szene reicht.',
    'Stell dir die Situation aus der Story vor – und bleib bei einem Beispiel.',
    'Ein Mini-Beispiel aus der Szene reicht.',
    'Erinner dich an die Story: Was wäre da passend?',
    'Nimm einen Moment aus der Szene – nur einen.',
  ],
  personal_feeling: [
    'Nenn dein Gefühl dazu.',
    'Eher gut, komisch oder unsicher – was passt am meisten?',
    'Ganz simpel: Welches Gefühl ist am stärksten?',
    'Ein Gefühl reicht: eher ruhig, traurig, wütend, ängstlich oder okay?',
    'Nenn ein Gefühl – und einen Grund.',

  ],
  simple_rephrase: [
    'Sag’s nochmal ganz einfach in deinen Worten.',
    'Kurz und einfach reicht.',
    'So wie du’s einem Freund sagen würdest.',
    'Ein einfacher Satz reicht.',
    'Starte einmal neu: ein kurzer Satz.',
    'Ganz schlicht formuliert – das hilft oft.',
  ],
  none: [''],
},


  // --------------------
  // Adult Gate & Safety
  // --------------------
  adultGate: [
    'Das ist wichtig. Bitte sprich kurz mit einer erwachsenen Person, der du vertraust.',
    'Hier ist es gut, kurz Hilfe von einer erwachsenen Person zu holen.',
  ],

  adultHint: [
  'Ich glaube, hier hilft es, wenn du kurz mit einem Erwachsenen auf die Frage schaust – dann klappt’s gleich besser. 🦉',
  'Hol dir kurz Unterstützung von einem Erwachsenen, dann könnt ihr zusammen auf die Frage schauen. 🦉',
  'Wenn du magst: Frag kurz einen Erwachsenen – dann findest du schneller eine gute Antwort. 🦉',
  'Bitte hol dir kurz einen Erwachsenen dazu – dann könnt ihr zusammen weitermachen.🦉',
],


  safety: [
    'Das klingt sehr schwer. Du musst da nicht allein durch. Bitte hol dir jetzt Unterstützung bei einer erwachsenen Person.',
    'Das wirkt gerade sehr belastend. Bitte sprich jetzt mit einer erwachsenen Person, der du vertraust.',
    'Das ist ein Moment, wo Hilfe wichtig ist. Bitte sprich jetzt mit einer erwachsenen Person.',
  ],

  // --------------------
  // Normverletzung / Provokation
  // --------------------
  normStop: [
    'Warte kurz – das könnte anderen wehtun. Lass uns das neu sortieren.',
    'Stopp, einmal kurz: Das kann anderen schaden. Wir denken das neu.',
    'Das kann verletzen. Lass uns neu sortieren.',
  ],

  // --------------------
  // Mikro-Aufgaben (genau 1 Frage)
  // --------------------
  microTask: {
    FEELING: [
      'Welches Gefühl passt dazu – und warum?',
      'Was fühlst du dabei am stärksten – und wieso?',
      'Welches Gefühl wäre in der Situation am ehesten da?',
    ],
    ACTION: [
      'Was würdest du jetzt tun – ganz konkret?',
      'Was wäre dein nächster Schritt – ganz konkret?',
      'Was machst du als Erstes in so einer Situation?',
        'Was ist dein erster Schritt in der Situation?',
    'Wenn das jetzt passiert: was machst du konkret?',
    ],
    PERSPECTIVE: [
      'Wie siehst du das?',
      'Was denkst du dazu?',
      'Was ist für dich relevant?',
      'Wie würdest du das einordnen?',
      'Was ist dein Gedanke dazu?',
    'Worum geht es bei dem Thema?',
    ],
    KNOWLEDGE: [
      'Was ist die wichtigste Tatsache dazu?',
      'Welche Info ist hier am wichtigsten?',
      'Was sollte man dazu unbedingt wissen?',
      'Welche Regel oder Tatsache passt hier?',
    ],
    CHALLENGE: [
      'Welche kleine Übung könnte dazu passen?',
      'Welche Mini-Aufgabe würde helfen?',
      'Was könntest du als Mini-Training versuchen?',
          'Welche Idee würdest du ausprobieren?',
    'Nenn eine Idee, die du wirklich machen würdest.',
    'Welche kleine Aufgabe passt hier?',
    ],
    GENERAL: [
      'Was wäre ein passender Gedanke dazu?',
      'Was ist dein wichtigster Gedanke dazu?',
      'Wie würdest du das in einem Satz beschreiben?',
        'Was ist dein Gedanke zur Frage?',
    'Was würdest du dazu sagen – in einem Satz?',
    'Was fällt dir dazu ein?'
    ],
  },
};
