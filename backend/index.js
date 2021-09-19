const express = require("express");
const cors = require("cors");
const app = express();
const { getPackages } = require("./parser");
const { getStatusFile } = require("./statusFileResolver");
const logger = require('./logger');

app.use(express.json());
app.use(cors());

const statusFile = getStatusFile();

app.get("/api/packages", async (req, res) => {
  const packages = await getPackages(statusFile);
  res.json(packages);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.success(`app started on port ${PORT}`);
});
