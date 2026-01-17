import React from 'react';
import { FileText } from 'lucide-react';

export const PaperScene = () => {
    return (
        <div className="flex flex-col h-full items-center justify-center px-4 md:px-12 py-4 gap-4">
            <div className="text-center max-w-2xl shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
                    <FileText size={14} />
                    FULL RESEARCH PAPER
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Publication</h2>
            </div>

            <div className="w-full max-w-6xl h-full flex-1 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden relative">
                <iframe
                    src="paper.pdf"
                    className="w-full h-full"
                    title="Research Paper"
                />
            </div>

            <a
                href="paper.pdf"
                download
                className="shrink-0 text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
                <FileText size={12} />
                Download PDF
            </a>
        </div>
    );
};
