const { auth_router, token_handler } = require("./auth/router");
const { movie_router } = require("./movie_router");
const { showing_router } = require("./showing_router");
const { booking_router } = require("./booking_router");
const proxy = require("express-http-proxy");
const cors = require("cors");
const express = require("express");

const app = express();

// Gateway (redirects all non API requests to NextJS)
app.use(proxy("http://localhost:3000", {
    filter: async (req, _) => {
        return !(req.subdomains.length === 1 && req.subdomains[0] === "api");
    }
}));

app.use(cors({
    origin: "http://example.com:4000",
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use("/", token_handler);
app.use("/auth", auth_router);
app.use("/movies", movie_router);
app.use("/showings", showing_router);
app.use("/bookings", booking_router);

module.exports = { app };
