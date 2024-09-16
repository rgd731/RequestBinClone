const router = require("express").Router();
const mongoDb = require("../model/mongo/mongoDb");
const pgDb = require("../model/pg/pg");
let dataStore = {};

const getAllData = async (req, res) => {
  const pgData = await pgDb.allData();
  const mongoData = await mongoDb.getKeys();

  res.send({ postgres: pgData, mongo: mongoData });
};

router.get("/", getAllData);

// Route: '/create' => Create a new key (Initialize it with an empty array)
router.post("/", mongoDb.addTestKey);

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
