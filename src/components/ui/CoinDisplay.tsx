import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface CoinDisplayProps {
  coins: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({ 
  coins, 
  showAnimation = false, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.div
      className={`coin-display inline-flex items-center gap-2 ${sizeClasses[size]}`}
      animate={showAnimation ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Coins size={iconSizes[size]} />
      <motion.span
        key={coins}
        initial={showAnimation ? { scale: 1.5, opacity: 0 } : {}}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {coins.toLocaleString()}
      </motion.span>
    </motion.div>
  );
};

export default CoinDisplay;