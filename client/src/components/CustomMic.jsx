import React from 'react';

const CustomMic = ({ className = "w-6 h-6" }) => {
    // Check if className implies white color to apply invert filter
    const isWhite = className.includes('text-white');
    // Check if className implies primary color (blue) to apply specific filter (approximate)
    // For now, we'll default to black (original) or white (inverted).
    // If text-primary is used, we might need a specific filter or just leave it black/dark.

    // Simple logic: if text-white, invert. Else, render original (black).
    // Users can pass 'brightness-0 invert' manually in className if needed.

    return (
        <img
            src="/mic-icon.png"
            alt="Mic"
            className={`${className} ${isWhite ? 'brightness-0 invert' : ''}`}
        />
    );
};

export default CustomMic;
