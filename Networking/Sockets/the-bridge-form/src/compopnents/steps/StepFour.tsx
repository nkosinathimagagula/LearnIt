import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { mobileStepSchema } from '../../schemas/formSchemas';
import { useFormStore } from '../../stores/useFormStore';
import { useSocket } from '../../hooks/useSocket';
import { CreditCard, Phone, Send, Smartphone } from 'lucide-react';

export const StepFour: React.FC = () => {
  const { sessionId, updateFormData, formData } = useFormStore();
  const { notifyComplete, disconnect } = useSocket(sessionId);
  const [isFinished, setIsFinished] = useState(false); // Track completion

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(mobileStepSchema),
    defaultValues: {
      idNumber: formData.idNumber,
      phoneNumber: formData.phoneNumber,
    }
  });

  const onSubmit = (data: any) => {
    updateFormData(data);
    if (sessionId) {
      notifyComplete(sessionId); // Tell the Main device we are done!
      setIsFinished(true); // Switch the UI to show completion state

      
      disconnect(); // Clean up the socket after notifying completion
    }
  };

  if (isFinished) {
    return (
      <div className="text-center space-y-4 py-10 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Smartphone className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Verification Sent!</h2>
        <p className="text-slate-500">
          You can now put this device away and <strong>return to your main screen</strong> to finish the last step.
        </p>
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 text-sm 600 font-medium bg-orange-50 px-6 py-2 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            Disconnected
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Mobile Verification</h2>
        <p className="text-slate-500 text-sm">Please provide your ID and contact number.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ID Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              {...register('idNumber')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              placeholder="Enter your ID number"
            />
          </div>
          {errors.idNumber && <p className="text-xs text-red-500 mt-1">{errors.idNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              {...register('phoneNumber')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
      >
        {isSubmitting ? 'Syncing...' : 'Complete Verification'}
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};