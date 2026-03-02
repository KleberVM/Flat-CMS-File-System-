const fs = require('fs/promises');
const path = require('path');

const dataPath = path.join(__dirname, '../data/noticias.json');

const readData = async () => {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
};

const writeData = async (data) => {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };