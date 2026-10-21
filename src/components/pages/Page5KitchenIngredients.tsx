import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SurveyFormData, IngredientItem } from '../../types/survey';
import { QUESTIONNAIRE_CONFIG } from '../../config/questionnaireConfig';
import { QuestionCard } from '../QuestionCard';
import { RepeatableTable, ColumnDefinition } from '../RepeatableTable';
import { ShoppingBag } from 'lucide-react';

interface Page5Props {
  form: UseFormReturn<SurveyFormData>;
}

export const Page5KitchenIngredients: React.FC<Page5Props> = ({ form }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const config = QUESTIONNAIRE_CONFIG.page5;
  const ingredients: IngredientItem[] = watch('kitchenIngredients') || [];

  const handleAddIngredient = () => {
    const newItem: IngredientItem = {
      id: Date.now().toString(),
      product: '',
      quantityPerMonth: '',
      unit: 'kg',
      unitOther: '',
      brand: '',
    };
    setValue('kitchenIngredients', [...ingredients, newItem], { shouldValidate: true });
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = ingredients.filter((_, idx) => idx !== index);
    setValue('kitchenIngredients', updated, { shouldValidate: true });
  };

  const handleChangeIngredientField = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setValue('kitchenIngredients', updated, { shouldValidate: true });
  };

  const ingredientColumns: ColumnDefinition[] = [
    {
      key: 'product',
      label: config.kitchenIngredientsTable.columns.product.label,
      placeholder: config.kitchenIngredientsTable.columns.product.placeholder,
    },
    {
      key: 'quantityPerMonth',
      label: config.kitchenIngredientsTable.columns.quantity.label,
      placeholder: config.kitchenIngredientsTable.columns.quantity.placeholder,
      type: 'number',
    },
    {
      key: 'unit',
      label: config.kitchenIngredientsTable.columns.unit.label,
      type: 'select',
      options: config.kitchenIngredientsTable.columns.unit.options,
      customInputKey: 'unitOther',
    },
    {
      key: 'brand',
      label: config.kitchenIngredientsTable.columns.brand.label,
      placeholder: config.kitchenIngredientsTable.columns.brand.placeholder,
    },
  ];

  const tableErrors: Record<number, Record<string, string>> = {};
  if (Array.isArray(errors.kitchenIngredients)) {
    (errors.kitchenIngredients as any[]).forEach((err, idx) => {
      if (err) {
        tableErrors[idx] = {
          product: err.product?.message,
          quantityPerMonth: err.quantityPerMonth?.message,
          unit: err.unit?.message,
          unitOther: err.unitOther?.message,
          brand: err.brand?.message,
        };
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border-l-4 border-indigo-600 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <ShoppingBag className="w-5 h-5 text-indigo-600 mr-2" />
          {QUESTIONNAIRE_CONFIG.steps[4].title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {QUESTIONNAIRE_CONFIG.steps[4].description}
        </p>
      </div>

      {/* Repeatable Ingredients Table */}
      <QuestionCard
        title={config.kitchenIngredientsTable.title}
        description={config.kitchenIngredientsTable.subtitle}
        required
        error={typeof errors.kitchenIngredients?.message === 'string' ? errors.kitchenIngredients?.message : undefined}
      >
        <RepeatableTable
          columns={ingredientColumns}
          data={ingredients}
          onAddRow={handleAddIngredient}
          onRemoveRow={handleRemoveIngredient}
          onChangeField={handleChangeIngredientField}
          addButtonText={config.kitchenIngredientsTable.addButtonText}
          minRows={1}
          errors={tableErrors}
        />
      </QuestionCard>
    </div>
  );
};
