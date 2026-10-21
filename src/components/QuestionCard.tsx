import React from 'react';

interface QuestionCardProps {
  title?: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  description,
  required = false,
  error,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all duration-200 ${
        error ? 'border-rose-400 ring-2 ring-rose-100' : 'hover:border-slate-300'
      } ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-start">
            <span>{title}</span>
            {required && <span className="text-rose-500 ml-1 font-bold" title="Required field">*</span>}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      )}

      <div>{children}</div>

      {error && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs text-rose-600 font-medium">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
