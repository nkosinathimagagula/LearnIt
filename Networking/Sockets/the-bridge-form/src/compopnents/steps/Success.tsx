import React from 'react';
import { CheckCircle, PartyPopper } from 'lucide-react';
import { useFormStore } from '../../stores/useFormStore';

export const Success: React.FC = () => {
  const {formData} = useFormStore();

  console.log(formData);
  
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">All Done!</h2>
        <p className="text-slate-500">Your 5-step cross-device submission was successful.</p>
      </div>
      <button 
        onClick={() => window.location.href = '/'}
        className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2 w-full"
      >
        <PartyPopper className="w-5 h-5" />
        Start a new session
      </button>
    </div>
  );
};
