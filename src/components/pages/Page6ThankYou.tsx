import React from 'react';
import { QUESTIONNAIRE_CONFIG } from '../../config/questionnaireConfig';
import { CheckCircle2, HeartHandshake, RefreshCw } from 'lucide-react';

interface Page6Props {
  submissionId?: string;
  onRestart?: () => void;
}

export const Page6ThankYou: React.FC<Page6Props> = ({ submissionId, onRestart }) => {
  const config = QUESTIONNAIRE_CONFIG.page6;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-10 text-center space-y-6">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {config.heading}
          </h1>
          {submissionId && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Submission Reference ID: #{submissionId.slice(0, 8)}
            </div>
          )}
        </div>

        {/* Exact message content */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 text-left font-normal">
          {config.messageParagraphs.map((para, index) => (
            <p key={index} className="text-slate-700">
              {para}
            </p>
          ))}
        </div>

        {/* Action card */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Submit Another Response
            </button>
          )}
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
          <HeartHandshake className="w-4 h-4 text-indigo-500" />
          <span>Bangalore Sustainable Restaurant Initiative</span>
        </div>
      </div>
    </div>
  );
};
