import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

export default function WorkInProgress() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center p-10 bg-gray-800 rounded-2xl shadow-lg border border-yellow-400 max-w-lg mx-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Construction className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-300 animate-pulse mb-4">
          Work in Progress
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          We’re working hard to build something amazing for you. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
}

