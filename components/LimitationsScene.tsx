import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const LimitationsScene = () => {
    const [zoom, setZoom] = React.useState(1);

    return (
        <div className="flex flex-col h-full items-center justify-center px-4 md:px-12 py-4 gap-8">
            <div className="text-center max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-4">
                    <AlertTriangle size={14} />
                    LIMITATIONS ANALYSIS
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">When the Model Fails</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Understanding failure cases is crucial. The model struggles with highly irregular ruins or styles not present in the training set (e.g., late-period eccentric arches).
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center w-full max-w-5xl">
                {/* Failure Image with Lens Zoom */}
                <div
                    className="w-full md:w-1/2 aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-orange-100 shadow-sm relative group cursor-crosshair"
                    style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
                    onMouseEnter={() => setZoom(2.5)}
                    onMouseLeave={() => setZoom(1)}
                    onWheel={(e) => {
                        e.preventDefault();
                        const newZoom = Math.min(Math.max(1, zoom + e.deltaY * -0.005), 5); // smoother delta
                        setZoom(newZoom);
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
                        src="images/figures/Figure 8.jpg"
                        alt="Failure Case"
                        className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-100 ease-out origin-[var(--x)_var(--y)]"
                        style={{ transform: `scale(${zoom})` }}
                    />
                    <div className="absolute top-4 left-4 pointer-events-none">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">INACCURATE PREDICTION</span>
                    </div>
                    <div className="absolute bottom-4 right-4 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
                        <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">Scroll to Zoom</span>
                    </div>
                </div>

                {/* Analysis Text */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                        <h4 className="font-bold text-orange-800 text-sm mb-1">Issue: Structural Hallucination</h4>
                        <p className="text-xs text-orange-700 leading-relaxed">
                            The model attempts to complete the dome structure despite insufficient wall support in the footprint, leading to a physically impossible prediction.
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Mitigation Strategy</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Increasing the diversity of " ruined" states in the training data (Dataset Augmentation Phase) helps reduce these hallucinations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
