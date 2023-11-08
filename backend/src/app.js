const { auth_router, token_handler } = require("./auth/router");
const express = require("express");

const app = express();

app.use(express.json());
app.use("/", token_handler);
app.use("/auth", auth_router);

app.get("/", (req, res) => {
    res.send(req.user?.id.toString());
});

module.exports = { app };
