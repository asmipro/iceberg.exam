"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Loader2 } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: "danger" | "primary"
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ha, davom etish",
  cancelText = "Bekor qilish",
  loading = false,
  variant = "primary"
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9998]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl pointer-events-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  variant === "danger" ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                }`}>
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-black font-outfit text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">{message}</p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-6 py-4 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
                      variant === "danger" 
                        ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20" 
                        : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                    }`}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
