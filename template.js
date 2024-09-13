const express = require('express');
const app = express();

// Define a route for the root URL ('/')
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
