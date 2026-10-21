import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SurveyFormData, ContainerItem } from '../../types/survey';
import { QUESTIONNAIRE_CONFIG } from '../../config/questionnaireConfig';
import { QuestionCard } from '../QuestionCard';
import { RepeatableTable, ColumnDefinition } from '../RepeatableTable';
import { RefreshCw, UtensilsCrossed } from 'lucide-react';

interface Page4Props {
  form: UseFormReturn<SurveyFormData>;
}

export const Page4ReuseAndDineIn: React.FC<Page4Props> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const config = QUESTIONNAIRE_CONFIG.page4;

  const wouldSwitch = watch('wouldSwitchToReuse');
  const hasDineIn = watch('hasDineIn');
  const usesSingleUse = watch('usesSingleUseDineIn');
  const dineInContainers: ContainerItem[] = watch('dineInContainers') || [];

  const handleHasDineInChange = (val: string) => {
    setValue('hasDineIn', val, { shouldValidate: true });
    if (val === 'No') {
      setValue('usesSingleUseDineIn', undefined, { shouldValidate: false });
      setValue('dineInContainers', [], { shouldValidate: false });
      setValue('barrierToDineInReusables', '', { shouldValidate: false });
    }
  };

  const handleUsesSingleUseChange = (val: string) => {
    setValue('usesSingleUseDineIn', val, { shouldValidate: true });
    if (val === 'No') {
      setValue('dineInContainers', [], { shouldValidate: false });
      setValue('barrierToDineInReusables', '', { shouldValidate: false });
    }
  };

  const handleAddDineInContainer = () => {
    const newItem: ContainerItem = {
      id: Date.now().toString(),
      name: '',
      sizeOrVolume: '',
      material: '',
      quantityPerDay: '',
    };
    setValue('dineInContainers', [...dineInContainers, newItem], { shouldValidate: true });
  };

  const handleRemoveDineInContainer = (index: number) => {
    const updated = dineInContainers.filter((_, idx) => idx !== index);
    setValue('dineInContainers', updated, { shouldValidate: true });
  };

  const handleChangeDineInContainerField = (index: number, field: string, value: any) => {
    const updated = [...dineInContainers];
    updated[index] = { ...updated[index], [field]: value };
    setValue('dineInContainers', updated, { shouldValidate: true });
  };

  const dineInColumns: ColumnDefinition[] = [
    { key: 'name', label: config.dineInContainersTable.columns.name.label, placeholder: config.dineInContainersTable.columns.name.placeholder },
    { key: 'sizeOrVolume', label: config.dineInContainersTable.columns.size.label, placeholder: config.dineInContainersTable.columns.size.placeholder },
    { key: 'material', label: config.dineInContainersTable.columns.material.label, placeholder: config.dineInContainersTable.columns.material.placeholder },
    { key: 'quantityPerDay', label: config.dineInContainersTable.columns.quantity.label, placeholder: config.dineInContainersTable.columns.quantity.placeholder, type: 'number' },
  ];

  const tableErrors: Record<number, Record<string, string>> = {};
  if (Array.isArray(errors.dineInContainers)) {
    (errors.dineInContainers as any[]).forEach((err, idx) => {
      if (err) {
        tableErrors[idx] = {
          name: err.name?.message,
          sizeOrVolume: err.sizeOrVolume?.message,
          material: err.material?.message,
          quantityPerDay: err.quantityPerDay?.message,
        };
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border-l-4 border-indigo-600 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <RefreshCw className="w-5 h-5 text-indigo-600 mr-2" />
          {QUESTIONNAIRE_CONFIG.steps[3].title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {QUESTIONNAIRE_CONFIG.steps[3].description}
        </p>
      </div>

      {/* 1. Reuse System Switch Intent */}
      <QuestionCard
        title={config.wouldSwitchToReuse.label}
        required
        error={errors.wouldSwitchToReuse?.message}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {config.wouldSwitchToReuse.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center justify-center p-3.5 rounded-xl border cursor-pointer font-semibold text-sm transition-all ${
                wouldSwitch === opt.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                {...register('wouldSwitchToReuse')}
                className="sr-only"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </QuestionCard>

      {/* 2. Dine-In Service Presence */}
      <QuestionCard
        title={config.hasDineIn.label}
        required
        error={errors.hasDineIn?.message}
      >
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {config.hasDineIn.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer font-semibold text-sm transition-all ${
                hasDineIn === opt.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                checked={hasDineIn === opt.value}
                onChange={() => handleHasDineInChange(opt.value)}
                className="sr-only"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </QuestionCard>

      {/* CONDITIONAL BRANCH: Only if Yes to Dine-In */}
      {hasDineIn === 'Yes' && (
        <div className="space-y-6 pt-2 border-t border-slate-200/80 animate-fadeIn">
          <div className="flex items-center space-x-2 text-indigo-900 font-bold text-base">
            <UtensilsCrossed className="w-5 h-5 text-indigo-600" />
            <span>Dine-In Service Details</span>
          </div>

          {/* Sub-question A: Do you use single-use items for dine-in? */}
          <QuestionCard
            title={config.usesSingleUseDineIn.label}
            required
            error={errors.usesSingleUseDineIn?.message}
          >
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              {config.usesSingleUseDineIn.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer font-semibold text-sm transition-all ${
                    usesSingleUse === opt.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    checked={usesSingleUse === opt.value}
                    onChange={() => handleUsesSingleUseChange(opt.value)}
                    className="sr-only"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </QuestionCard>

          {/* Sub-question B: Repeatable Table (Only if Yes to single-use items) */}
          {usesSingleUse === 'Yes' && (
            <div className="space-y-6 animate-fadeIn">
              <QuestionCard
                title={config.dineInContainersTable.title}
                description={config.dineInContainersTable.subtitle}
                required
                error={typeof errors.dineInContainers?.message === 'string' ? errors.dineInContainers?.message : undefined}
              >
                <RepeatableTable
                  columns={dineInColumns}
                  data={dineInContainers}
                  onAddRow={handleAddDineInContainer}
                  onRemoveRow={handleRemoveDineInContainer}
                  onChangeField={handleChangeDineInContainerField}
                  addButtonText={config.dineInContainersTable.addButtonText}
                  minRows={1}
                  errors={tableErrors}
                />
              </QuestionCard>

              {/* Sub-question C: What stops you from using steel, glass, or reusables? */}
              <QuestionCard
                title={config.barrierToDineInReusables.label}
                description={config.barrierToDineInReusables.helperText}
                error={errors.barrierToDineInReusables?.message}
              >
                <textarea
                  rows={4}
                  placeholder={config.barrierToDineInReusables.placeholder}
                  {...register('barrierToDineInReusables')}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </QuestionCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
