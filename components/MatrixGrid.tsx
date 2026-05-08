import React from 'react';
import styles from './MatrixGrid.module.css';

interface MatrixGridProps {
  matrix: number[][];
  onChange?: (row: number, col: number, value: number) => void;
  readOnly?: boolean;
  label?: string;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({ matrix, onChange, readOnly = false, label }) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  return (
    <div className={styles.container}>
      {label && <h3 className={styles.label}>{label}</h3>}
      <div 
        className={styles.grid}
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`
        }}
      >
        {matrix.map((row, i) => 
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val === 0 && !readOnly ? '' : val}
              onChange={(e) => onChange?.(i, j, parseFloat(e.target.value) || 0)}
              readOnly={readOnly}
              className={`${styles.input} ${readOnly ? styles.readOnly : ''}`}
              placeholder="0"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixGrid;
