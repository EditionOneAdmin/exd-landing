'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface NarrativeStep {
  id: string;
  content: ReactNode;
  onActivate?: () => void;
}

interface ScrollySectionProps {
  steps: NarrativeStep[];
  visualization: ReactNode;
  activeStep: string;
  onStepChange: (stepId: string) => void;
  className?: string;
}

function StepTrigger({ step, onActivate, isActive }: { step: NarrativeStep; onActivate: () => void; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-40% 0px -40% 0px' });

  useEffect(() => {
    if (isInView) {
      onActivate();
      step.onActivate?.();
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className="min-h-[60vh] flex items-center py-16 md:py-24"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg">
        {step.content}
      </div>
    </motion.div>
  );
}

export default function ScrollySection({ steps, visualization, activeStep, onStepChange, className = '' }: ScrollySectionProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Narrative column */}
        <div className="md:w-[40%] relative z-10">
          {steps.map((step) => (
            <StepTrigger
              key={step.id}
              step={step}
              onActivate={() => onStepChange(step.id)}
              isActive={activeStep === step.id}
            />
          ))}
        </div>

        {/* Sticky visualization */}
        <div className="hidden md:block md:w-[60%]">
          <div className="sticky top-[15vh] h-[70vh] flex items-center justify-center">
            {visualization}
          </div>
        </div>
      </div>

      {/* Mobile: visualization shown between steps */}
      <div className="md:hidden sticky top-20 z-0 mb-8">
        <div className="h-[50vh] flex items-center justify-center">
          {visualization}
        </div>
      </div>
    </div>
  );
}
