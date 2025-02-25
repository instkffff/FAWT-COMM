import { createMatrix, fill36x36MatrixWith3x3Matrices, matrixToCSV, fill12x12MatrixWithNumbers } from "../../matrixFill/matrixFill.js";
import { arrayTo3x3Matrix } from "../../matrixFill/triMatrix.js";
import { parsePacket } from '../../Packet/PacketParse.js';
import fs from 'fs/promises'; // 使用 fs/promises 模块
import path from 'path';

import { clients, rpmMatrixCsv, TSOKMatrixCSV } from '../shared.js';

const matrix36x36F = createMatrix(36, 36);
const matrix36x36L = createMatrix(36, 36);

rpmMatrixCsv[0] = matrixToCSV(matrix36x36F)
rpmMatrixCsv[1] = matrixToCSV(matrix36x36L)
rpmMatrixCsv[2] = matrix36x36L
rpmMatrixCsv[3] = matrix36x36F

function RDR2Matrix(DataPacket, clientId, matrix1, matrix2) {
    
    const firstNineNumbers = DataPacket.data.slice(0, 9);
    const lastNineNumbers = DataPacket.data.slice(9, 18);

    const matrixF = arrayTo3x3Matrix(firstNineNumbers);

    const matrixL = arrayTo3x3Matrix(lastNineNumbers);

    fill36x36MatrixWith3x3Matrices(matrix1, clientId, matrixF);

    fill36x36MatrixWith3x3Matrices(matrix2, clientId, matrixL);

    const rpmMatrixF = matrixToCSV(matrix1);

    const rpmMatrixL = matrixToCSV(matrix2);

    return { rpmMatrixF, rpmMatrixL };
}

async function csvToHtmlTable(csv) {
    const rows = csv.split('\n');
    let html = '<table style="border-collapse: collapse; width: 1152px;">\n';

    for (let i = 0; i < rows.length; i++) {
        html += '<tr>\n';
        const columns = rows[i].split(',');
        for (let j = 0; j < columns.length; j++) {
            html += `<td style="height: 32px; width: 32px; text-align: center; font-size: 10px; border: 1px solid black;">${columns[j]}</td>\n`;
        }
        html += '</tr>\n';
    }

    html += '</table>';
    return html;
}

function RDR2MatrixCSV(DataPacket, clientId, matrix1, matrix2) {
    const rpmMatrix = RDR2Matrix(DataPacket, clientId, matrix1, matrix2);
    return rpmMatrix;
}

async function writeToRDRHTML(rpmMatrixCsv) {
    const htmlTableF = await csvToHtmlTable(rpmMatrixCsv[0]);
    const htmlTableL = await csvToHtmlTable(rpmMatrixCsv[1]);
    const RDRHTMLPathF = path.join('html', 'RDRF.html');
    const RDRHTMLPathL = path.join('html', 'RDRL.html');
    try {
        await fs.writeFile(RDRHTMLPathF, htmlTableF); // 使用 await 等待文件写入完成
        await fs.writeFile(RDRHTMLPathL, htmlTableL);
        console.log('Update RDR');
    } catch (err) {
        console.error('Error writing to file', err);
    }
}

export { RDR2Matrix, RDR2MatrixCSV, writeToRDRHTML };