// src/components/ModalShell.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ModalShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => navigate(-1)}
        aria-label="Schließen"
      />

      {/* Panel */}
      <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-3">
        <div className="w-full sm:max-w-xl rounded-3xl bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="font-extrabold text-slate-900">{title ?? ''}</div>
            <button
              type="button"
              className="rounded-xl px-3 py-1.5 text-sm font-semibold border border-slate-200 hover:bg-slate-50"
              onClick={() => navigate(-1)}
            >
              ✕
            </button>
          </div>
          <div className="max-h-[80vh] overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
