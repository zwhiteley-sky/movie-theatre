const express = require("express");
const booking_router = express.Router();
const { Booking, Showing, Movie, Seat } = require("./models");
const { param } = require("express-validator");
const { validate } = require("./validate");
const { Op } = require("sequelize");

const UNAUTHENTICATED = 0;
const BOOKING_NOT_FOUND = 1;

booking_router.get("/", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            error_code: UNAUTHENTICATED,
            error_message: "you must be authenticated to make this request"
        });
    }

    const bookings = await Booking.findAll({
        where: {
            user_id: req.user.id
        },
        include: [
            {
                model: Showing,
                where: {
                    start_at: {
                        [Op.gt]: new Date()
                    }
                },
                attributes: ["id", "start_at"],
                include: {
                    model: Movie,
                    attributes: ["id", "name"]
                }
            }
        ],
        attributes: ["id"]
    });

    res.json(bookings);
});

booking_router.get("/:id", validate([
    param("id")
        .trim()
        .isInt()
        .withMessage("path parameter `id` must be an integer")
]), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            error_code: 0,
            error_message: "you must be authenticated to make this request"
        });
    }

    const booking = await Booking.findByPk(req.params.id, {
        include: [
            {
                model: Showing,
                where: {
                    start_at: {
                        [Op.gt]: new Date()
                    }
                },
                attributes: ["id", "screen_id", "start_at", "end_at"],
                include: Movie
            },
            {
                model: Seat,
                attributes: ["id", "name"],
                through: { attributes: [] }
            }
        ],
        attributes: ["id", "user_id"]
    });

    // If the booking does not exist OR if it does not belong
    // to the user making the request
    if (!booking || booking.user_id !== req.user.id) {
        return res.status(404).json({
            error_code: BOOKING_NOT_FOUND,
            error_message: "booking not found"
        });
    }

    delete booking.user_id;

    res.json(booking);
    
});

module.exports = { booking_router };
