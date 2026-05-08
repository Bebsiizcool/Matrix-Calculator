'use client';

import React, { useState, useEffect } from 'react';
import styles from './Calculator.module.css';
import MatrixGrid from './MatrixGrid';
import StepByStep from './StepByStep';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  X, 
  Hash, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { 
  Matrix, 
  MathStep, 
  addMatrices, 
  subtractMatrices, 
  multiplyMatrices, 
  getDeterminant, 
  getInverse 
} from '../lib/matrix-math';

const Calculator: React.FC = () => {
  const [order, setOrder] = useState<2 | 3>(3);
  const [matrixA, setMatrixA] = useState<Matrix>([]);
  const [matrixB, setMatrixB] = useState<Matrix>([]);
  const [resultMatrix, setResultMatrix] = useState<Matrix | null>(null);
  const [resultScalar, setResultScalar] = useState<number | null>(null);
  const [steps, setSteps] = useState<MathStep[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const empty = Array(order).fill(0).map(() => Array(order).fill(0));
    setMatrixA(empty);
    setMatrixB(empty);
    resetResults();
  }, [order]);

  const resetResults = () => {
    setResultMatrix(null);
    setResultScalar(null);
    setSteps([]);
    setShowSteps(false);
    setError(null);
  };

  const handleMatrixChange = (matrix: 'A' | 'B', r: number, c: number, v: number) => {
    if (matrix === 'A') {
      const newM = [...matrixA.map(row => [...row])];
      newM[r][c] = v;
      setMatrixA(newM);
    } else {
      const newM = [...matrixB.map(row => [...row])];
      newM[r][c] = v;
      setMatrixB(newM);
    }
  };

  const executeOperation = (op: string) => {
    setError(null);
    setResultMatrix(null);
    setResultScalar(null);
    setSteps([]);
    setShowSteps(true); // Automatically show steps to help students

    try {
      let res;
      switch (op) {
        case 'add':
          res = addMatrices(matrixA, matrixB);
          setResultMatrix(res.result as Matrix);
          setSteps(res.steps);
          break;
        case 'sub':
          res = subtractMatrices(matrixA, matrixB);
          setResultMatrix(res.result as Matrix);
          setSteps(res.steps);
          break;
        case 'mul':
          res = multiplyMatrices(matrixA, matrixB);
          setResultMatrix(res.result as Matrix);
          setSteps(res.steps);
          break;
        case 'det':
          res = getDeterminant(matrixA);
          setResultScalar(res.result as number);
          setSteps(res.steps);
          break;
        case 'inv':
          res = getInverse(matrixA);
          setResultMatrix(res.result as Matrix);
          setSteps(res.steps);
          break;
      }
    } catch (err: any) {
      setError(err.message);
      setShowSteps(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.dimensionPicker}>
          <span>Matrix Order:</span>
          <div className={styles.toggleGroup}>
            {[2, 3].map((n) => (
              <button
                key={n}
                className={order === n ? styles.activeToggle : ''}
                onClick={() => setOrder(n as 2 | 3)}
              >
                {n}x{n}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.resetButton} onClick={() => {
          const empty = Array(order).fill(0).map(() => Array(order).fill(0));
          setMatrixA(empty);
          setMatrixB(empty);
          resetResults();
        }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className={styles.workspace}>
        <div className={styles.matrixSection}>
          <MatrixGrid 
            matrix={matrixA} 
            onChange={(r, c, v) => handleMatrixChange('A', r, c, v)} 
            label="Matrix A"
          />
        </div>

        <div className={styles.matrixSection}>
          <MatrixGrid 
            matrix={matrixB} 
            onChange={(r, c, v) => handleMatrixChange('B', r, c, v)} 
            label="Matrix B"
          />
        </div>
      </div>

      <div className={styles.operations}>
        <div className={styles.buttonGrid}>
          <button onClick={() => executeOperation('add')} title="Add A + B">
            <Plus /> <span>Add</span>
          </button>
          <button onClick={() => executeOperation('sub')} title="Subtract A - B">
            <Minus /> <span>Sub</span>
          </button>
          <button onClick={() => executeOperation('mul')} title="Multiply A × B">
            <X /> <span>Mul</span>
          </button>
          <button onClick={() => executeOperation('det')} title="Determinant of A">
            <Hash /> <span>Det</span>
          </button>
          <button onClick={() => executeOperation('inv')} title="Inverse of A">
            <RotateCcw /> <span>Inv</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.error}
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(resultMatrix || resultScalar !== null) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.resultCard}
          >
            <div className={styles.resultHeader}>
              <h2>Final Result</h2>
            </div>
            
            <div className={styles.resultContent}>
              {resultMatrix && <MatrixGrid matrix={resultMatrix} readOnly />}
              {resultScalar !== null && (
                <div className={styles.scalarBox}>
                  <span className={styles.scalarLabel}>Determinant |A| = </span>
                  <span className={styles.scalarValue}>{resultScalar}</span>
                </div>
              )}
            </div>

            <button 
              className={styles.stepToggle}
              onClick={() => setShowSteps(!showSteps)}
            >
              {showSteps ? <><ChevronUp size={18} /> Hide Steps</> : <><ChevronDown size={18} /> View Step-by-Step Breakdown</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSteps && <StepByStep steps={steps} />}
      </AnimatePresence>
    </div>
  );
};

export default Calculator;
