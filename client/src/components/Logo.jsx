import React from 'react';

const Logo = ({ size = "md", showText = true, textClassName = "text-xl font-bold" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-bold",
    lg: "text-2xl font-bold"
  };

  return (
    <div className={`flex items-center space-x-2 ${sizeClasses[size] || sizeClasses.md}`}>
      {/* Logo Icon */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Microphone base */}
        <rect
          x="40"
          y="70"
          width="20"
          height="25"
          rx="10"
          fill="currentColor"
          className="text-slate-800 dark:text-slate-300"
        />

        {/* Microphone stem */}
        <rect
          x="47"
          y="50"
          width="6"
          height="25"
          rx="3"
          fill="currentColor"
          className="text-slate-700 dark:text-slate-400"
        />

        {/* Microphone head */}
        <circle
          cx="50"
          cy="40"
          r="12"
          fill="currentColor"
          className="text-slate-900 dark:text-slate-100"
        />

        {/* Sound waves */}
        <path
          d="M25 40 Q30 35 35 40 Q30 45 25 40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
        />
        <path
          d="M18 40 Q23 33 28 40 Q23 47 18 40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
        />
        <path
          d="M11 40 Q16 31 21 40 Q16 49 11 40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
        />

        {/* Rupee symbol */}
        <text
          x="50"
          y="42"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          className="text-green-600 dark:text-green-400 font-bold"
        >
          ₹
        </text>

        {/* Small accent dot */}
        <circle
          cx="75"
          cy="25"
          r="3"
          fill="currentColor"
          className="text-primary"
        />
      </svg>

      {/* Logo Text */}
      {showText && (
        <span className={`${textSizeClasses[size] || textSizeClasses.md} text-slate-900 dark:text-slate-100`}>
          VoiceExpense
        </span>
      )}
    </div>
  );
};

export default Logo;
