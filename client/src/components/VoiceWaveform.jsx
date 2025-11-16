import { motion } from 'framer-motion';

const VoiceWaveform = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-20">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-primary rounded-full"
          animate={{
            height: ["20%", "80%", "20%"],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;