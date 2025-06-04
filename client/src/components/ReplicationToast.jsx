import { motion, AnimatePresence } from 'framer-motion';

export default function ReplicationToast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg border border-blue-300 rounded-xl px-4 py-2 text-sm text-gray-800"
          >
            <strong className="text-blue-600">📦 {toast.chunkName}</strong> re-replicated<br />
            <span className="text-gray-600 text-xs">from <b>{toast.from}</b> → <b>{toast.to}</b></span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
