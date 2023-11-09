const express = require("express");
const { Movie, Showing } = require("./models");
const { param, matchedData } = require("express-validator");
const { validate } = require("./validate");
const { Op } = require("sequelize");
const movie_router = express.Router();

const MOVIE_NOT_FOUND = 1;

movie_router.get("/", async (req, res, next) => {
    const movies = await Movie.findAll({
        attributes: ["id", "name"]
    });

    res.json(movies);
});

movie_router.get("/:id", validate([
    param("id")
        .trim()
        .isInt()
        .withMessage("path parameter must be an integer")
]), async (req, res) => {
    const { id } = matchedData(req);

    const movie = await Movie.findOne({
        where: { id },
    });

    if (movie) {
        res.json(movie);
    }
    else res.status(404).send({
        error_code: MOVIE_NOT_FOUND,
        error_message: "no movie exists with the id specified"
    });
});

movie_router.get("/:id/showings", validate([
    param("id")
        .trim()
        .isInt()
        .withMessage("path parameter must be an integer")
]), async (req, res) => {
    const { id } = matchedData(req);

    const movie = await Movie.findOne({
        where: { id },
        include: {
            model: Showing,
            where: {
                start_at: {
                    [Op.gt]: new Date()
                }
            }
        }
    });

    if (movie) res.json(movie.showings);
    else res.status(404).json({
        error_code: MOVIE_NOT_FOUND,
        error_message: "no movie exists with the id specified"
    });
});

module.exports = { movie_router };
