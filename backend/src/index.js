// Set env variables
require("dotenv").config({ path: "../.env" });

const { app } = require("./app");

const PORT = 3000;

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error_code: -1,
        error_message: "Uh oh! An unknown error occurred"
    });
});

app.listen(3000);
