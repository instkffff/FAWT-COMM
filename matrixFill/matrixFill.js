function createMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(0);
    }
    return matrix;
}

function fill36x36MatrixWith3x3Matrices(matrix36x36, id, matrix) {
    const row = Math.floor((id - 101) / 12) * 3;
    const col = ((id - 101) % 12) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            matrix36x36[row + i][col + j] = matrix[i][j];
        }
    }
}

function fill12x12MatrixWithNumbers(matrix, id, num) {
    const row = Math.floor((id - 101) / 12);
    const col = (id - 101) % 12;
    matrix[row][col] = num;
}

function matrixToCSV(matrix) {
    return matrix.map(row => row.join(',')).join('\n');
}

export { createMatrix, fill36x36MatrixWith3x3Matrices, matrixToCSV, fill12x12MatrixWithNumbers };