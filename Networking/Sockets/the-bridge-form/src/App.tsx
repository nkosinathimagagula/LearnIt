import { useEffect } from "react";
import { FormLayout } from "./compopnents/FormLayout";
import { StepOne } from "./compopnents/steps/StepOne";
import { StepThree } from "./compopnents/steps/StepThree";
import { StepTwo } from "./compopnents/steps/StepTwo";
import { useFormStore } from "./stores/useFormStore";
import { StepFour } from "./compopnents/steps/StepFour";
import { StepFive } from "./compopnents/steps/StepFive";
import { Success } from "./compopnents/steps/Success";

const App = () => {
    const { step, setSessionId, setStep } = useFormStore();

    const renderStep = () => {
        switch(step) {
            case 1:
                return <StepOne />;
            case 2: 
                return <StepTwo />;
            case 3:
                return <StepThree />;
            case 4:
                return <StepFour />;
            case 5:
                return <StepFive />;
            case 6:
                return <Success />;
            default:
                return <div className="text-center">Error: Unknown Step</div>;
        }
    }

    
    useEffect(() => {
        // Check if we are the "Second Device" via URL params
        const params = new URLSearchParams(window.location.search);
        const session = params.get('session');
    
        if (session) {
          setSessionId(session);
          setStep(4); // Land mobile device directly on Step 4
        }
    }, []);

    return (
        <FormLayout>
            {
              renderStep()
            }
        </FormLayout>
    )
}

export default App;