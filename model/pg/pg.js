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

const getIdByBin = async (binKey) => {
  const query = {
    name: "retrieve a bin Id, given a bin key",
    text: "SELECT id FROM bin WHERE bin_key=$1",
    values: [binKey],
  }

  try {
    const data = await client.query(query);
    return data.rows[0].id;
  } catch (error) {
    console.error("Could not retrieve to id of bin: ", error.message);
  }
}

const getEventById = async (eventId) => {
  const query = {
    name: "retrieves event given an Id",
    text: "SELECT * FROM events WHERE id=$1",
    values: [eventId],
  };

  try {
    const data = await client.query(query);
    return data.rows[0];
  } catch (error) {
    console.error("Could not retrieve an event with given Id: ", error.message);
  }
}

const deleteEvent = async (id) => {
  const query = {
    name: "remove an event from events table given an id",
    text: `DELETE FROM events
           WHERE id = $1`,
    values: [id]
  }

  try {
    const data = await client.query(query);
    if (data.rowCount > 0) {
      console.log("Deleted event successfully")
      return true;
    } else {
      console.log(`No event with ID ${id} was found.`)
    }
  } catch (error) {
    console.error("Error deleting event: ", error.message)
  }
}

const deleteEventsByBinId = async (binId) => {
  const query = {
    name: "remove all events from events table given an bin_id",
    text: `DELETE FROM events
           WHERE bin_id = $1`,
    values: [binId],
  }

  try {
    const data = await client.query(query);
    if (data.rowCount > 0) {
      console.log("Deleted events successfully")
      return true;
    } else {
      console.log(`No events for bin was found.`)
    }
  } catch (error) {
    console.error("Error deleting bin events: ", error.message)
  }
}

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

const getEventsByBin = async (binId) => {
  const query = {
    name: "get all events for a specific bin",
    text: "SELECT * FROM events WHERE bin_id=$1",
    values: [binId],
  }

  try {
    const data = await client.query(query);
    return data.rows;
  } catch (error) {
    console.error("Could not retrieve all events for a bin:", error.message);
  }
}

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

const deleteBin = async (id) => {
  const query = {
    name: "delete a bin given its id",
    text: 'DELETE FROM bin WHERE id=$1',
    values: [id],
  };

  try {
    const data = await client.query(query);
    if (data.rowCount > 0) {
      console.log("Bin deleted successfully");
      return true;
    } else {
      console.log("Could not find a bin with given Id");
    }
  } catch (error) {
    console.error("Error deleting a bin: ", error.message);
  }
}

module.exports = {
  allData,
  deleteEventsByBinId,
  allDataWithKeys,
  createEvent,
  getAllEvents,
  getEventsByBin,
  createBin,
  getBinById,
  getIdByBin,
  getEventById,
  deleteEvent,
  deleteBin,
};
