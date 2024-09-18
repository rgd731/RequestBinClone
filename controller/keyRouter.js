const router = require("express").Router();
const mongoDb = require("../model/mongo/mongoDb");
const pgDb = require("../model/pg/pg");

const requestLog = async (req, res) => {
  const bin_key = req.params.bin_key;

  try {
    const bin = await pgDb.getBinById(bin_key);
    const payload_id = await mongoDb.addRequestPayload(req);
    await pgDb.createEvent(payload_id, bin.id);
    res.status(200).send();
  } catch (error) {
    console.error(error.message);
  }
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

// Route: '/:bin_key/delete' => Delete all events for a specific key
router.delete("/:bin_key/delete", async (req, res) => {
  // get bin Id based on the bin key
  // get all events tied to the bin Id
  // get all mongoIds from those events
  // delete all documents in mongo tied to those mongoIds
  // delete all events for a bin
  // delete bin

  let binKey = req.params.bin_key;
  let binId = await pgDb.getIdByBin(binKey);

  let events = await pgDb.getEventsByBin(binId);
  let mongoIds = events.map(event => event.mongo_doc_id);
  let mongoDbResult = await mongoDb.deleteDocumentsByIds(mongoIds);
  let deleteEventsResult = await pgDb.deleteEventsByBinId(binId);
  let deleteBinResult = await pgDb.deleteBin(binId);

  if (!mongoDbResult || !deleteEventsResult || !deleteBinResult) {
    res.status(500).send("Something went wrong when deleting event");
  } else {
    res.status(200).send("Bin and its events deleted successfully");
  }
});

// Route: '/:bin_key/delete' => Delete one event from a specific key
router.delete("/:bin_key/delete/:eventId", async (req, res) => {
  let eventId = req.params.eventId;
  let event = await pgDb.getEventById(eventId);
  let mongoDocId = event.mongo_doc_id;

  let mongoDbResult = await mongoDb.deleteById(mongoDocId);
  let pgDbResult = await pgDb.deleteEvent(eventId)

  if (!mongoDbResult || !pgDbResult) {
    res.status(500).send("Something went wrong when deleting event")
  } else {
    res.status(200).send("Event deleted successfully")
  }

});

router.all("/:bin_key", requestLog);

module.exports = router;
