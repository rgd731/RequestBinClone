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

router.all("/:bin_key", requestLog);

router.get("/create", async (req, res) => {
  try {
    const bin_key = await pgDb.createBin();
    res.send({ bin_key: bin_key });
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/events", pgDb.getAllEvents);

// router.get("/:key", (req, res) => {
//   const key = req.params.key;

//   if (!dataStore[key]) {
//     return res.status(404).send("No events found for this key.");
//   }

//   res.json(dataStore[key]);
// });

// router.get("/:key/:event_id", (req, res) => {
//   const key = req.params.key;
//   const eventId = parseInt(req.params.event_id);

//   if (!dataStore[key]) {
//     return res.status(404).send("Key not found.");
//   }

//   const event = dataStore[key].find((e) => e.id === eventId);

//   if (!event) {
//     return res.status(404).send("Event not found.");
//   }

//   res.json(event);
// });

// // Route: '/:key/delete' => Delete all events for a specific key
// router.delete("/:key/delete", (req, res) => {
//   const key = req.params.key;

//   if (!dataStore[key]) {
//     return res.status(404).send("Key not found.");
//   }

//   delete dataStore[key];
//   res.send(`All events for key: ${key} have been deleted.`);
// });

module.exports = router;
