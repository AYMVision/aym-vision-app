import React from 'react';
import { cn } from '../common/utils';

type Props = {
  title: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, text, children, className }: Props) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden', className)}>
      <div className="p-4">
        <div className="font-semibold text-slate-900">{title}</div>
        {text ? <div className="mt-1 text-sm text-slate-600">{text}</div> : null}
      </div>
      {children}
    </div>
  );
}