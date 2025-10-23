import React from 'react';
import { Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-4"
      >
        <Mountain className="w-16 h-16 text-primary-500" />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="h-1 bg-primary-500 rounded-full"
      />
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
};

export default LoadingScreen;