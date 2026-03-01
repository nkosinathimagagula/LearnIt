import { create } from 'zustand';

// Define the shape of our total form data
interface FormData {
  // Step 1 & 2 (Main Device)
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  // Step 3 & 4 (Second Device)
  idNumber: string;
  phoneNumber: string;
  // Step 5 (Main Device)
  preferences: string;
}

interface FormState {
  step: number;
  formData: FormData;
  sessionId: string | null;
  isSecondaryComplete: boolean;
  // Actions
  setStep: (step: number) => void;
  setSessionId: (id: string) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setSecondaryComplete: (status: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  step: 1,
  formData: { 
    firstName: '', 
    lastName: '', 
    email: '', 
    address: '', 
    idNumber: '', 
    phoneNumber: '', 
    preferences: '' 
},
  sessionId: null,
  isSecondaryComplete: false,
  setStep: (step) => set({ step }),
  setSessionId: (id) => set({ sessionId: id }),
  updateFormData: (data) => 
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setSecondaryComplete: (status) => set({ isSecondaryComplete: status }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
}));
