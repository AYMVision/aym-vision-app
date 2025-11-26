import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t mt-8 py-4 px-4 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white">
      <span>© {new Date().getFullYear()} AYM Vision</span>

      <div className="flex gap-4">
        <a
          href="impressum.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Impressum
        </a>
        <a
          href="datenschutz-web.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Datenschutz
        </a>
      </div>
    </footer>
  );
};

export default Footer;
