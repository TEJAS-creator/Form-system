import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SurveyFormData, SurveyStep } from './types/survey';
import {
  page1Schema,
  page2Schema,
  page3Schema,
  page4Schema,
  page5Schema,
  fullSurveySchema,
} from './validation/surveySchema';
import { surveyApi } from './services/api';
import { Header } from './components/Header';
import { NavigationButtons } from './components/NavigationButtons';

// Page components
import { Page1RestaurantDetails } from './components/pages/Page1RestaurantDetails';
import { Page2WasteGenerated } from './components/pages/Page2WasteGenerated';
import { Page3OnlineSales } from './components/pages/Page3OnlineSales';
import { Page4ReuseAndDineIn } from './components/pages/Page4ReuseAndDineIn';
import { Page5KitchenIngredients } from './components/pages/Page5KitchenIngredients';
import { Page6ThankYou } from './components/pages/Page6ThankYou';

const DRAFT_STORAGE_KEY = 'bangalore_restaurant_survey_draft_v1';

const defaultFormValues: SurveyFormData = {
  // Page 1
  email: '',
  restaurantName: '',
  outletsCount: 1,
  contactName: '',
  phoneNumber: '',
  role: 'Owner',
  roleOther: '',

  // Page 2
  wetWastePerDay: 'Less than 5 kg',
  wetWasteOther: '',
  packagingWastePerDay: 'Less than 5 kg',
  packagingWasteOther: '',
  wasteDiscardMethod: 'Municipality pickup',
  wasteDiscardMethodOther: '',
  monthlyWasteCostType: 'None',
  monthlyWasteCostAmount: '',
  segregateWaste: 'Yes',

  // Page 3
  onlineSalesPercent: '0–25%',
  packingMaterials: ['Plastic'],
  packingMaterialsOther: '',
  containerTypesCount: '1–2',
  containerTypesCountOther: '',
  onlineContainers: [
    {
      id: '1',
      name: 'Standard Meal Box 500ml',
      sizeOrVolume: '500ml',
      material: 'PP Plastic',
      quantityPerDay: 50,
    },
  ],

  // Page 4
  wouldSwitchToReuse: 'Yes',
  hasDineIn: 'Yes',
  usesSingleUseDineIn: 'No',
  dineInContainers: [],
  barrierToDineInReusables: '',

  // Page 5
  kitchenIngredients: [
    {
      id: '1',
      product: 'Cooking Oil',
      quantityPerMonth: 30,
      unit: 'litres',
      unitOther: '',
      brand: 'Fortune',
    },
  ],
};

const getInitialFormValues = (): SurveyFormData => {
  const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultFormValues;
    }
  }
  return defaultFormValues;
};

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SurveyStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | undefined>(undefined);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSavedDraft, setIsSavedDraft] = useState(false);

  // Initialize react-hook-form with plain object for defaultValues
  const form = useForm<SurveyFormData>({
    defaultValues: getInitialFormValues(),
    mode: 'onTouched',
  });

  const { watch, handleSubmit, setError, clearErrors } = form;
  const formValues = watch();

  // Auto-save draft on form change
  useEffect(() => {
    if (currentStep < 6) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formValues));
        setIsSavedDraft(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formValues, currentStep]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  /**
   * Validate current step before advancing
   */
  const validateCurrentStep = (): boolean => {
    clearErrors();
    let result: any;

    if (currentStep === 1) {
      result = page1Schema.safeParse(formValues);
    } else if (currentStep === 2) {
      result = page2Schema.safeParse(formValues);
    } else if (currentStep === 3) {
      result = page3Schema.safeParse(formValues);
    } else if (currentStep === 4) {
      result = page4Schema.safeParse(formValues);
    } else if (currentStep === 5) {
      result = page5Schema.safeParse(formValues);
    }

    if (result && !result.success) {
      const issues = result.error.issues;
      issues.forEach((issue: any) => {
        const path = issue.path.join('.') as any;
        setError(path, { type: 'manual', message: issue.message });
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as SurveyStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SurveyStep);
    }
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart and clear all entries?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      form.reset(defaultFormValues);
      setSubmissionId(undefined);
      setSubmitError(null);
      setCurrentStep(1);
    }
  };

  /**
   * Final Submission handler called on Page 5
   */
  const onSubmitForm = async () => {
    setSubmitError(null);

    // Validate full survey schema
    const fullValidation = fullSurveySchema.safeParse(formValues);

    if (!fullValidation.success) {
      const issues = fullValidation.error.issues;
      console.warn('Validation errors on submission:', issues);

      // Find first page with error
      for (const issue of issues) {
        const path = issue.path.join('.') as any;
        setError(path, { type: 'manual', message: issue.message });
      }

      // Check which step contains the error
      if (!page1Schema.safeParse(formValues).success) setCurrentStep(1);
      else if (!page2Schema.safeParse(formValues).success) setCurrentStep(2);
      else if (!page3Schema.safeParse(formValues).success) setCurrentStep(3);
      else if (!page4Schema.safeParse(formValues).success) setCurrentStep(4);
      else if (!page5Schema.safeParse(formValues).success) setCurrentStep(5);

      setSubmitError('Please fix highlighted errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await surveyApi.submitSurvey(fullValidation.data);

      if (response.success) {
        setSubmissionId(response.submissionId);
        // Clear local storage draft after successful backend save
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        // Navigate to Page 6 (Thank You)
        setCurrentStep(6);
      } else {
        setSubmitError(response.message || 'Failed to submit survey. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header with step progress bar */}
      <Header
        currentStep={currentStep}
        totalSteps={5}
        onReset={currentStep < 6 ? handleRestart : undefined}
        isSavedDraft={isSavedDraft}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center justify-between shadow-xs">
            <span>{submitError}</span>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-rose-500 hover:text-rose-800 font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
          {currentStep === 1 && <Page1RestaurantDetails form={form} />}
          {currentStep === 2 && <Page2WasteGenerated form={form} />}
          {currentStep === 3 && <Page3OnlineSales form={form} />}
          {currentStep === 4 && <Page4ReuseAndDineIn form={form} />}
          {currentStep === 5 && <Page5KitchenIngredients form={form} />}
          {currentStep === 6 && (
            <Page6ThankYou
              submissionId={submissionId}
              onRestart={() => {
                form.reset(defaultFormValues);
                setCurrentStep(1);
              }}
            />
          )}
        </form>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <NavigationButtons
        currentStep={currentStep}
        totalQuestionSteps={5}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit(onSubmitForm)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default App;
