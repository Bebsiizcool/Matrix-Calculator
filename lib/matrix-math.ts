export type Matrix = number[][];

export interface MathStep {
  label: string;
  description?: string;
  expression: string;
  matrix?: Matrix;
}

export interface CalculationResult {
  result: Matrix | number;
  steps: MathStep[];
}

export const addMatrices = (a: Matrix, b: Matrix): CalculationResult => {
  const rows = a.length;
  const cols = a[0].length;
  const result: Matrix = Array(rows).fill(0).map(() => Array(cols).fill(0));
  const steps: MathStep[] = [];

  steps.push({
    label: "Formula",
    description: "To add two matrices, add the corresponding elements from each matrix.",
    expression: "C[i][j] = A[i][j] + B[i][j]"
  });

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = a[i][j] + b[i][j];
      steps.push({
        label: `Position (${i + 1}, ${j + 1})`,
        description: `Add elements at row ${i + 1}, column ${j + 1}.`,
        expression: `${a[i][j]} + ${b[i][j]} = ${result[i][j]}`
      });
    }
  }

  return { result, steps };
};

export const subtractMatrices = (a: Matrix, b: Matrix): CalculationResult => {
  const rows = a.length;
  const cols = a[0].length;
  const result: Matrix = Array(rows).fill(0).map(() => Array(cols).fill(0));
  const steps: MathStep[] = [];

  steps.push({
    label: "Formula",
    description: "To subtract two matrices, subtract the corresponding elements of the second matrix from the first.",
    expression: "C[i][j] = A[i][j] - B[i][j]"
  });

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = a[i][j] - b[i][j];
      steps.push({
        label: `Position (${i + 1}, ${j + 1})`,
        description: `Subtract element at row ${i + 1}, column ${j + 1}.`,
        expression: `${a[i][j]} - ${b[i][j]} = ${result[i][j]}`
      });
    }
  }

  return { result, steps };
};

export const multiplyMatrices = (a: Matrix, b: Matrix): CalculationResult => {
  const rowsA = a.length;
  const colsA = a[0].length;
  const rowsB = b.length;
  const colsB = b[0].length;

  const result: Matrix = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));
  const steps: MathStep[] = [];

  steps.push({
    label: "Concept",
    description: "Matrix multiplication is performed by taking the dot product of rows from the first matrix and columns from the second.",
    expression: "C[i][j] = Σ (A[i][k] * B[k][j])"
  });

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      let breakdown = "";
      for (let k = 0; k < colsA; k++) {
        const prod = a[i][k] * b[k][j];
        sum += prod;
        breakdown += `(${a[i][k]} × ${b[k][j]})` + (k < colsA - 1 ? " + " : "");
      }
      result[i][j] = sum;
      steps.push({
        label: `Element C${i + 1}${j + 1}`,
        description: `Multiply Row ${i + 1} of A by Column ${j + 1} of B.`,
        expression: `${breakdown} = ${sum}`
      });
    }
  }

  return { result, steps };
};

export const getDeterminant = (m: Matrix): CalculationResult => {
  const n = m.length;
  const steps: MathStep[] = [];

  if (n === 2) {
    const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
    steps.push({
      label: "2x2 Determinant Formula",
      description: "For a 2x2 matrix [[a, b], [c, d]], the determinant is (ad - bc).",
      expression: `|A| = (${m[0][0]} × ${m[1][1]}) - (${m[0][1]} × ${m[1][0]}) = ${det}`
    });
    return { result: det, steps };
  }

  if (n === 3) {
    const a = m[0][0], b = m[0][1], c = m[0][2];
    const m11 = m[1][1]*m[2][2] - m[1][2]*m[2][1];
    const m12 = m[1][0]*m[2][2] - m[1][2]*m[2][0];
    const m13 = m[1][0]*m[2][1] - m[1][1]*m[2][0];

    const det = a * m11 - b * m12 + c * m13;

    steps.push({
      label: "3x3 Determinant (Laplace Expansion)",
      description: "Expand along the first row using minors and cofactors.",
      expression: `|A| = a(ei - fh) - b(di - fg) + c(dh - eg)`
    });
    
    steps.push({
      label: "Step 1: Minor M11",
      description: `Minor for element ${a} (Row 1, Col 1).`,
      expression: `|${m[1][1]} ${m[1][2]} ; ${m[2][1]} ${m[2][2]}| = (${m[1][1]}×${m[2][2]}) - (${m[1][2]}×${m[2][1]}) = ${m11}`
    });

    steps.push({
      label: "Step 2: Minor M12",
      description: `Minor for element ${b} (Row 1, Col 2). Note the negative sign in the expansion.`,
      expression: `|${m[1][0]} ${m[1][2]} ; ${m[2][0]} ${m[2][2]}| = (${m[1][0]}×${m[2][2]}) - (${m[1][2]}×${m[2][0]}) = ${m12}`
    });

    steps.push({
      label: "Step 3: Minor M13",
      description: `Minor for element ${c} (Row 1, Col 3).`,
      expression: `|${m[1][0]} ${m[1][1]} ; ${m[2][0]} ${m[2][1]}| = (${m[1][0]}×${m[2][1]}) - (${m[1][1]}×${m[2][0]}) = ${m13}`
    });

    steps.push({
      label: "Step 4: Final Sum",
      description: "Multiply each element by its corresponding minor (with alternating signs).",
      expression: `${a}(${m11}) - ${b}(${m12}) + ${c}(${m13}) = ${det}`
    });

    return { result: det, steps };
  }

  throw new Error("Invalid matrix size");
};

export const getInverse = (m: Matrix): CalculationResult => {
  const { result: det, steps: detSteps } = getDeterminant(m);
  const steps: MathStep[] = [...detSteps];

  if (det === 0) {
    throw new Error("The determinant is 0, so the matrix is singular and has no inverse.");
  }

  const n = m.length;
  const adj: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));

  steps.push({
    label: "Inverse Strategy",
    description: "The inverse of A is (1/|A|) * adj(A), where adj(A) is the transpose of the cofactor matrix.",
    expression: "A⁻¹ = (1/det(A)) * adj(A)"
  });

  if (n === 2) {
    adj[0][0] = m[1][1];
    adj[1][1] = m[0][0];
    adj[0][1] = -m[0][1];
    adj[1][0] = -m[1][0];

    steps.push({
      label: "Adjoint Matrix (2x2)",
      description: "Swap the main diagonal elements and negate the off-diagonal elements.",
      matrix: adj,
      expression: "adj(A) = [[d, -b], [-c, a]]"
    });
  } else {
    // 3x3 Adjoint
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const minor = [];
        for (let r = 0; r < 3; r++) {
          if (r === i) continue;
          const row = [];
          for (let c = 0; c < 3; c++) {
            if (c === j) continue;
            row.push(m[r][c]);
          }
          minor.push(row);
        }
        const cofactor = Math.pow(-1, i + j) * (minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0]);
        adj[j][i] = cofactor; // Transpose
      }
    }
    steps.push({
      label: "Adjoint Matrix (3x3)",
      description: "Calculate the cofactor for every element and then transpose the resulting matrix.",
      matrix: adj,
      expression: "adj(A) = [Cofactor Matrix]ᵀ"
    });
  }

  const inverse = adj.map(row => row.map(v => Number((v / (det as number)).toFixed(4))));
  steps.push({
    label: "Final Result",
    description: `Multiply the Adjoint matrix by 1/|A| (which is 1/${det}).`,
    matrix: inverse,
    expression: `A⁻¹ = (1/${det}) * [Adjoint]`
  });

  return { result: inverse, steps };
};
