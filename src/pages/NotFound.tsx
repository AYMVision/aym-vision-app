import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import amy from '../assets/amy_lg.png';

const NotFound = () => {
  return (
    <Layout>
      <section className="w-full max-w-6xl flex flex-col items-center justify-center p-4 mt-16">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-row items-center justify-center mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold animate-fade-in-up">
                <span className="text-anthracite-950">Ups!</span>
                <br />
                <span className="bg-gradient-to-r from-white/80 to-white bg-clip-text text-transparent">
                  Hier ist nichts
                </span>
              </h1>
            </div>
            <div>
              <img
                className="ms-4 max-w-[280px] opacity-75"
                src={amy}
                alt="Amy"
              />
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-anthracite-800 font-medium mb-4">
            Diese Seite ist noch im Aufbau!
          </p>

          <p className="text-base sm:text-lg text-anthracite-600 mb-8 max-w-xl leading-relaxed">
            Die Seite, die du suchst, gibt es noch nicht oder wurde verschoben.
            Aber keine Sorge – es gibt schon viele andere spannende Stories zu
            entdecken!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-anthracite-950 font-semibold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-white"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Zur Startseite
              </span>
            </Link>

            <Link
              to="/stories"
              className="inline-flex items-center justify-center px-8 py-4 text-gold-950 font-semibold rounded-full border-2 border-anthracite-950 hover:border-gold-900 hover:text-gold-900 hover:bg-gold-100 transition-all duration-300"
            >
              Stories entdecken
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
