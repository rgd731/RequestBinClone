const router = require("express").Router();
const mongoDb = require("../model/mongo/mongoDb");
const pgDb = require("../model/pg/pg");

const requestLog = async (req, res) => {
  const bin_key = req.params.bin_key;

  try {
    const bin = await pgDb.getBinById(bin_key);
    const payload_id = await mongoDb.addRequestPayload(req);
    await pgDb.createEvent(payload_id, bin.id);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error.message);
  }
};

// Format the timestamps in each object
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
};

router.get("/create", async (req, res) => {
  try {
    const bin_key = await pgDb.createBin();
    res.send({ bin_key: bin_key });
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/events", pgDb.getAllEvents);

// Delete all events for a specific key
router.delete("/deleteall/:bin_key", async (req, res) => {
  let binKey = req.params.bin_key;
  let binId = await pgDb.getIdByBin(binKey);

  let events = await pgDb.getEventsByBin(binId);
  let mongoIds = events.map(event => event.mongo_doc_id);
  let mongoDbResult = await mongoDb.deleteDocumentsByIds(mongoIds);
  let deleteEventsResult = await pgDb.deleteEventsByBinId(binId);

  if (!mongoDbResult || !deleteEventsResult || !deleteBinResult) {
    res.status(500).send("Something went wrong when deleting event");
  } else {
    res.status(200).send("Bin and its events deleted successfully");
  }
});

// Delete one event from a specific key
router.delete("/delete/:eventId", async (req, res) => {
  let eventId = req.params.eventId;
  let event = await pgDb.getEventById(eventId);
  let mongoDocId = event.mongo_doc_id;

  let mongoDbResult = await mongoDb.deleteById(mongoDocId);
  let pgDbResult = await pgDb.deleteEvent(eventId);

  if (!mongoDbResult || !pgDbResult) {
    res.status(500).send("Something went wrong when deleting event");
  } else {
    res.status(200).send("Event deleted successfully");
  }

});

router.get("/view/:bin_key", async (req, res) => {
  const bin_key = req.params.bin_key;
  const allPgData = await pgDb.allDataWithKeys();

  // Fetch the Postgres data which matches the bin_key
  const pgData = allPgData.filter((dbItem) => {
    return dbItem.bin_key == bin_key;
  });

  // Fetch the Mongodb data which matches the mongo_doc_id
  let mongoDocumentIds = pgData.map((dbItem) => {
    return dbItem.mongo_doc_id;
  });

  // Fetch all the requests from Mongodb which match the bin_key
  const mongoData = await mongoDb.fetchDocumentsById(mongoDocumentIds);

  if (pgData.length == 0) {
    return res.status(404).send("No events found for this key.");
  }

  dataToBeSent = [];
  for (let i = mongoData.length - 1; i >= 0; i -= 1) {
    dataToBeSent.push({
      id: pgData[i]?.id,
      timestamp: pgData[i]?.received_at,
      method: mongoData[i]?.method,
      path: mongoData[i]?.path,
      headers: mongoData[i]?.headers,
      body: mongoData[i]?.body,
    });
  }

  dataToBeSent = dataToBeSent.map(entry => ({
    ...entry,
    timestamp: formatTimestamp(entry.timestamp),
  }));
  // Send the data in the format:

  // { id:,
  //   timestamp: '',
  //   method: '',
  //   path: '',
  //   headers: [],
  // }

  res.send(dataToBeSent);
});

router.all("/:bin_key", requestLog);
router.all("/:bin_key/*", requestLog);

module.exports = router;
