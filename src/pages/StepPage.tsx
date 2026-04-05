import { useParams, Navigate } from 'react-router-dom'
import { CreatorProvider } from '../contexts/CreatorContext'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import Step7 from './steps/Step7'
import Step8 from './steps/Step8'
import Step9 from './steps/Step9'

const STEPS: Record<number, React.ComponentType> = {
  1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5,
  6: Step6, 7: Step7, 8: Step8, 9: Step9,
}

export default function StepPage() {
  const { step } = useParams()
  const stepNum = parseInt(step || '1')
  const StepComponent = STEPS[stepNum]
  if (!StepComponent) return <Navigate to="/skapa" replace />

  return (
    <CreatorProvider>
      <StepComponent />
    </CreatorProvider>
  )
}
