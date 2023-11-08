// Set env variables
require("dotenv").config({ path: "../.env" });

const { app } = require("./app");

const PORT = 3000;

app.listen(3000);
