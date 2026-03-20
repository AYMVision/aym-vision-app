import Layout from '../components/Layout';

export default function FAQ() {
  return (
    <Layout>
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-teal-900)]">
            FAQ
          </h1>
        </div>
      </div>
    </Layout>
  );
}
