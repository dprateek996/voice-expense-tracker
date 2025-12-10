import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';

const ThemeDemo = () => {
    return (
        <div className="min-h-screen w-full transition-colors duration-500 ease-in-out bg-background text-foreground flex flex-col">
            {/* Navbar */}
            <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">V</span>
                    </div>
                    <span className="text-lg font-semibold tracking-tight">Voice Expense</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">Try the toggle →</span>
                    <ThemeToggle />
                </div>
            </nav>

            {/* Hero Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="inline-flex items-center justify-center p-1 rounded-full bg-secondary/50 border border-border backdrop-blur-sm mb-6">
                        <span className="px-3 py-1 text-xs font-medium text-secondary-foreground">New UI Component</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Beautiful Dark Mode <br /> for Modern Apps
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
                        Experience the seamless transition between light and dark themes with our new fluid toggle component.
                        Designed with detailed physics and smooth animations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                                <div className="h-32 rounded-xl bg-secondary/30 mb-4 animate-pulse group-hover:animate-none group-hover:bg-primary/5 transition-colors" />
                                <div className="h-4 w-2/3 rounded bg-secondary/50 mb-2" />
                                <div className="h-4 w-1/2 rounded bg-secondary/30" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ThemeDemo;
