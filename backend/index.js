const express = require("express");
const path = require('path');
const app = express();
const { getPackages } = require("./parser");
const { getStatusFile } = require("./statusFileResolver");
const logger = require('./logger');

app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Handle GET requests to /api/packages route
app.get("/api/packages", async (req, res) => {
  const statusFile = getStatusFile();
  const packages = await getPackages(statusFile);
  res.json(packages);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.success(`app started on port ${PORT}`);
});
