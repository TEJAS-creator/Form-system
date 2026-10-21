import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SurveyFormData, ContainerItem } from '../../types/survey';
import { QUESTIONNAIRE_CONFIG } from '../../config/questionnaireConfig';
import { QuestionCard } from '../QuestionCard';
import { RepeatableTable, ColumnDefinition } from '../RepeatableTable';
import { Package, ShoppingBag } from 'lucide-react';

interface Page3Props {
  form: UseFormReturn<SurveyFormData>;
}

export const Page3OnlineSales: React.FC<Page3Props> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const config = QUESTIONNAIRE_CONFIG.page3;

  const salesPercent = watch('onlineSalesPercent');
  const materials = watch('packingMaterials') || [];
  const containerCount = watch('containerTypesCount');
  const onlineContainers: ContainerItem[] = watch('onlineContainers') || [];

  const handleMaterialToggle = (value: string) => {
    let updated: string[];
    if (materials.includes(value)) {
      updated = materials.filter((m) => m !== value);
    } else {
      updated = [...materials, value];
    }
    setValue('packingMaterials', updated, { shouldValidate: true });

    if (!updated.includes('Other')) {
      setValue('packingMaterialsOther', '', { shouldValidate: false });
    }
  };

  const handleContainerCountChange = (val: string) => {
    setValue('containerTypesCount', val, { shouldValidate: true });
    if (val !== 'Other') {
      setValue('containerTypesCountOther', '', { shouldValidate: false });
    }
  };

  const handleAddContainer = () => {
    const newItem: ContainerItem = {
      id: Date.now().toString(),
      name: '',
      sizeOrVolume: '',
      material: '',
      quantityPerDay: '',
    };
    setValue('onlineContainers', [...onlineContainers, newItem], { shouldValidate: true });
  };

  const handleRemoveContainer = (index: number) => {
    const updated = onlineContainers.filter((_, idx) => idx !== index);
    setValue('onlineContainers', updated, { shouldValidate: true });
  };

  const handleChangeContainerField = (index: number, field: string, value: any) => {
    const updated = [...onlineContainers];
    updated[index] = { ...updated[index], [field]: value };
    setValue('onlineContainers', updated, { shouldValidate: true });
  };

  const containerColumns: ColumnDefinition[] = [
    { key: 'name', label: config.onlineContainersTable.columns.name.label, placeholder: config.onlineContainersTable.columns.name.placeholder },
    { key: 'sizeOrVolume', label: config.onlineContainersTable.columns.size.label, placeholder: config.onlineContainersTable.columns.size.placeholder },
    { key: 'material', label: config.onlineContainersTable.columns.material.label, placeholder: config.onlineContainersTable.columns.material.placeholder },
    { key: 'quantityPerDay', label: config.onlineContainersTable.columns.quantity.label, placeholder: config.onlineContainersTable.columns.quantity.placeholder, type: 'number' },
  ];

  // Parse nested errors for table
  const tableErrors: Record<number, Record<string, string>> = {};
  if (Array.isArray(errors.onlineContainers)) {
    (errors.onlineContainers as any[]).forEach((err, idx) => {
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
      {/* Step Banner */}
      <div className="bg-white border-l-4 border-indigo-600 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <ShoppingBag className="w-5 h-5 text-indigo-600 mr-2" />
          {QUESTIONNAIRE_CONFIG.steps[2].title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {QUESTIONNAIRE_CONFIG.steps[2].description}
        </p>
      </div>

      {/* 1. Percentage of total sales online */}
      <QuestionCard
        title={config.onlineSalesPercent.label}
        required
        error={errors.onlineSalesPercent?.message}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {config.onlineSalesPercent.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer font-medium text-xs sm:text-sm transition-all ${
                salesPercent === opt.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-xs font-semibold'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                {...register('onlineSalesPercent')}
                className="sr-only"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </QuestionCard>

      {/* 2. Packing Materials (Multi-Select) */}
      <QuestionCard
        title={config.packingMaterials.label}
        description={config.packingMaterials.helperText}
        required
        error={errors.packingMaterials?.message}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {config.packingMaterials.options.map((opt) => {
              const isChecked = materials.includes(opt.value);

              return (
                <label
                  key={opt.value}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleMaterialToggle(opt.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
                  />
                  <span className="ml-2.5 text-xs sm:text-sm">{opt.label}</span>
                </label>
              );
            })}
          </div>

          {materials.includes('Other') && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Specify other material (e.g. Cornstarch packaging)"
                {...register('packingMaterialsOther')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.packingMaterialsOther ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.packingMaterialsOther && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.packingMaterialsOther.message}</span>
              )}
            </div>
          )}
        </div>
      </QuestionCard>

      {/* 3. Container Types Count */}
      <QuestionCard
        title={config.containerTypesCount.label}
        required
        error={errors.containerTypesCount?.message}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {config.containerTypesCount.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer text-xs sm:text-sm transition-all ${
                  containerCount === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-xs font-semibold'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={containerCount === opt.value}
                  onChange={() => handleContainerCountChange(opt.value)}
                  className="sr-only"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          {containerCount === 'Other' && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Specify container types count (e.g. 10+)"
                {...register('containerTypesCountOther')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.containerTypesCountOther ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.containerTypesCountOther && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.containerTypesCountOther.message}</span>
              )}
            </div>
          )}
        </div>
      </QuestionCard>

      {/* 4. Repeatable Container Table */}
      <QuestionCard
        title={config.onlineContainersTable.title}
        description={config.onlineContainersTable.subtitle}
        required
        error={typeof errors.onlineContainers?.message === 'string' ? errors.onlineContainers?.message : undefined}
      >
        <RepeatableTable
          columns={containerColumns}
          data={onlineContainers}
          onAddRow={handleAddContainer}
          onRemoveRow={handleRemoveContainer}
          onChangeField={handleChangeContainerField}
          addButtonText={config.onlineContainersTable.addButtonText}
          minRows={1}
          errors={tableErrors}
        />
      </QuestionCard>
    </div>
  );
};
