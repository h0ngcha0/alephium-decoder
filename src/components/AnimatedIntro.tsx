import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface AnimatedIntroProps {
  isVisible: boolean;
}

export const AnimatedIntro: React.FC<AnimatedIntroProps> = ({ isVisible }) => {
  const features = [
    "Decode Transaction Details",
    "Analyze Contract Bytecode",
    "Replay Transactions",
    "Understand VM Execution"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, features.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="flex flex-col items-center justify-center"
          style={{ marginTop: '60px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative h-24 flex items-center justify-center"
            key={currentIndex}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative px-8 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
                <motion.span 
                  className="text-5xl font-black tracking-tight"
                  style={{
                    background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {features[currentIndex]}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AnimatedIntro.propTypes = {
  isVisible: PropTypes.bool.isRequired
}; 