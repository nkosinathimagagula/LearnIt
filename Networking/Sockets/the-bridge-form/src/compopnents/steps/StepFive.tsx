import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { step5Schema } from '../../schemas/formSchemas';
import { useFormStore } from '../../stores/useFormStore';
import { Flag } from 'lucide-react';

export const StepFive: React.FC = () => {
  const { updateFormData, nextStep, formData } = useFormStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(step5Schema),
    defaultValues: {
      preferences: formData.preferences,
      agreeToTerms: false,
    }
  });

  const onSubmit = (data: any) => {
    updateFormData(data);
    nextStep(); // Takes us to the Final Completion Page
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Final Step</h2>
        <p className="text-slate-500 text-sm">Almost there! Just a few preferences.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
          <select 
            {...register('preferences')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white"
          >
            <option value="">Select...</option>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
          {errors.preferences && <p className="text-xs text-red-500 mt-1">{errors.preferences.message}</p>}
        </div>

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <input 
            type="checkbox" 
            {...register('agreeToTerms')} 
            className="mt-1 w-4 h-4 text-blue-600 rounded" 
          />
          <label className="text-sm text-slate-600">
            I agree to the terms and conditions and confirm that the mobile data provided is accurate.
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
      >
        Finish & Submit
        <Flag className="w-5 h-5" />
      </button>
    </form>
  );
};