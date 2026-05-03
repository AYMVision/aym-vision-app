import React from 'react';
import { cn } from '../common/utils';

type Props = {
  kicker?: string;
  title: string;
  className?: string;
};

export default function SectionTitle({ kicker, title, className }: Props) {
  return (
    <div className={cn('text-left', className)}>
      {kicker ? <div className="text-xs font-semibold text-slate-500">{kicker}</div> : null}
      <h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}