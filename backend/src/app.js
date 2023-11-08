const { auth_router, token_handler } = require("./auth/router");
const { movie_router } = require("./movie_router");
const express = require("express");

const app = express();

app.use(express.json());
app.use("/", token_handler);
app.use("/auth", auth_router);
app.use("/movies", movie_router);

module.exports = { app };
