import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Info, ChevronRight, Layers, Box, FileImage, LayoutTemplate, Activity, Scan, RotateCw, FlipHorizontal, Wand2 } from 'lucide-react';
import { COLORS, STAGES } from './constants';
import { FloorPlan } from './components/FloorPlan';
import { Pix2PixDiagram } from './components/Pix2PixDiagram';
import { CompareSlider } from './components/CompareSlider';
import { SceneType } from './types';

// Step definitions for the stepper navigation
const STEPS = [
  { id: 0, label: 'Context', icon: LayoutTemplate, type: SceneType.Framing },
  { id: 1, label: 'Dataset', icon: FileImage, type: SceneType.Dataset },
  { id: 2, label: 'Structure', icon: Box, type: SceneType.Step1 },
  { id: 3, label: 'Texture', icon: Layers, type: SceneType.Step2 },
  { id: 4, label: 'Evaluation', icon: Activity, type: SceneType.Evaluation }
];

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Interactive States
  const [datasetRotation, setDatasetRotation] = useState(0);
  const [datasetMirror, setDatasetMirror] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [epochScrubber, setEpochScrubber] = useState(300);

  // Auto-play logic
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per step
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => {
    setActiveStep(0);
    setIsPlaying(false);
    setDatasetRotation(0);
    setDatasetMirror(false);
    setShowHeatmap(false);
    setEpochScrubber(300);
  };

  const renderScene = () => {
    switch (STEPS[activeStep].type) {
      case SceneType.Framing:
        return (
          <div className="flex flex-row justify-center items-end gap-2 md:gap-8 h-full py-4 md:py-12">
            {STAGES.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center gap-2 md:gap-4 w-24 md:w-56"
              >
                <span className="text-[10px] md:text-sm font-semibold text-gray-600">{stage.label}</span>
                <FloorPlan stage={stage.id as any} className="w-full border shadow-sm rounded-sm bg-white" />
                <span className="text-[8px] md:text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">
                  {stage.caption}
                </span>
              </motion.div>
            ))}
          </div>
        );

      case SceneType.Dataset:
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 md:px-12 gap-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Interactive Preview */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: datasetRotation,
                    scaleX: datasetMirror ? -1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <FloorPlan stage="footprint" className="w-64 md:w-80 border-2 border-gray-100 shadow-xl bg-white" />
                </motion.div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                  <button
                    onClick={() => setDatasetRotation(r => r + 90)}
                    className="p-2 bg-white border shadow-sm rounded-full hover:bg-gray-50 text-gray-600"
                    title="Rotate 90°"
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    onClick={() => setDatasetMirror(m => !m)}
                    className={`p-2 border shadow-sm rounded-full hover:bg-gray-50 ${datasetMirror ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600'}`}
                    title="Mirror"
                  >
                    <FlipHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Explainer */}
              <div className="max-w-xs space-y-4">
                <h3 className="text-xl font-semibold">Data Augmentation</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  To train a robust RESTITUTION model, the limited historical dataset is multiplied. Try the controls to simulate the augmentation pipeline.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-mono bg-gray-50 p-3 rounded">
                  <span>ROTATION: {datasetRotation % 360}°</span>
                  <span>MIRROR: {datasetMirror ? 'ON' : 'OFF'}</span>
                  <span>SAMPLES: {(4 * (datasetMirror ? 2 : 1))}X</span>
                </div>
              </div>
            </div>
          </div>
        );

      case SceneType.Step1:
        return (
          <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 gap-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Box className="text-blue-500" />
                Structure Generation (Step 1)
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <span>Model: Pix2Pix</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>Epochs: 300</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                <CompareSlider
                  before={<FloorPlan stage="footprint" className="w-full h-full" />}
                  after={<FloorPlan stage="zoning" className="w-full h-full" />}
                  beforeLabel="Incomplete Ruin"
                  afterLabel="Generated Structure"
                />
              </div>
              <div className="w-full md:w-1/3">
                <Pix2PixDiagram
                  inputLabel="Ruins"
                  outputLabel="Structure"
                  progress={1}
                  epoch={300}
                />
              </div>
            </div>
          </div>
        );

      case SceneType.Step2:
        return (
          <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 gap-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="text-purple-500" />
                Texture & Detail (Step 2)
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <span>Input: Structural Map</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>Refinement</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                <CompareSlider
                  before={<FloorPlan stage="zoning" className="w-full h-full" />}
                  after={<FloorPlan stage="furnishing" className="w-full h-full" />}
                  beforeLabel="Structure"
                  afterLabel="Restored Detail"
                />
              </div>
              <div className="w-full md:w-1/3">
                <Pix2PixDiagram
                  inputLabel="Structure"
                  outputLabel="Detail"
                  progress={1}
                  epoch={300}
                />
              </div>
            </div>
          </div>
        );

      case SceneType.Evaluation:
        return (
          <div className="flex flex-col h-full items-center justify-center px-4 md:px-12">
            <div className="flex gap-8 items-start">
              {/* Main Visual */}
              <div className="flex flex-col gap-4">
                <div className="relative w-64 md:w-96 aspect-square bg-white border shadow-lg rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => setShowHeatmap(!showHeatmap)}>
                  <FloorPlan stage="furnishing" className="w-full h-full" />

                  {/* Heatmap Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showHeatmap ? 1 : 0 }}
                    className="absolute inset-0 bg-mix-blend-multiply pointer-events-none"
                  >
                    <div className="absolute inset-0 opacity-50 bg-gradient-to-tr from-red-500/20 to-transparent" />
                    {/* Simulated error spots */}
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500/40 blur-xl rounded-full" />
                    <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-red-500/30 blur-xl rounded-full" />
                  </motion.div>

                  {/* Toggle Button Overlay */}
                  <div className="absolute bottom-4 right-4">
                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-transform active:scale-95 ${showHeatmap ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}>
                      <Scan size={14} />
                      {showHeatmap ? 'HIDE ERRORS' : 'SHOW ERRORS'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex flex-col gap-6 pt-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-48">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">SSIM Index</span>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-mono font-bold text-gray-900">0.88</span>
                    <span className="text-xs text-green-500 font-bold mb-1">High Accuracy</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '88%' }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-48">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">L1 Loss</span>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-mono font-bold text-gray-900">0.04</span>
                    <span className="text-xs text-purple-500 font-bold mb-1">Converged</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '12%' }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Wand2 className="w-4 h-4 text-blue-600 mt-1" />
                    <p className="text-xs text-blue-800 leading-snug">
                      The model successfully reconstructs 88% of structural details compared to ground truth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] bg-neutral-50 flex flex-col overflow-hidden font-sans text-slate-900">
      {/* Header */}
      <header className="flex-none bg-white border-b z-10 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <h1 className="text-base font-bold leading-none">Heritage Restoration</h1>
            <span className="text-[10px] text-gray-500 font-medium">Pix2Pix Architecture</span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="hidden md:flex items-center bg-gray-100/80 p-1 rounded-lg">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md transition-all text-xs font-medium ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Icon size={14} className={isActive ? 'text-blue-500' : isCompleted ? 'text-gray-400' : 'text-gray-400'} />
                {step.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isPlaying ? 'bg-red-50 text-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {isPlaying ? 'Stop Auto-Play' : <><Play size={12} fill="currentColor" /> Start Demo</>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderScene()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls / Legend */}
      <footer className="flex-none bg-white border-t px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          {/* Color Legend */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Semantic Labels</span>
            <div className="h-4 w-px bg-gray-200" />
            {COLORS.map((item) => (
              <div key={item.label} className="flex items-center gap-2 whitespace-nowrap">
                <div className={`w-3 h-3 rounded-full border ${item.color}`} />
                <span className="text-[10px] font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <span className="text-xs font-mono font-medium w-12 text-center">
              {activeStep + 1} / {STEPS.length}
            </span>
            <button
              onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))}
              disabled={activeStep === STEPS.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
