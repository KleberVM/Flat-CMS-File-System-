const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(__dirname, "../data/noticias.json");

const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    if (!data || data.trim() === "") {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeData([]);
      return [];
    }
    throw error;
  }
};

const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };
