import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  hasInput?: boolean;
  inputPlaceholder?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger',
  hasInput = false,
  inputPlaceholder = 'Enter reason...'
}) => {
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (isOpen) setInputValue('');
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-card rounded-[3.5rem] shadow-glow shadow-accent/5 overflow-hidden tactical-border"
          >
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
            
            <div className="p-12 md:p-16 relative z-10">
              <div className="flex items-start justify-between mb-12">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center tactical-border strat-shadow transition-all duration-700 hover:rotate-12",
                  type === 'danger' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                  type === 'warning' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                  "bg-accent/10 text-accent border-accent/20"
                )}>
                  <AlertTriangle size={32} />
                </div>
                <button 
                  onClick={onClose}
                  className="p-4 bg-[var(--input-bg)] hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-4xl font-black tracking-tighter text-ink uppercase leading-none">{title}</h3>
                <p className="text-xl serif-italic text-ink/30 lowercase font-medium max-w-lg leading-relaxed">
                  {message}
                </p>
              </div>

              {hasInput && (
                <div className="space-y-5 mb-12">
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2 italic serif-italic">Logic Justification</label>
                  <textarea
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={inputPlaceholder}
                    rows={4}
                    className="w-full premium-input px-8 py-6 h-40 resize-none font-bold placeholder:font-normal placeholder:lowercase placeholder:serif-italic"
                  />
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6">
                <button
                  onClick={onClose}
                  className="flex-1 h-18 premium-button-ghost text-[10px]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm(inputValue);
                    onClose();
                  }}
                  disabled={hasInput && !inputValue.trim()}
                  className={cn(
                    "flex-[1.5] h-18 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 strat-shadow active:scale-[0.98] disabled:opacity-20 disabled:grayscale disabled:scale-100 disabled:shadow-none",
                    type === 'danger' ? "bg-red-600 text-white hover:bg-red-700 shadow-red-500/20" :
                    type === 'warning' ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/20" :
                    "bg-accent text-slate-950 hover:bg-accent/90 shadow-accent/20"
                  )}
                >
                  {confirmText}
                </button>
              </div>
            </div>
            
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
