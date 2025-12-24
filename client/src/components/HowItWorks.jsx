import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Check, BarChart3 } from 'lucide-react';

const HowItWorks = () => {

    const steps = [
        {
            id: 1,
            title: "Record",
            description: "Simply tap and speak.",
            icon: Mic,
            x: 50,  // SVG coordinate X
            y: 200, // SVG coordinate Y
            align: "left"
        },
        {
            id: 2,
            title: "Process",
            description: "AI extracts the details.",
            icon: Sparkles,
            x: 350,
            y: 50,
            align: "top"
        },
        {
            id: 3,
            title: "Confirm",
            description: "Verify and edit.",
            icon: Check,
            x: 650,
            y: 350,
            align: "bottom"
        },
        {
            id: 4,
            title: "Track",
            description: "View your insights.",
            icon: BarChart3,
            x: 950,
            y: 200,
            align: "right"
        }
    ];

    return (
        <section className="py-24 bg-neutral-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
                        How it works
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        From voice to expense log in seconds.
                    </p>
                </div>
                <div className="relative w-full aspect-[2.5/1] md:aspect-[3/1] lg:aspect-[3/1] max-w-5xl mx-auto">
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
                            <defs>
                                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 50,200 C 150,200 200,50 350,50 C 500,50 500,350 650,350 C 800,350 850,200 950,200"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="4"
                                strokeDasharray="8 8"
                                strokeLinecap="round"
                            />
                            <motion.path
                                d="M 50,200 C 150,200 200,50 350,50 C 500,50 500,350 650,350 C 800,350 850,200 950,200"
                                fill="none"
                                stroke="url(#beamGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1],
                                    opacity: [0, 1, 1, 0] // Fade in, stay, then fade out at end
                                }}
                                transition={{
                                    duration: 3,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatDelay: 0.5
                                }}
                            />
                        </svg>
                    </div>
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                            style={{
                                left: `${step.x / 10}%`,
                                top: `${step.y / 4}%`,
                                width: '200px' // Fixed width for text centering
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.6, duration: 0.5, type: "spring" }}
                                className="relative z-10 mb-4 group"
                            >
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300">
                                    <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-primary transition-colors" />
                                </div>
                                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center border-2 border-black z-20">
                                    {step.id}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.6 + 0.3 }}
                                className={`text-center ${step.align === 'top' ? '-order-1 mb-4' : ''}`}
                            >
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-neutral-400 leading-snug">
                                    {step.description}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
