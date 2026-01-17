import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { FloorPlan } from './FloorPlan';
import { STAGES } from '../constants';

export const FramingScene = () => {
    // Controls which item is currently in the "Spotlight" (zoomed center).
    // 0: First item spotlight
    // 1: First item moved to grid, Second item spotlight
    // ...
    // STAGES.length: All items in grid.
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Auto-advance ONLY after the first step (user clicks to start)
        if (step > 0 && step < STAGES.length) {
            const timer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    return (
        <LayoutGroup>
            <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center overflow-hidden">

                {/* 1. The Grid (Final Destination) 
                    Items appear here once step > idx
                */}
                <div className="flex flex-row justify-center items-center gap-4 md:gap-12 w-full max-w-6xl px-4 z-0 h-full">
                    {STAGES.map((stage, idx) => (
                        <div key={stage.id} className="flex flex-col items-center w-32 md:w-64 justify-center">
                            {/* Placeholder to reserve space? Or just flex layout. 
                                 We use a container to ensure the layout remains stable. */}

                            {step > idx && (
                                <SceneItem stage={stage} layoutId={stage.id} isSpotlight={false} />
                            )}

                            {/* Keep placeholder space empty if not yet arrived, to maintain grid structure? 
                                 Yes, the div above has width, so it holds space. 
                             */}
                        </div>
                    ))}
                </div>

                {/* 2. The Spotlight (Intro State) 
                    Items appear here when step === idx
                */}
                <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-auto z-20 ${step === 0 ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={() => {
                        if (step === 0) {
                            setStep(prev => prev + 1);
                        }
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {step < STAGES.length && (
                            <div className="w-80 md:w-96 h-80 md:h-96 flex items-center justify-center">
                                {/* We render the CURRENT step item here */}
                                <SceneItem
                                    key={`spotlight-${STAGES[step].id}`}
                                    stage={STAGES[step]}
                                    layoutId={STAGES[step].id}
                                    isSpotlight={true}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Background overlay for spotlight focus (optional) */}
                {step < STAGES.length && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10"
                    />
                )}
            </div>
        </LayoutGroup>
    );
};

// Reusable Item Component for both states
const SceneItem = ({ stage, layoutId, isSpotlight }: { stage: any, layoutId: string, isSpotlight: boolean }) => {
    return (
        <motion.div
            layoutId={layoutId}
            className={`flex flex-col items-center gap-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative
                ${isSpotlight ? 'w-80 md:w-[28rem] p-6 ring-4 ring-blue-100 shadow-2xl' : 'w-full p-2 hover:scale-105 transition-transform origin-center'}
            `}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            initial={isSpotlight ? { opacity: 0, scale: 0.5 } : false}
            animate={{ opacity: 1, scale: 1 }}
        >
            <motion.span
                layoutId={`label-${layoutId}`}
                className={`font-bold text-gray-700 ${isSpotlight ? 'text-xl mb-4' : 'text-xs md:text-sm'}`}
            >
                {stage.label}
            </motion.span>

            <div className={`relative ${isSpotlight ? 'w-full aspect-square' : 'w-full aspect-square'}`}>
                <FloorPlan stage={stage.id} className="w-full h-full object-contain" />
            </div>

            <motion.span
                layoutId={`caption-${layoutId}`}
                className={`text-gray-400 font-mono uppercase tracking-widest ${isSpotlight ? 'text-xs mt-4' : 'text-[8px] md:text-[10px] mt-2'} ${isSpotlight && stage.id === 'footprint' ? 'animate-pulse' : ''}`}
            >
                {stage.caption || (isSpotlight ? (stage.id === 'footprint' ? 'Click to Start' : 'Analyzing...') : '')}
            </motion.span>
        </motion.div>
    );
};
