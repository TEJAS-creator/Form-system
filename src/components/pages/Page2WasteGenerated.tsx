import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SurveyFormData } from '../../types/survey';
import { QUESTIONNAIRE_CONFIG } from '../../config/questionnaireConfig';
import { QuestionCard } from '../QuestionCard';
import { Trash2, DollarSign } from 'lucide-react';

interface Page2Props {
  form: UseFormReturn<SurveyFormData>;
}

export const Page2WasteGenerated: React.FC<Page2Props> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const config = QUESTIONNAIRE_CONFIG.page2;

  const wetWaste = watch('wetWastePerDay');
  const packagingWaste = watch('packagingWastePerDay');
  const discardMethod = watch('wasteDiscardMethod');
  const costType = watch('monthlyWasteCostType');
  const segregate = watch('segregateWaste');

  const handleWetWasteChange = (val: string) => {
    setValue('wetWastePerDay', val, { shouldValidate: true });
    if (val !== 'Other') setValue('wetWasteOther', '', { shouldValidate: false });
  };

  const handlePackagingWasteChange = (val: string) => {
    setValue('packagingWastePerDay', val, { shouldValidate: true });
    if (val !== 'Other') setValue('packagingWasteOther', '', { shouldValidate: false });
  };

  const handleDiscardMethodChange = (val: string) => {
    setValue('wasteDiscardMethod', val, { shouldValidate: true });
    if (val !== 'Other') setValue('wasteDiscardMethodOther', '', { shouldValidate: false });
  };

  const handleMonthlyCostChange = (val: string) => {
    setValue('monthlyWasteCostType', val, { shouldValidate: true });
    if (val !== 'Other') setValue('monthlyWasteCostAmount', '', { shouldValidate: false });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white border-l-4 border-indigo-600 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <Trash2 className="w-5 h-5 text-indigo-600 mr-2" />
          {QUESTIONNAIRE_CONFIG.steps[1].title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {QUESTIONNAIRE_CONFIG.steps[1].description}
        </p>
      </div>

      {/* 1. Wet Waste Per Day */}
      <QuestionCard
        title={config.wetWastePerDay.label}
        required
        error={errors.wetWastePerDay?.message}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {config.wetWastePerDay.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  wetWaste === opt.value
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={wetWaste === opt.value}
                  onChange={() => handleWetWasteChange(opt.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="ml-2.5 text-xs sm:text-sm">{opt.label}</span>
              </label>
            ))}
          </div>

          {wetWaste === 'Other' && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Specify wet waste quantity (e.g. 75 kg)"
                {...register('wetWasteOther')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.wetWasteOther ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.wetWasteOther && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.wetWasteOther.message}</span>
              )}
            </div>
          )}
        </div>
      </QuestionCard>

      {/* 2. Packaging Waste Per Day */}
      <QuestionCard
        title={config.packagingWastePerDay.label}
        required
        error={errors.packagingWastePerDay?.message}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {config.packagingWastePerDay.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  packagingWaste === opt.value
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={packagingWaste === opt.value}
                  onChange={() => handlePackagingWasteChange(opt.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="ml-2.5 text-xs sm:text-sm">{opt.label}</span>
              </label>
            ))}
          </div>

          {packagingWaste === 'Other' && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Specify packaging waste quantity (e.g. 60 kg)"
                {...register('packagingWasteOther')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.packagingWasteOther ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.packagingWasteOther && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.packagingWasteOther.message}</span>
              )}
            </div>
          )}
        </div>
      </QuestionCard>

      {/* 3. Waste Discard Method */}
      <QuestionCard
        title={config.wasteDiscardMethod.label}
        required
        error={errors.wasteDiscardMethod?.message}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {config.wasteDiscardMethod.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  discardMethod === opt.value
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={discardMethod === opt.value}
                  onChange={() => handleDiscardMethodChange(opt.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="ml-2.5 text-xs sm:text-sm">{opt.label}</span>
              </label>
            ))}
          </div>

          {discardMethod === 'Other' && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Specify discard method"
                {...register('wasteDiscardMethodOther')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.wasteDiscardMethodOther ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.wasteDiscardMethodOther && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.wasteDiscardMethodOther.message}</span>
              )}
            </div>
          )}
        </div>
      </QuestionCard>

      {/* 4. Monthly Waste Collector Payment */}
      <QuestionCard
        title={config.monthlyWasteCostType.label}
        required
        error={errors.monthlyWasteCostType?.message || errors.monthlyWasteCostAmount?.message}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {config.monthlyWasteCostType.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  costType === opt.value
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={costType === opt.value}
                  onChange={() => handleMonthlyCostChange(opt.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="ml-2.5 text-xs sm:text-sm">{opt.label}</span>
              </label>
            ))}
          </div>

          {/* If Other selected, provide numeric monthly cost input in Rs. */}
          {costType === 'Other' && (
            <div className="pt-2 animate-fadeIn">
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-medium text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder={config.monthlyWasteCostType.amountPlaceholder}
                  {...register('monthlyWasteCostAmount')}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.monthlyWasteCostAmount ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.monthlyWasteCostAmount && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.monthlyWasteCostAmount.message}</span>
              )}
            </div>
          )}
        </div>
      </QuestionCard>

      {/* 5. Segregate Waste into Wet & Dry */}
      <QuestionCard
        title={config.segregateWaste.label}
        required
        error={errors.segregateWaste?.message}
      >
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {config.segregateWaste.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer text-center font-medium transition-all ${
                segregate === opt.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                {...register('segregateWaste')}
                className="sr-only"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
};
