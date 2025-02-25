function arrayTo3x3Matrix(array) {
    if (array.length !== 9) {
        throw new Error("数组长度必须为9");
    }
    const matrix = [];
    for (let i = 0; i < 3; i++) {
        matrix[i] = array.slice(i * 3, (i + 1) * 3);
    }
    return matrix;
}

export { arrayTo3x3Matrix };

// 示例用法

/* const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const matrix = arrayTo3x3Matrix(array);
console.log(matrix); */