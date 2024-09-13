const router = require("express").Router();

let dataStore = {};

router.get("/", (req, res) => {
  return res.status(200).send("<h1>Hello Team 6!</h1>");
});

router.get("/:key", (req, res) => {
  const key = req.params.key;

  if (!dataStore[key]) {
    return res.status(404).send("No events found for this key.");
  }

  res.json(dataStore[key]);
});

router.get("/:key/:event_id", (req, res) => {
  const key = req.params.key;
  const eventId = parseInt(req.params.event_id);

  if (!dataStore[key]) {
    return res.status(404).send("Key not found.");
  }

  const event = dataStore[key].find((e) => e.id === eventId);

  if (!event) {
    return res.status(404).send("Event not found.");
  }

  res.json(event);
});

// Route: '/:key/delete' => Delete all events for a specific key
router.delete("/:key/delete", (req, res) => {
  const key = req.params.key;

  if (!dataStore[key]) {
    return res.status(404).send("Key not found.");
  }

  delete dataStore[key];
  res.send(`All events for key: ${key} have been deleted.`);
});

// Route: '/create' => Create a new key (Initialize it with an empty array)
router.post("/create", (req, res) => {
  const key = req.body.key;

  if (!key) {
    return res.status(400).send("Key is required.");
  }

  if (dataStore[key]) {
    return res.status(400).send("Key already exists.");
  }

  dataStore[key] = [];
  res.status(201).send(`Key '${key}' created.`);
});

module.exports = router;
