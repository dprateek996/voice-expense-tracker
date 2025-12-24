import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { Moon, Sun, Star } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();
    const isDark = theme === 'dark';

    const rotation = useMotionValue(isDark ? 0 : 180);
    const smoothRotation = useSpring(rotation, { damping: 20, stiffness: 300 });

    const bg = useTransform(smoothRotation, [0, 180], ["#171717", "#ffffff"]);
    const border = useTransform(smoothRotation, [0, 180], ["rgba(255,255,255,0.1)", "rgba(0,0,0,0.1)"]);

    const moonY = useTransform(smoothRotation, [0, 90, 180], [0, 30, 40]);
    const sunY = useTransform(smoothRotation, [0, 90, 180], [40, 30, 0]);

    const moonOpacity = useTransform(smoothRotation, [0, 50], [1, 0]);
    const sunOpacity = useTransform(smoothRotation, [130, 180], [0, 1]);

    const counterRotate = useTransform(smoothRotation, v => -v);

    useEffect(() => {
        rotation.set(isDark ? 0 : 180);
    }, [isDark, rotation]);

    const handlePan = (event, info) => {
        const current = rotation.get();
        const delta = info.delta.x + info.delta.y;
        const sensitivity = 1;
        const newRot = Math.max(0, Math.min(180, current + delta * sensitivity));
        rotation.set(newRot);

        if (newRot > 90 && isDark) {
            setTheme('light');
        } else if (newRot <= 90 && !isDark) {
            setTheme('dark');
        }
    };

    const handlePanEnd = () => {
        const current = rotation.get();
        const target = current > 90 ? 180 : 0;
        animate(rotation, target, { type: "spring", stiffness: 200, damping: 15 });

        if (target === 180 && isDark) {
            setTheme('light');
        } else if (target === 0 && !isDark) {
            setTheme('dark');
        }
    };

    const handleClick = () => {
        const target = isDark ? 180 : 0;

        animate(rotation, target, { type: "spring", stiffness: 200, damping: 15 });
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <div className="relative group">
            <motion.div
                className="absolute inset-0 rounded-full blur-lg opacity-50"
                style={{
                    background: useTransform(smoothRotation, [0, 180], ["rgba(99, 102, 241, 0.4)", "rgba(245, 158, 11, 0.4)"])
                }}
            />
            <motion.div
                className="w-10 h-10 rounded-full cursor-grab active:cursor-grabbing shadow-[0_4px_16px_rgba(0,0,0,0.12)] border flex items-center justify-center relative overflow-hidden z-10"
                style={{
                    rotate: smoothRotation,
                    backgroundColor: bg,
                    borderColor: border,
                }}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                onClick={handleClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ opacity: moonOpacity, rotate: counterRotate }}
                >
                    <motion.div style={{ y: moonY }} className="relative">
                        <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400/10 stroke-[1.5px]" />
                        <motion.div
                            className="absolute -top-0.5 -right-1 text-indigo-200"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Star size={6} fill="currentColor" className="border-none" />
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ opacity: sunOpacity, rotate: counterRotate }}
                >
                    <motion.div style={{ y: sunY }}>
                        <Sun className="w-5 h-5 text-amber-500 fill-amber-500/10 stroke-[2px]" />
                    </motion.div>
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

            </motion.div>
        </div>
    );
};
export default ThemeToggle;
