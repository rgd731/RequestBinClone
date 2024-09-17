require("dotenv").config();
const generateKey = require("../utils/generateKey.js")
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error(err, "Error Connection to PostgreSQL"));

const allData = async () => {
  const query = {
    name: "fetch all data",
    text: `SELECT bin.url, requests.request
            FROM bin
            LEFT JOIN requests 
            ON bin.id = requests.bin_id`,
  };

  try {
    const data = await client.query(query);
    return data.rows;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

const allDataWithKeys = async () => {
  const query = {
    name: "fetch all data with keys",
    text: `SELECT bin.*, requests.request
            FROM bin
            LEFT JOIN requests
            ON bin.id = requests.bin_id`,
  };

  try {
    const data = await client.query(query);
    return data.rows;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}

const createBin = async () => {
    const bin_key = generateKey();
    const query = {
      name: "create a bin with generated key",
      text: `INSERT INTO bin (bin_key)
             VALUES (${bin_key})`,
    };
  
    try {
      await client.query(query);
      return bin_key;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

module.exports = { allData, allDataWithKeys, createBin};
