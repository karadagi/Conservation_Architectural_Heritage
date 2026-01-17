import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

// Using the provided figures as gallery items
// Assuming Figure 3-8 are good candidates
const GALLERY_ITEMS = [
    { id: 1, src: 'images/figures/Figure 2.jpg', label: 'Sample A: Multi-dome Structure' },
    { id: 2, src: 'images/figures/Figure 3.jpg', label: 'Sample B: Single Vault' },
    { id: 3, src: 'images/figures/Figure 4.jpg', label: 'Sample C: Complex Ruin' },
    { id: 4, src: 'images/figures/Figure 5.jpg', label: 'Sample D: Corner Detail' },
    { id: 5, src: 'images/figures/Figure 6.jpg', label: 'Sample E: Archway' },
    { id: 6, src: 'images/figures/Figure 7.jpg', label: 'Sample F: Wall Evaluation' },
];

export const GalleryScene = () => {
    const [selectedImage, setSelectedImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

    return (
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 md:px-8 py-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Restitution Results Gallery</h2>
                <p className="text-sm text-gray-500">Diverse examples of the model's performance across different architectural typologies.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pb-4">
                {GALLERY_ITEMS.map((item) => (
                    <motion.div
                        key={item.id}
                        layoutId={`card-${item.id}`}
                        className="group relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedImage(item)}
                    >
                        <img
                            src={item.src}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ZoomIn className="text-white drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-xs text-white font-medium shadow-black drop-shadow-sm">{item.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedImage(null)}
                        />
                        <motion.div
                            layoutId={`card-${selectedImage.id}`}
                            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto bg-neutral-100 flex items-center justify-center p-4">
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.label}
                                    className="max-w-full max-h-full object-contain shadow-lg"
                                />
                            </div>
                            <div className="p-4 bg-white border-t">
                                <h3 className="font-bold text-gray-900">{selectedImage.label}</h3>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
