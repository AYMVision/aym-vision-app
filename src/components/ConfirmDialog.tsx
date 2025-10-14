import React from 'react';

type Props = {
  open: boolean;
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
};

const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        ) : null}
        <div className="mt-5 flex items-center justify-end gap-3">
          {secondaryLabel && onSecondary && (
            <button
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </button>
          )}
          <button
            className="rounded-md bg-[#0084ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0072db]"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
