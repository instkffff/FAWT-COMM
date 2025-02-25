import { createMatrix, fill36x36MatrixWith3x3Matrices, matrixToCSV, fill12x12MatrixWithNumbers } from "../../matrixFill/matrixFill.js";
import { parsePacket } from '../../Packet/PacketParse.js';
import fs from 'fs/promises'; // 使用 fs/promises 模块
import path from 'path';

import { clients, rpmMatrixCsv, TSOKMatrixCSV } from '../shared.js';

const matrix12x12 = createMatrix(12, 12);

TSOKMatrixCSV[0] = matrixToCSV(matrix12x12)
TSOKMatrixCSV[1] = matrix12x12
function TSOK2Matrix(clientId, matrix) {
    fill12x12MatrixWithNumbers(matrix, clientId, 1);
    return matrixToCSV(matrix);
}

async function csvToHtmlTable(csv) {
    const rows = csv.split('\n');
    let html = '<table style="border-collapse: collapse; width: 384px;">\n';

    for (let i = 0; i < rows.length; i++) {
        html += '<tr>\n';
        const columns = rows[i].split(',');
        for (let j = 0; j < columns.length; j++) {
            const cellValue = columns[j];
            const cellColor = cellValue === '1' ? 'green' : 'red';
            html += `<td style="height: 32px; width: 32px; text-align: center; font-size: 10px; border: 1px solid black; background-color: ${cellColor};">${cellValue}</td>\n`;
        }
        html += '</tr>\n';
    }

    html += '</table>';
    return html;
}

async function writeToTSOKHTML(TSOKMatrixCSV) {
    const TSOKcsv = await csvToHtmlTable(TSOKMatrixCSV[0]);

    const TSOKPath = path.join('html', 'TSOK.html');
    try {
        await fs.writeFile(TSOKPath, TSOKcsv); // 使用 await 等待文件写入完成
        console.log('Update TSOK');
    } catch (err) {
        console.error('Error writing to file', err);
    }
}



export { TSOK2Matrix, writeToTSOKHTML, matrix12x12 };