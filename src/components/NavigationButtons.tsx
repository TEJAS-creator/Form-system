import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalQuestionSteps?: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalQuestionSteps = 5,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
}) => {
  const isFirstStep = currentStep === 1;
  const isFinalQuestionPage = currentStep === totalQuestionSteps; // Page 5

  if (currentStep === 6) {
    // Thank you page does not need back/next buttons
    return null;
  }

  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-4 px-4 sm:px-6 mt-8 z-20 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {!isFirstStep ? (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        ) : (
          <div />
        )}

        {isFinalQuestionPage ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-all shadow-md shadow-indigo-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" /> Submit Survey
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-all shadow-md shadow-indigo-200"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};
