import Layout from '../components/Layout';

export default function Agb() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            Allgemeine Nutzungsbedingungen
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            AMY SURFWING — AYM VISION GmbH
          </p>
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            Unsere Allgemeinen Nutzungsbedingungen werden in Kürze hier veröffentlicht.
          </div>
        </div>
      </div>
    </Layout>
  );
}
