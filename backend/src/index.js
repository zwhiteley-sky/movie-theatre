// Set env variables
require("dotenv").config({ path: "../.env" });

const { app } = require("./app");

if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "production") {
    throw new Error("this file does not support a production environment");
}

const PORT = 4000;

app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({
        error_code: -1,
        error_message: "Uh oh! An unknown error occurred"
    });
});

app.listen(PORT);
