const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { getPackages } = require("./parser");

app.use(express.json());
app.use(cors());

app.get("/api/packages", async (req, res) => {
  const packages = await getPackages("./status.txt");
  res.json(packages);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
