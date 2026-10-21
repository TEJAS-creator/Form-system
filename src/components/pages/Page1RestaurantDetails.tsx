import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SurveyFormData } from '../../types/survey';
import { QUESTIONNAIRE_CONFIG } from '../../config/questionnaireConfig';
import { QuestionCard } from '../QuestionCard';
import { GoogleSignInModal } from '../GoogleSignInModal';
import { User, Phone, Building2, Store } from 'lucide-react';

interface Page1Props {
  form: UseFormReturn<SurveyFormData>;
}

export const Page1RestaurantDetails: React.FC<Page1Props> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const config = QUESTIONNAIRE_CONFIG.page1;
  const currentRole = watch('role');
  const currentEmail = watch('email');

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('role', val, { shouldValidate: true });
    if (val !== 'Other') {
      setValue('roleOther', '', { shouldValidate: false });
    }
  };

  const handleGoogleAccount = (email: string, name?: string) => {
    setValue('email', email, { shouldValidate: true });
    if (name && !watch('contactName')) {
      setValue('contactName', name, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-indigo-900/40">
        <span className="text-xs uppercase font-bold tracking-widest text-indigo-300 block mb-1">
          Public Survey
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          {QUESTIONNAIRE_CONFIG.surveyTitle}
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
          {QUESTIONNAIRE_CONFIG.surveySubtitle}
        </p>
      </div>

      {/* Google Sign-in helper */}
      <GoogleSignInModal
        currentEmail={currentEmail}
        onSelectAccount={handleGoogleAccount}
        onUseManualEmail={() => setValue('email', '')}
      />

      {/* Email input */}
      <QuestionCard
        title={config.email.label}
        description={config.email.helperText}
        required
        error={errors.email?.message}
      >
        <div className="relative">
          <input
            type="email"
            placeholder={config.email.placeholder}
            {...register('email')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            }`}
          />
        </div>
      </QuestionCard>

      {/* Restaurant Name */}
      <QuestionCard
        title={config.restaurantName.label}
        required
        error={errors.restaurantName?.message}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Store className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={config.restaurantName.placeholder}
            {...register('restaurantName')}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.restaurantName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            }`}
          />
        </div>
      </QuestionCard>

      {/* Number of outlets */}
      <QuestionCard
        title={config.outletsCount.label}
        required
        error={errors.outletsCount?.message}
      >
        <div className="relative max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Building2 className="w-4 h-4" />
          </div>
          <input
            type="number"
            min="1"
            placeholder={config.outletsCount.placeholder}
            {...register('outletsCount')}
            className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.outletsCount ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            }`}
          />
        </div>
      </QuestionCard>

      {/* Contact Details Section Header */}
      <div className="pt-2">
        <div className="border-l-4 border-indigo-600 pl-4 py-1 mb-4">
          <h3 className="text-lg font-bold text-slate-900">{config.contactSectionTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{config.contactSectionDescription}</p>
        </div>

        <div className="space-y-6">
          {/* Your Name */}
          <QuestionCard
            title={config.contactName.label}
            required
            error={errors.contactName?.message}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={config.contactName.placeholder}
                {...register('contactName')}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.contactName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
            </div>
          </QuestionCard>

          {/* Phone Number */}
          <QuestionCard
            title={config.phoneNumber.label}
            description={config.phoneNumber.helperText}
            required
            error={errors.phoneNumber?.message}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder={config.phoneNumber.placeholder}
                {...register('phoneNumber')}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.phoneNumber ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
            </div>
          </QuestionCard>

          {/* Your Role */}
          <QuestionCard
            title={config.role.label}
            required
            error={errors.role?.message}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {config.role.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                      currentRole === opt.value
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-500 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      checked={currentRole === opt.value}
                      onChange={handleRoleChange}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="ml-2.5 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Reveal text field if Other selected */}
              {currentRole === 'Other' && (
                <div className="pt-2 animate-fadeIn">
                  <input
                    type="text"
                    placeholder={config.roleOther.placeholder}
                    {...register('roleOther')}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.roleOther ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.roleOther && (
                    <span className="text-xs text-rose-500 mt-1 block">{errors.roleOther.message}</span>
                  )}
                </div>
              )}
            </div>
          </QuestionCard>
        </div>
      </div>
    </div>
  );
};
