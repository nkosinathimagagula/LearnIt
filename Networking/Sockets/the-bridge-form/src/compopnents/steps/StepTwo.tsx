import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { step2Schema } from '../../schemas/formSchemas';
import { useFormStore } from '../../stores/useFormStore';
import { Mail, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface Step2Inputs {
  email: string;
  address: string;
}

export const StepTwo: React.FC = () => {
  const { updateFormData, nextStep, prevStep, formData, setSessionId } = useFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Inputs>({
    resolver: yupResolver(step2Schema),
    defaultValues: {
      email: formData.email,
      address: formData.address,
    },
  });

  const onSubmit = (data: Step2Inputs) => {
    updateFormData(data);
    
    // Generate a unique ID for the cross-device session
    const uniqueId = crypto.randomUUID();
    // const uniqueId = "aaaaa"; // For testing purposes, use a fixed ID. Replace with above line in production.
    setSessionId(uniqueId);

    // TODO: REMOVE THIS LOG - ONLY FOR DEMO TO SHOW THE ID BEING GENERATED
    console.log('sessionId: ', uniqueId);
    
    
    nextStep(); // This will take us to the Handoff/QR screen
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Contact Info</h2>
        <p className="text-slate-500 text-sm">How can we reach you?</p>
      </div>

      <div className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              {...register('email')}
              type="email"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none 
                ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Home Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/7 text-slate-400 w-5 h-5" />
            <textarea
              {...register('address')}
              rows={3}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none resize-none
                ${errors.address ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              placeholder="Enter your street address"
            />
          </div>
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-6 rounded-xl 
            flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <button
          type="submit"
          className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl 
            flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
        >
          Generate QR
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};