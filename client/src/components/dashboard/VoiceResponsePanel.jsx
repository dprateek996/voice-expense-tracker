import { motion } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  success: <CheckCircle className="w-6 h-6 text-green-400" />,
  info: <Info className="w-6 h-6 text-blue-400" />,
  warning: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
  error: <XCircle className="w-6 h-6 text-red-400" />,
};

export default function VoiceResponsePanel({ response, type = 'info', onClose }) {
  if (!response) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'glassmorphic-panel px-6 py-4 rounded-2xl shadow-lg max-w-xl mx-auto mt-6 flex items-start gap-4',
        'border border-primary-400/20 backdrop-blur-lg',
        type === 'success' && 'border-green-400/30',
        type === 'warning' && 'border-yellow-400/30',
        type === 'error' && 'border-red-400/30',
      )}
    >
      <div>{ICONS[type]}</div>
      <div className="flex-1">
        <div className="font-semibold text-lg mb-1 text-primary-900">
          {type === 'success' && 'Success'}
          {type === 'info' && 'Info'}
          {type === 'warning' && 'Warning'}
          {type === 'error' && 'Error'}
        </div>
        <div className="text-primary-800 text-base whitespace-pre-line">{response}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-primary-400 hover:text-primary-600 transition"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}
