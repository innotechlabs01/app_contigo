import * as React from "react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300",
                index < currentStep
                  ? "bg-secondary text-white"
                  : index === currentStep
                  ? "bg-secondary text-white ring-2 sm:ring-4 ring-secondary/20"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "mt-1 sm:mt-2 text-xs sm:text-sm font-medium",
                index <= currentStep ? "text-secondary" : "text-slate-400"
              )}
            >
              <span className="hidden xs:inline">{step.title}</span>
              <span className="xs:hidden">{step.title.substring(0, 3)}</span>
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 min-w-0",
                index < currentStep ? "bg-secondary" : "bg-slate-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}