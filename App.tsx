import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Info, ChevronRight, Layers, Box, FileImage, LayoutTemplate, Activity, Scan, RotateCw, FlipHorizontal, Wand2, Workflow, Grid, AlertOctagon, BookOpen } from 'lucide-react';
import { COLORS, STAGES } from './constants';
import { FloorPlan } from './components/FloorPlan';
import { Pix2PixDiagram } from './components/Pix2PixDiagram';
import { CompareSlider } from './components/CompareSlider';
import { ArchitectureScene } from './components/ArchitectureScene';
import { FramingScene } from './components/FramingScene';
import { LimitationsScene } from './components/LimitationsScene';
import { MLModelScene } from './components/MLModelScene';
import { PaperScene } from './components/PaperScene';
import { SceneType } from './types';

// Step definitions for the stepper navigation
const STEPS = [
  { id: 0, label: 'Architecture', icon: Workflow, type: 'ARCHITECTURE' as any },
  { id: 1, label: 'Context', icon: LayoutTemplate, type: SceneType.Framing },
  { id: 2, label: 'Dataset', icon: FileImage, type: SceneType.Dataset },
  { id: 3, label: 'ML Model', icon: Box, type: 'ML_MODEL' as any },
  { id: 4, label: 'Structure', icon: Box, type: SceneType.Step1 },
  { id: 5, label: 'Texture', icon: Layers, type: SceneType.Step2 },
  { id: 6, label: 'Evaluation', icon: Activity, type: SceneType.Evaluation },
  { id: 7, label: 'Limitations', icon: AlertOctagon, type: 'LIMITATIONS' as any },
  { id: 8, label: 'Paper', icon: BookOpen, type: 'PAPER' as any },
];

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Interactive States
  const [datasetRotation, setDatasetRotation] = useState(0);
  const [datasetMirror, setDatasetMirror] = useState(false);
  const [datasetZoom, setDatasetZoom] = useState(1);
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
    setDatasetZoom(1);
    setShowHeatmap(false);
    setEpochScrubber(300);
  };

  const renderScene = () => {
    const currentType = STEPS[activeStep].type;

    if (currentType === 'ARCHITECTURE') return <ArchitectureScene />;
    if (currentType === 'ML_MODEL') return <MLModelScene />;
    if (currentType === 'LIMITATIONS') return <LimitationsScene />;
    if (currentType === 'PAPER') return <PaperScene />;

    switch (currentType) {
      case SceneType.Framing:
        return <FramingScene />;

      case SceneType.Dataset:
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 md:px-12 gap-8 overflow-y-auto w-full max-w-7xl mx-auto">

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center w-full">

              {/* Left Column: Interactive Augmentation */}
              <div className="flex flex-col items-center gap-12 border-b lg:border-none pb-8 lg:pb-0 justify-center h-full">
                <div className="relative mb-6">
                  <motion.div
                    animate={{
                      rotate: datasetRotation,
                      scaleX: datasetMirror ? -1 : 1
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <FloorPlan stage="footprint" className="w-64 md:w-80 border-2 border-gray-100 shadow-xl bg-white" />
                  </motion.div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                      onClick={() => setDatasetRotation(r => r + 90)}
                      className="p-3 bg-white border shadow-sm rounded-full hover:bg-gray-50 text-gray-600 transition-transform active:scale-95"
                      title="Rotate 90°"
                    >
                      <RotateCw size={20} />
                    </button>
                    <button
                      onClick={() => setDatasetMirror(m => !m)}
                      className={`p-3 border shadow-sm rounded-full hover:bg-gray-50 transition-transform active:scale-95 ${datasetMirror ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600'}`}
                      title="Mirror"
                    >
                      <FlipHorizontal size={20} />
                    </button>
                  </div>
                </div>

                <div className="max-w-xs space-y-4 text-center">
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

              {/* Right Column: Figure 4 (Zoomable) */}
              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <div
                  className="w-full h-full max-h-[550px] bg-gray-50 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm relative group cursor-crosshair bg-white"
                  style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
                  onMouseEnter={() => setDatasetZoom(2.5)}
                  onMouseLeave={() => setDatasetZoom(1)}
                  onWheel={(e) => {
                    e.preventDefault();
                    const newZoom = Math.min(Math.max(1, datasetZoom + e.deltaY * -0.005), 5); // smoother delta
                    setDatasetZoom(newZoom);
                  }}
                  onMouseMove={(e) => {
                    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;
                    e.currentTarget.style.setProperty('--x', `${x}%`);
                    e.currentTarget.style.setProperty('--y', `${y}%`);
                  }}
                >
                  <img
                    src="images/figures/Figure 4.jpg"
                    alt="Dataset Analysis"
                    className="w-full h-full object-contain p-4 transition-transform duration-100 ease-out origin-[var(--x)_var(--y)]"
                    style={{ transform: `scale(${datasetZoom})` }}
                  />
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">DATASET ANALYSIS</span>
                  </div>
                  <div className="absolute bottom-4 right-4 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
                    <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">Scroll to Zoom</span>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-400 mt-3">Figure 4: Analysis of architectural typologies within the training set</p>
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
          <div className="flex flex-col h-full items-center justify-center px-4 md:px-12 py-4 overflow-y-auto">
            <div className="flex flex-col xl:flex-row gap-8 items-center w-full max-w-7xl">
              {/* Left Column: Heatmap & Metrics */}
              <div className="flex flex-col gap-6 items-center xl:items-start shrink-0">
                <div className="relative w-64 md:w-80 aspect-square bg-white border shadow-lg rounded-lg overflow-hidden group">
                  <FloorPlan stage="furnishing" className="w-full h-full" />

                  {/* Toggle Button Overlay */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-transform active:scale-95 ${showHeatmap ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      <Scan size={14} />
                      {showHeatmap ? 'HIDE COMPARISON' : 'SHOW COMPARISON'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">SSIM Index</span>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-2xl font-mono font-bold text-gray-900">0.81</span>
                      <span className="text-[10px] text-green-500 font-bold mb-1">High Accuracy</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '81%' }}
                        transition={{ delay: 0.5, duration: 2 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">L1 Loss</span>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-2xl font-mono font-bold text-gray-900">0.06</span>
                      <span className="text-[10px] text-purple-500 font-bold mb-1">Converged</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '12%' }}
                        transition={{ delay: 0.7, duration: 2 }}
                        className="h-full bg-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden xl:block w-px h-96 bg-gray-200" />

              {/* Right Column: Figure Analysis */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-700">
                    {showHeatmap ? 'Detailed Comparison' : 'Comparative Analysis'}
                  </h3>
                </div>
                <div className="relative w-full aspect-[2/1] bg-white border shadow-sm rounded-xl overflow-hidden p-2">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={showHeatmap ? 'fig9' : 'fig6'}
                      src={showHeatmap ? "images/figures/Figure 9.png" : "images/figures/Figure 6.jpg"}
                      alt="Evaluation"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed max-w-prose">
                  {showHeatmap ? (
                    <span><strong>Figure 9:</strong> Side-by-side comparison showing the model's ability to recover fine-grained textures (right) from the generated structural layout (left).</span>
                  ) : (
                    <span><strong>Figure 6:</strong> Ground truth vs. Generated results across different structural typologies. The model demonstrates high fidelity in reconstructing dome curvatures.</span>
                  )}
                </p>
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
      <header className="flex-none bg-white border-b z-10 px-6 py-3 flex items-center justify-center shadow-sm relative">
        <div className="absolute left-6 flex items-center gap-3">
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
