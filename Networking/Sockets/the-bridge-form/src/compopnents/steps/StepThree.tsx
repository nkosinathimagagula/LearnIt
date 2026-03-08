import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useFormStore } from '../../stores/useFormStore';
import { Smartphone, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export const StepThree: React.FC = () => {
  const { sessionId, isSecondaryComplete, setStep } = useFormStore();

  useSocket(sessionId); // Initialize socket connection and listeners

  // The URL the second device will open. 
  // In production, this would be your actual domain.
  const remoteUrl = `${window.location.origin}/remote?session=${sessionId}`;

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Verify on Mobile</h2>
        <p className="text-slate-500 text-sm">
          Scan this code with your phone to complete the next steps securely.
        </p>
      </div>

      <div className="flex justify-center p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
        {sessionId ? (
          <QRCodeSVG 
            value={remoteUrl} 
            size={200}
            level="H"
            // includeMargin={true}
            marginSize={4}
            className="rounded-lg"
          />
        ) : (
          <div className="h-50 w-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
        isSecondaryComplete 
          ? 'bg-green-50 border-green-200 text-green-700' 
          : 'bg-blue-50 border-blue-200 text-blue-700'
      }`}>
        {isSecondaryComplete ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : (
          <Smartphone className="w-6 h-6 animate-pulse" />
        )}
        <span className="text-sm font-medium">
          {isSecondaryComplete 
            ? 'Mobile steps completed!' 
            : 'Waiting for mobile device...'}
        </span>
      </div>

      <button
        onClick={() => setStep(5)}
        disabled={!isSecondaryComplete}
        className={`w-full font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all
          ${isSecondaryComplete 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
      >
        Continue to Step 5
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};