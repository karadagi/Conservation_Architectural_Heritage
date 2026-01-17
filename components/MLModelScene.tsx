import React from 'react';
import { Cpu } from 'lucide-react';

export const MLModelScene = () => {
    return (
        <div className="flex flex-col h-full items-center justify-center px-4 md:px-12 py-4 gap-6">
            <div className="text-center max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4">
                    <Cpu size={14} />
                    MODEL ARCHITECTURE
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">U-Net Generator Details</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Visualizing the internal layers of the Generator network utilized in both stages of the framework.
                </p>
            </div>

            <div className="relative w-full max-w-5xl h-full max-h-[60vh] bg-white border shadow-sm rounded-xl overflow-hidden p-4 flex items-center justify-center">
                <img
                    src="images/figures/Figure 5.jpg"
                    alt="ML Model Architecture"
                    className="max-w-full max-h-full object-contain"
                />
            </div>
        </div>
    );
};
