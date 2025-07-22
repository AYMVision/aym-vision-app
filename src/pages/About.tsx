/*  src/pages/About.jsx  */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import vision from '../assets/about/vision.png';
import sample from '../assets/about/sample.png';
import teamPic from '../assets/about/team.jpg';
import beat from '../assets/about/beat.png';
import motivation from '../assets/about/motivation.jpg';
import amy from '../assets/about/amy.png';
import digital from '../assets/about/digital.png';
import logo from '../assets/about/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

type Copy = string | string[];
interface SplitSectionProps {
  id: string;
  title: string;
  copy: Copy;
  imgSrc: string;
  imgAlt: string;
  invert?: boolean;
  bg?: string;
  imgStyle?: string;
}

function SplitSection({
  id,
  title,
  copy,
  imgSrc,
  imgAlt,
  invert = false,
  bg = '',
  imgStyle = 'rounded-xl shadow-lg ring-1 ring-anthracite-200/50',
}: SplitSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${bg} py-12 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className={`grid gap-10 lg:grid-cols-2 lg:items-center ${
            invert ? 'lg:direction-rtl' : ''
          }`}
        >
          <div className="space-y-6 lg:direction-ltr">
            <h2 className="text-3xl font-bold text-anthracite-950">{title}</h2>

            {Array.isArray(copy) ? (
              <ul className="list-disc pl-5 space-y-1 text-base leading-relaxed text-anthracite-600">
                {copy.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-base leading-relaxed text-anthracite-600">
                {copy}
              </p>
            )}
          </div>

          <div className="mx-auto w-full max-w-md">
            <img src={imgSrc} alt={imgAlt} className={imgStyle} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <Layout>
      <main>
        <SplitSection
          id="our-vision"
          title="Our Vision"
          copy="Alle Kinder und Jugendlichen sind auf die Herausforderungen der digitalen Welt vorbereitet. Sie sollen sich selbstbewusst, neugierig und verantwortungsvoll in der digitalen Welt bewegen können. Wir sind überzeugt, dass junge Menschen in einer komplexen digitalen Gesellschaft nicht allein gelassen werden dürfen. Daher schaffen wir mit AYM Vision Lernräume, die stärken, orientieren und zum Mitdenken anregen."
          imgSrc={vision}
          imgAlt="Our vision sketch-style illustration"
        />

        <SplitSection
          id="our-motivation"
          title="Our Motivation"
          copy="Zwei Schwestern, eine gemeinsame Vision: AYM Vision ist das Herzensprojekt von Ann-Sofie Höbrink und Melina Wiegers. Was mit einem persönlichen Gespräch über ihre Kinder, das Internet und Bildung begann, entwickelte sich rasch zu einer klaren Vision und dem festen Entschluss, einen eigenen Beitrag für eine zukunftsfähige digitale Bildung zu leisten. Während Ann-Sofie in Niedersachsen als Projektmanagerin, HR-Site-Managerin und Coach arbeitete, vertiefte Melina in der Schweiz und den USA ihre Expertise in Sprache, Resilienzförderung und Nachhaltigkeit. Was sie verbindet: die Überzeugung, dass Kinder in der digitalen Welt nicht nur begleitet, sondern gestärkt werden müssen. Kinder und Jugendliche brauchen Selbstvertrauen und Kompetenzen, damit sie in der digitalen Welt eigenständig, sicher und neugierig unterwegs sein können."
          imgSrc={motivation}
          imgAlt="Motivation for our project showing the two sisters in a garden with a child"
          invert
          bg="bg-white"
        />

        <SplitSection
          id="our-educational-approach"
          title="Our Educational Approach"
          copy={[
            'regelmäßige Impulse, die reale Situationen aufgreifen und altersgerecht erklären',
            'aktive Auseinandersetzung mit den Chancen und Risiken digitaler Medien',
            'reflektierende Fragen, die Kinder ermutigen, ihr eigenes Verhalten zu hinterfragen und weiterzuentwickeln',
          ]}
          imgSrc={beat}
          imgStyle=""
          imgAlt="A picture of a heartbeat showing the rhythm of learning"
        />

        <SplitSection
          id="our-method"
          title="Our Method"
          copy="Unsere Stories entwickeln eine Dynamik, die Spaß macht, zum Mitdenken anregt und langfristig wirkt. Sympathische Charaktere erleben in diesen Storys im Chat-Format Herausforderungen der Medienwelt – unterhaltsam und auf den Punkt gebracht. Begleitet werden die Geschichten durch unsere kluge Eule Amy. Am Ende jeder Episode stellt sie dem Leser eine Reflexionsfrage – so sind die jungen Nutzer nicht bloß Konsumenten, sondern denken aktiv über das Gelesene nach und übertragen es in ihren Alltag. Die Antworten werden automatisch von KI auf Logik überprüft – es gibt dabei kein Richtig und Falsch! Nach jeder Geschichte werden die Bemühungen des Users mit einem Badge belohnt und ohne persönliche Informationen sicher gespeichert. Nach einer festgelegten Anzahl an Storys wird das fälschungssichere Zertifikat verliehen. Es wird automatisch über die Cardano-Blockchain erstellt und den Kindern verliehen."
          imgSrc={sample}
          imgStyle="rounded-xl shadow-lg ring-1 ring-anthracite-200/50"
          imgAlt="A sample of our application showing a chat interface"
          invert
          bg="bg-gold-50"
        />

        <section id="our-team" className="py-16 bg-white scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="mb-12 text-center text-3xl font-bold text-anthracite-950"
            >
              Unser Team
            </motion.h2>

            <motion.img
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              className="mx-auto mb-14 w-full max-w-lg rounded-xl shadow-lg"
              src={teamPic}
              alt="Selbst gezeichnete Illustration von Melina und Ann-Sofie"
            />

            <div className="grid gap-12 sm:grid-cols-2">
              {[
                {
                  name: 'Melina Wiegers',
                  role: 'Co-Founderin | Leitung Inhalte & Didaktik',
                  bio: 'Melina bringt ihre Leidenschaft für Sprache, Geschichten und Bildungsprozesse in das Projekt ein. Nach ihrem Studium der Kulturwissenschaften (Magistra Artium) absolvierte sie Weiterbildungen u. a. in Kinder- und Jugendliteratur, Science of Happiness (University of California, Berkeley) und Foundations of Sustainability (University of Arizona).',
                },
                {
                  name: 'Ann-Sofie Höbrink',
                  role: 'Co-Founderin | Leitung Technologie & Strategie',
                  bio: 'Ann-Sofie vereint technisches Verständnis mit psychologischem Fingerspitzengefühl. Nach ihrem Studium des Wirtschaftsingenieurwesens (B.Sc.) und der Wirtschaftspsychologie (M.Sc.) sammelte sie über zehn Jahre Erfahrung in der Unternehmensberatung – unter anderem als Projektmanagerin, HR-Site-Managerin und zertifizierter Business Coach.',
                },
              ].map(({ name, role, bio }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-semibold text-anthracite-950">
                    {name}
                  </h3>
                  <p className="mb-2 text-sm italic text-anthracite-600">
                    {role}
                  </p>
                  <p className="text-anthracite-600">{bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SplitSection
          id="amplify-your-mind"
          title="Amplify Your Mind (AYM)"
          copy="AYM steht für Amplify Your Mind – und bringt zum Ausdruck, was wir mit AYM Vision ermöglichen wollen: jungen Menschen den Raum geben, ihre eigene Sicht auf die Welt zu entwickeln und zu entfalten. „Amplify“ bedeutet: verstärken, hörbar machen, größer denken. Wir glauben, dass Kinder bereits mit Kreativität, Neugier und Urteilsvermögen in die digitale Welt starten – AYM Vision hilft ihnen dabei, genau diese Fähigkeiten weiterzuentwickeln. Wir möchten sie dabei unterstützen, selbstständig zu denken, reflektiert zu handeln und ihre Potenziale zu erkennen. Amplify Your Mind heißt für uns: Verstärkung des eigenen Denkens – nicht auswendig lernen, sondern durchblicken und mitgestalten."
          imgSrc={logo}
          imgStyle=""
          imgAlt="Amplify Your Mind logo showing a heartbeat"
        />

        <SplitSection
          id="why-amy"
          title="Warum Amy?"
          copy="AMY ist unsere freundliche, schlaue Eule – und das Gesicht von AYM Vision. Sie begleitet Kinder und Jugendliche auf Augenhöhe durch digitale Themen, erklärt komplexe Inhalte verständlich und regt zum Mitdenken an. Mit klugen Fragen, Geschichten und spielerischen Impulsen wird sie zur nahbaren Verbündeten im Lernprozess. AMY verkörpert, was wir vermitteln wollen: Neugier, Reflexion und Mut zur eigenen Perspektive. Als Figur, Name und Haltung macht sie unsere Idee erlebbar – für Bildung mit Charakter und Kinder, die wachsen wollen."
          imgSrc={amy}
          imgStyle=""
          imgAlt="Why Amy"
          invert
          bg="bg-gold-50"
        />

        <section
          id="call-for-action"
          className="relative isolate overflow-hidden bg-gradient-to-br from-gold-100 via-gold-50 to-white py-20"
        >
          <div className="mx-auto max-w-4xl px-4 text-center">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-6 text-3xl font-bold text-anthracite-950"
            >
              Call&nbsp;4&nbsp;Action
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              transition={{ delay: 0.15 }}
              className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-anthracite-600"
            >
              Gemeinsam mit Partnern möchten wir einen sicheren,
              verantwortungsvollen Umgang mit digitalen Medien etablieren.
              Schritt für Schritt. Episode für Episode. Story für Story. Machen
              Sie mit! Werden Sie Teil der Vision und unterstützen Sie AYM
              Vision dabei, demokratische Werte zu leben, Diskriminierung zu
              bekämpfen und alle Kinder digital zu stärken – ganz gleich, woher
              sie kommen.
            </motion.p>

            <motion.img
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              transition={{ delay: 0.3 }}
              src={digital}
              alt="An illustration of digital brain"
              className="mx-auto mb-10 w-full max-w-xs"
            />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              transition={{ delay: 0.45 }}
            >
              <Link
                to="/contact"
                className="relative inline-flex items-center gap-2 rounded-full bg-anthracite-950 px-8 py-4 text-white shadow-lg ring-1 ring-anthracite-700/40 transition hover:bg-anthracite-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                Mitmachen
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
