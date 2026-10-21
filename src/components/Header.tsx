import React from 'react';
import { QUESTIONNAIRE_CONFIG } from '../config/questionnaireConfig';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onReset?: () => void;
  isSavedDraft?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps = 5,
  onReset,
  isSavedDraft = false
}) => {
  // Page 6 is thank you confirmation
  const isComplete = currentStep === 6;
  const progressPercent = isComplete ? 100 : Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {QUESTIONNAIRE_CONFIG.surveyTitle}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Bangalore Sustainable Packaging & Reuse Survey
              </p>
            </div>
          </div>

          {!isComplete && (
            <div className="flex items-center space-x-3">
              {isSavedDraft && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Auto-saved
                </span>
              )}
              {onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs text-slate-500 hover:text-indigo-600 flex items-center px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                  title="Clear draft & restart"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restart
                </button>
              )}
            </div>
          )}
        </div>

        {/* Step progress bar */}
        {!isComplete && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
              <span>
                Step {currentStep} of {totalSteps}: <strong className="text-indigo-600 font-semibold">{QUESTIONNAIRE_CONFIG.steps[currentStep - 1]?.title}</strong>
              </span>
              <span className="text-indigo-600 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out rounded-full shadow-inner"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
