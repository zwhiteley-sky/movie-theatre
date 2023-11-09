// Set env variables
require("dotenv").config({ path: "../.env" });

const proxy = require("express-http-proxy");
const { app } = require("./app");

const PORT = 4000;

// Gateway (redirects all non API requests to NextJS)
app.use(proxy("http://localhost:3000", {
    filter: async (req, _) => {
        return !(req.subdomains.length === 1 && req.subdomains[0] === "api");
    }
}));

app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({
        error_code: -1,
        error_message: "Uh oh! An unknown error occurred"
    });
});

app.listen(PORT);
