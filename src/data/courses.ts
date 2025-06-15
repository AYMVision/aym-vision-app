/**
 * One course: Das Strandhaus-Foto.
 * Each episode contains: speaker, type, content, optional images, question.
 * If inputExpected: true, user must answer to proceed.
 */

// Inline the Bubble type definition.
export type Bubble = {
  type: 'main' | 'user' | 'other';
  speaker: string;
  avatar?: string;
  content: string;
  image?: string;
  timestamp?: string;
  reactions?: { type: string; emoji: string }[];
  isQuestion?: boolean;
  inputExpected?: boolean;
  quote?: string;
};

export const courses = [
  {
    id: 'strandhaus-foto',
    title: 'Das Strandhaus-Foto',
    description:
      'Lerne an einem echten Chat, wie schnell Informationen im Internet die Runde machen – und wie du dich schützt.',
    script: [
      {
        id: 1,
        bubbles: [
          {
            type: 'main',
            speaker: 'Lisa',
            avatar: '',
            content: 'Grüße aus dem Urlaub! #Bester Tag ever',
            image: '/lovable-uploads/1628b548-c883-4c40-98d2-3fa52c507568.png',
            timestamp: '09:00',
            reactions: [{ type: 'thumb', emoji: '👍' }],
          },
          {
            type: 'other',
            speaker: 'Chioma',
            avatar: '',
            content:
              '☀️ Mega! Und richtig cool deine neue Designer-Sonnenbrille 😎',
            timestamp: '09:01',
            reactions: [{ type: 'heart', emoji: '❤️' }],
          },
          {
            type: 'other',
            speaker: 'Carlos',
            avatar: '',
            content: 'Wow, was für ein Luxus-Urlaub!',
            timestamp: '09:02',
          },
          {
            type: 'main',
            speaker: 'Lisa',
            avatar: '',
            content: 'Danke Leute! ❤️',
            timestamp: '09:03',
          },
          {
            type: 'other',
            speaker: 'Amy',
            avatar: '',
            content:
              'Fabian, schaue dir einen deiner letzten Schnappschüsse genau an. Was für Details darauf sind erst auf den zweiten Blick sichtbar?',
            timestamp: '09:03',
            isQuestion: true,
            inputExpected: true,
          },
        ] as Bubble[],
      },
      {
        id: 2,
        bubbles: [
          {
            type: 'other',
            speaker: 'coolguy24',
            avatar: '',
            content:
              'Mega Foto, Lisa! Wow dein Ferienhaus ist genial - ist deine ganze Familie mit im Urlaub? 🤩',
            timestamp: '11:35',
            image: 'https://lovable.dev/_assets/aym_vision/strandhaus.jpg',
          },
          {
            type: 'other',
            speaker: 'Carlos',
            avatar: '',
            content: 'Wer ist coolguy24???',
            timestamp: '11:36',
          },
          {
            type: 'main',
            speaker: 'Lisa',
            avatar: '',
            content:
              'Ja, die ganze Familie ist hier. Eine Woche Malle - ein Traum 😎',
            timestamp: '11:37',
          },
          {
            type: 'main',
            speaker: 'Lisa',
            avatar: '',
            content: 'Warum??? Kennen wir uns?',
            timestamp: '11:37',
          },
          {
            type: 'other',
            speaker: 'Amy',
            avatar: '',
            content:
              'Fabian, wie hättest du reagiert, wenn ein Fremder dich nach persönlichen Informationen gefragt hätte?',
            timestamp: '11:38',
            isQuestion: true,
            inputExpected: true,
          },
        ] as Bubble[],
      },
    ],
  },
];
