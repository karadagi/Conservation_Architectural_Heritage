import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface CompareSliderProps {
    before: React.ReactNode;
    after: React.ReactNode;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
    before,
    after,
    beforeLabel = "Before",
    afterLabel = "After",
    className = ""
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => {
        isDragging.current = true;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden select-none cursor-col-resize group ${className}`}
            onMouseDown={handleMouseDown}
        >
            {/* Background (After - Full View) */}
            <div className="absolute inset-0 w-full h-full">
                {after}
                {afterLabel && (
                    <span className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
                        {afterLabel}
                    </span>
                )}
            </div>

            {/* Foreground (Before - Clipped) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-50"
                style={{ width: `${sliderPosition}%` }}
            >
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{ width: containerRef.current ? containerRef.current.clientWidth : '100vw' }}
                >
                    {before}
                </div>
                {beforeLabel && (
                    <span className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
                        {beforeLabel}
                    </span>
                )}
            </div>

            {/* Slider Handle */}
            <div
                className="absolute inset-y-0 w-1 bg-white cursor-col-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-8 h-8 -ml-[14px] bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:scale-110 transition-transform">
                    <GripVertical size={16} />
                </div>
            </div>
        </div>
    );
};
