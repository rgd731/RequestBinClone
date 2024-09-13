const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// In-memory storage for the sake of simplicity (Use a database in production)
let dataStore = {};

// Middleware to parse JSON bodies (for POST requests)
app.use(bodyParser.json());

// Route: '/:key' => Receive and store HTTP requests for a specific key
app.post('/:key', (req, res) => {
    const key = req.params.key;
    const event = req.body;

    // If key doesn't exist in the data store, create it as an array
    if (!dataStore[key]) {
        dataStore[key] = [];
    }

    // Add the event to the key's list
    const eventId = dataStore[key].length + 1;
    const newEvent = { id: eventId, ...event };

    dataStore[key].push(newEvent);
    res.status(201).send(`Event added with ID: ${eventId}`);
});

// Route: '/view/:key' => Show the list of events for a specific key
app.get('/view/:key', (req, res) => {
    const key = req.params.key;

    if (!dataStore[key]) {
        return res.status(404).send('No events found for this key.');
    }

    res.json(dataStore[key]);
});

// Route: '/view/:key/:event_id' => Show details of an individual event
app.get('/view/:key/:event_id', (req, res) => {
    const key = req.params.key;
    const eventId = parseInt(req.params.event_id);

    if (!dataStore[key]) {
        return res.status(404).send('Key not found.');
    }

    const event = dataStore[key].find(e => e.id === eventId);

    if (!event) {
        return res.status(404).send('Event not found.');
    }

    res.json(event);
});

// Route: '/:key/delete' => Delete all events for a specific key
app.delete('/:key/delete', (req, res) => {
    const key = req.params.key;

    if (!dataStore[key]) {
        return res.status(404).send('Key not found.');
    }

    delete dataStore[key];
    res.send(`All events for key: ${key} have been deleted.`);
});

// Route: '/create' => Create a new key (Initialize it with an empty array)
app.post('/create', (req, res) => {
    const key = req.body.key;

    if (!key) {
        return res.status(400).send('Key is required.');
    }

    if (dataStore[key]) {
        return res.status(400).send('Key already exists.');
    }

    dataStore[key] = [];
    res.status(201).send(`Key '${key}' created.`);
});

// Set the port for the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
