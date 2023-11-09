const express = require("express");
const { sequelize, Showing, Booking, Seat, Movie } = require("./models");
const { validate } = require("./validate");
const { param, body, matchedData } = require("express-validator");
const { Op } = require("sequelize");
const showing_router = express.Router();

const UNAUTHENTICATED = 0;
const SHOWING_NOT_FOUND = 1;
const SHOWING_ALREADY_SHOWN = 2;
const SEAT_ALREADY_BOOKED = 3;

async function get_available_seats(showing_id, screen_id) {
    const seats = await Seat.findAll({
        include: [
            {
                model: Booking,
                required: false,
    
                // Ensure we do not include bookings for other showings,
                // or an unbooked seat may appear to be booked if it has
                // been booked for another showing
                where: { showing_id }
            }
        ],
        attributes: ["id", "name"],
        where: { screen_id }
    });

    return seats
        .filter(seat => seat.bookings.length === 0)
        .map(seat => { return {
            id: seat.id,
            name: seat.name
        };});
}

showing_router.get("/", async (req, res) => {
    const showings = await Showing.findAll({
        where: {
            start_at: {
                [Op.gt]: new Date()
            }
        }
    });

    res.json(showings);
});

showing_router.get("/:id", validate([
    param("id")
        .trim()
        .isInt()
        .withMessage("path parameter `id` must be an integer")
]), async (req, res) => {
    const { id } = matchedData(req);
    const showing = await Showing.findByPk(id, {
        include: Movie
    });

    if (!showing) return res.status(404).send({
        error_code: SHOWING_NOT_FOUND,
        error_message: "no showing found with the id provided"
    });

    if (new Date(showing.start_at) <= new Date()) return res.json({
        id: showing.id,
        movie: showing.movie,
        screen_id: showing.screen_id,
        start_at: showing.start_at,
        end_at: showing.end_at
    });

    const available_seats = await get_available_seats(showing.id, showing.screen_id);

    res.json({
        id: showing.id,
        movie: showing.movie,
        screen_id: showing.screen_id,
        start_at: showing.start_at,
        end_at: showing.end_at,
        available_seats
    });
});

showing_router.post("/:id/book", validate([
    param("id")
        .trim()
        .isInt()
        .withMessage("path parameter `id` must be an integer"),
    body("seats")
        .isArray({ min: 1 })
        .withMessage("`seats` field must be an array of seat identifiers"),
    body("seats.*")
        .isInt()
        .withMessage("`seats` field must be an array of seat identifiers")
]), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            error_code: UNAUTHENTICATED,
            error_message: "you must be authenticated to make this request" 
        });
    }

    const { id, seats } = matchedData(req);

    // Start a transaction so no one can steal the seats from under us!
    const transaction = await sequelize.transaction();

    try {
        // Check showing exists
        const showing = await Showing.findByPk(id);

        if (!showing) {
            await transaction.rollback();
            return res.status(404).json({
                error_code: SHOWING_NOT_FOUND,
                error_message: "no showing exists with the id specified"
            });
        }

        if (new Date(showing.start_at) <= new Date()) {
            await transaction.rollback();
            return res.status(403).json({
                error_code: SHOWING_ALREADY_SHOWN,
                error_message: "you cannot book a showing that's already been shown"
            });
        }

        // Retrieve the available seats
        const available_seats = (await get_available_seats(showing.id, showing.screen_id))
            .map(s => s.id);

        // Ensure the seats 
        for (const seat of seats) {
            if (available_seats.indexOf(seat) === -1) {
                await transaction.rollback();
                return res.status(403).json({
                    error_code: SEAT_ALREADY_BOOKED,
                    error_message: `seat ${seat} has already been booked`
                });
            }
        }

        const booking = await Booking.create({
            user_id: req.user.id,
            showing_id: showing.id
        });

        await booking.addSeats(seats);
        await transaction.commit();

        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
});

module.exports = { showing_router };
