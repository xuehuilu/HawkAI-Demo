import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white p-6 sm:p-8 border-b border-slate-200 sticky top-0 z-10">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      {children && <div className="mt-4 flex gap-3">{children}</div>}
    </div>
  );
};
