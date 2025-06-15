import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Welcome = () => {
  return (
    <Layout>
      <section className="w-full max-w-6xl flex flex-row items-center gap-12 px-4 py-16">
        <div className="flex-1 min-w-[300px]">
          <h1 className="text-5xl font-bold mb-4 text-[#0084ff] tracking-tight">
            Willkommen bei AYM Vision
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-md">
            Interaktives Lernen für die digitale Zukunft. <br />
            Mit unseren Chat-basierten Kursen baust du spielerisch
            Medien-Kompetenzen & sichere Internet-Skills auf!
          </p>
          <Link
            to="/courses"
            className="inline-block bg-[#0084ff] text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
          >
            Kurse entdecken
          </Link>
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="bg-white rounded-[2rem] drop-shadow-xl w-[360px] h-[640px] flex flex-col overflow-hidden border-4 border-blue-50">
            <div className="bg-[#0084ff] h-[54px] flex items-center px-4 text-white font-bold">
              <span className="mx-auto">AYM Vision Chat</span>
            </div>
            <div className="bg-[#e5ddd5] px-3 py-2 flex-1 flex flex-col gap-2 overflow-y-auto">
              <div className="max-w-[80%] self-end bg-[#C7F2D8] rounded-xl px-5 py-3 text-gray-900 shadow-md">
                Grüße aus dem Urlaub! #Bester Tag ever
              </div>
              <div className="max-w-[80%] self-start bg-white rounded-xl px-5 py-3 text-gray-900 shadow-md">
                ☀️ Mega! Und richtig cool deine neue Designer-Sonnenbrille 😎
              </div>
              <div className="max-w-[80%] self-end bg-[#C7F2D8] rounded-xl px-5 py-3 text-gray-900 shadow-md">
                Danke Leute! ❤️
              </div>
              <div className="max-w-[80%] self-start bg-white rounded-xl px-5 py-3 text-gray-900 shadow-md">
                Wie hättest du reagiert? 🤔
              </div>
            </div>
            <div className="p-3 bg-white border-t">
              <input
                className="w-full py-2 px-4 rounded-full border bg-gray-50 outline-none"
                placeholder="Deine Antwort…"
                disabled
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Welcome;
