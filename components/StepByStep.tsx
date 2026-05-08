'use client';

import React from 'react';
import styles from './StepByStep.module.css';
import { MathStep } from '../lib/matrix-math';
import MatrixGrid from './MatrixGrid';
import { motion } from 'framer-motion';
import { Info, Calculator as CalcIcon } from 'lucide-react';

interface StepByStepProps {
  steps: MathStep[];
}

const StepByStep: React.FC<StepByStepProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <CalcIcon className={styles.icon} />
        <h2 className={styles.title}>Solution Journey</h2>
      </div>
      
      <div className={styles.stepsList}>
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={styles.stepCard}
          >
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step {index + 1}</div>
              <h3 className={styles.stepLabel}>{step.label}</h3>
            </div>
            
            <div className={styles.stepBody}>
              {step.description && (
                <div className={styles.descriptionBox}>
                  <Info size={16} className={styles.infoIcon} />
                  <p className={styles.descriptionText}>{step.description}</p>
                </div>
              )}
              
              <div className={styles.expressionWrapper}>
                <code className={styles.expression}>{step.expression}</code>
              </div>

              {step.matrix && (
                <div className={styles.matrixWrapper}>
                  <MatrixGrid matrix={step.matrix} readOnly label="Intermediate State" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StepByStep;
