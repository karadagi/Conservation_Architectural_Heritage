import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export const ArchitectureScene = () => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    return (
        <div className="flex flex-col h-full items-center justify-center px-4 md:px-12 py-4 gap-6">
            <div className="text-center max-w-2xl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Two-Step cGAN Architecture</h2>
                <p className="text-sm text-gray-500 mt-2">
                    The framework utilizes two sequential Pix2Pix networks: the first generates structural topology from incomplete footprints, and the second hallucinates architectural details.
                </p>
            </div>

            <div className="relative w-full max-w-5xl aspect-video bg-white border shadow-sm rounded-xl overflow-hidden p-4 flex items-center justify-center">
                {/* Placeholder for the diagram - assuming Figure 1.jpg is the pipeline */}
                <img
                    src="images/figures/Figure 1.jpg"
                    alt="Architecture Pipeline"
                    className="max-w-full max-h-full object-contain"
                />

                {/* Interactive Hotspots (Overlay) - Example positions */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Network 1 Hotspot */}
                    <div className="absolute top-1/3 left-1/4 pointer-events-auto group">
                        <motion.button
                            className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition origin-center"
                            onClick={() => setActiveTooltip(activeTooltip === 'net1' ? null : 'net1')}
                            initial={{ scale: 1 }}
                            animate={{
                                scale: [1, 1.5, 1],
                                boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 30px rgba(59, 130, 246, 0.6)", "0px 0px 0px rgba(59, 130, 246, 0)"]
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeInOut",
                                repeat: 0
                            }}
                        >
                            <Info size={14} />
                        </motion.button>
                        {activeTooltip === 'net1' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-8 left-0 w-64 bg-slate-900 text-white text-xs p-3 rounded shadow-xl z-10"
                            >
                                <strong>Generator 1 (Structure):</strong> Trained to predict walls, domes, and arches from partial footprint data only.
                            </motion.div>
                        )}
                    </div>

                    {/* Network 2 Hotspot */}
                    <div className="absolute top-1/3 right-1/4 pointer-events-auto group">
                        <motion.button
                            className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition origin-center"
                            onClick={() => setActiveTooltip(activeTooltip === 'net2' ? null : 'net2')}
                            initial={{ scale: 1 }}
                            animate={{
                                scale: [1, 1.5, 1],
                                boxShadow: ["0px 0px 0px rgba(168, 85, 247, 0)", "0px 0px 30px rgba(168, 85, 247, 0.6)", "0px 0px 0px rgba(168, 85, 247, 0)"]
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeInOut",
                                repeat: 0
                            }}
                        >
                            <Info size={14} />
                        </motion.button>
                        {activeTooltip === 'net2' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-8 right-0 w-64 bg-slate-900 text-white text-xs p-3 rounded shadow-xl z-10"
                            >
                                <strong>Generator 2 (Texture):</strong> Takes the structural map and applies material properties and fine details based on style transfer.
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
