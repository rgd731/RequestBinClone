const router = require("express").Router();
const mongoDb = require("../model/mongo/mongoDb");
const pgDb = require("../model/pg/pg");
let dataStore = {};

router.get("/:bin_key", async (req, res) => {
  const allPgData = await pgDb.allDataWithKeys();
  const bin_key = req.params.bin_key;

  // Fetch the Postgres data which matches the bin_key
  const pgData = allPgData.filter(dbItem => {
    return dbItem.bin_key == bin_key;
  });

  // Fetch the Mongodb data which matches the mongo_doc_id
  const mongoDocumentIds = pgData.map(dbItem => {
    return dbItem.mongo_doc_id;
  })

  // Fetch all the requests from Mongodb which match the bin_key
  const mongoData = await mongoDb.fetchDocumentsById(mongoDocumentIds);

  if (pgData.length == 0) {
    return res.status(404).send("No events found for this key.");
  }

  dataToBeSent = [];
  for (let i = 0; i < pgData.length; i += 1) {
    dataToBeSent.push({
      id: pgData[i].id,
      timestamp: pgData[i].received_at,
      method: mongoData[i].method,
      path: mongoData[i].path,
      headers: mongoData[i].headers,
    })
  }

  // Send the data in the format:

  // { id:,
      //   timestamp: '',
      //   method: '',
      //   path: '',
      //   headers: [],
      // }

  // Add additional info later based on what an HTTP request sends

  res.send(dataToBeSent);
});

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
