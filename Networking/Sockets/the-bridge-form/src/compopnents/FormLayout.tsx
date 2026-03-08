import React from 'react';
import { TOTAL_STEPS } from '../constants';
import { useFormStore } from '../stores/useFormStore';

export const FormLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const step = useFormStore((state) => state.step);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              { step < TOTAL_STEPS && `Step ${step} of ${TOTAL_STEPS}` }
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};