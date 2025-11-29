import React from 'react';

const CustomCalendar = ({ className = "w-6 h-6" }) => {
    const isWhite = className.includes('text-white');

    return (
        <img
            src="/calendar-icon.png"
            alt="Calendar"
            className={`${className} ${isWhite ? 'brightness-0 invert' : ''}`}
        />
    );
};

export default CustomCalendar;
