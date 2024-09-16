const router = require("express").Router();
const mongoDb = require("../model/mongo/mongoDb");
const pgDb = require("../model/pg/pg");
let dataStore = {};

router.get("/:key", async (req, res) => {
  const pgData = await pgDb.allDataWithKeys();
  const key = parseInt(req.params.key);

  const data = pgData.filter(dbItem => {
    return dbItem.id == key;
  });

  // data is in an array of objects {id, url, request}

  if (data.length == 0) {
    return res.status(404).send("No events found for this key.");
  }

  // Temporary print out info
  let html = '<h1>Events for key/id</h1>'

  data.forEach(element => {
    html += `<ul>
              <li>id: ${element.id}</li>
              <li>url: ${element.url}</li>
              <li>request: ${element.request}</li>
            </ul>`;
  });

  res.send(html);
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
