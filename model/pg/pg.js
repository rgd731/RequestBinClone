require("dotenv").config();
const { Client } = require("pg");
const generateKey = require("../../utils/generateKeys");

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
    text: `SELECT 
              bin.bin_key,
              events.mongo_doc_id,
              events.received_at,
              events.bin_id
            FROM 
                bin
            LEFT JOIN 
                events 
            ON 
              bin.id = events.bin_id;`,
  };

  try {
    const data = await client.query(query);
    return data.rows;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

const getBinById = async (bin_key) => {
  const query = {
    name: "fetch all data",
    text: `SELECT * FROM bin WHERE bin.bin_key = $1`,
    values: [bin_key],
  };

  try {
    const data = await client.query(query);
    return data.rows[0];
  } catch (error) {
    console.error(error.message);
  }
};

const allDataWithKeys = async () => {
  const query = {
    name: "fetch all data with keys",
    text: `SELECT 
              bin.bin_key,
              events.mongo_doc_id,
              events.received_at,
              events.bin_id
            FROM 
                bin
            LEFT JOIN 
                events 
            ON 
              bin.id = events.bin_id;`,
  };

  try {
    const data = await client.query(query);
    return data.rows;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

const createEvent = async (mongo_doc_id, bin_id) => {
  const query = {
    name: "Create new event",
    text: `INSERT INTO events (mongo_doc_id, bin_id)
          VALUES ($1, $2)`,
    values: [mongo_doc_id, bin_id],
  };

  try {
    await client.query(query);
  } catch (error) {
    console.error(error.message);
  }
};

const getAllEvents = async (req, res) => {
  const query = {
    name: "get all events in db",
    text: "SELECT * FROM events",
  };

  try {
    const events = await client.query(query);
    res.send({ events: events.rows });
  } catch (error) {
    console.error(error.message);
  }
};

const createBin = async () => {
  const bin_key = generateKey.generateKey();
  const query = {
    name: "create a bin with generated key",
    text: `INSERT INTO bin (bin_key)
          VALUES ($1)`,
    values: [bin_key],
  };

  try {
    await client.query(query);
    return bin_key;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

module.exports = {
  allData,
  allDataWithKeys,
  createEvent,
  getAllEvents,
  createBin,
  getBinById,
};
