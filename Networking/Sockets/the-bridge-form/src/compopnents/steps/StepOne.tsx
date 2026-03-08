import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { step1Schema } from '../../schemas/formSchemas';
import { useFormStore } from '../../stores/useFormStore';
import { User, ArrowRight } from 'lucide-react';

// Define the shape for this specific step's data
interface Step1Inputs {
  firstName: string;
  lastName: string;
}

export const StepOne: React.FC = () => {
  const { updateFormData, nextStep, formData } = useFormStore();

  // Initialize form with existing data from store (if user went back/forth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Inputs>({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
    },
  });

  const onSubmit = (data: Step1Inputs) => {
    updateFormData(data); // Save to Zustand
    nextStep();           // Move to Step 2
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Personal Details</h2>
        <p className="text-slate-500 text-sm">Let's start with your basic information.</p>
      </div>

      <div className="space-y-4">
        {/* First Name Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              {...register('firstName')}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none 
                ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        {/* Last Name Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              {...register('lastName')}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none 
                ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl 
          flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
      >
        Next Step
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
};