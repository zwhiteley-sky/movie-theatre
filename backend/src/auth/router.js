const express = require("express");
const { body, validationResult, matchedData } = require("express-validator");
const { validate } = require("../validate");
const { User } = require("../models");
const { UniqueConstraintError } = require("sequelize");
const { INVALID_LOGIN, EMAIL_IN_USE, NAME_IN_USE } = require("./error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_KEY = Buffer.from(process.env.JWT_KEY, "base64");
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Zi$&+,:;=?@#|'<>.^*()%!-]{8,}$/;
const AUTH_ERROR = {
    error_code: INVALID_LOGIN,
    error_message: "invalid email or password" 
};

const auth_router = express.Router();

auth_router.post("/login", validate([
    body("email")
        .trim()
        .isEmail().withMessage("invalid email"),

    body("password")
        .isLength(8, 32).withMessage("password must be between 8 and 32 characters in length")
        .matches(PASSWORD_REGEX)
        .withMessage("password must contain at least one digit and uppercase character")
]), async (req, res) => {
    const { email, password } = matchedData(req);
    
    // Get the user with the email
    const user = await User.findOne({
        where: { email }
    });

    // If the user does not exist, return 401
    if (!user) {
        return res.status(401).json(AUTH_ERROR);
    }

    // Compare hashes
    if (!await bcrypt.compare(password, user.hash)) {
        return res.status(401).json(AUTH_ERROR);
    } 

    // Generate JWT
    const token = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email
    }, JWT_KEY, {
        expiresIn: "24h"
    });

    // Return response
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
    });
});

auth_router.post("/register", validate([
    body("name")
        .isAlphanumeric()
        .withMessage("name must be alphanumeric")
        .isLength({ min: 2, max: 14 })
        .withMessage("name must have a minimum length of 2 and a maximum length of 14"),
    
    body("email")
        .isEmail()
        .withMessage("invalid email provided"),
    
    body("password")
        .isLength({ min: 8, max: 32})
        .withMessage("password must have a length between 8 and 32")
        .matches(PASSWORD_REGEX)
        .withMessage("password must contain at least one uppercase character and one number")
]), async (req, res) => {
    const { name, email, password } = matchedData(req);
    const hash = await bcrypt.hash(password, 12);

    try {
        const user = await User.create({
            name, email, hash
        });

        res.json({
            id: user.id,
            name,
            email
        });
    } catch (err) {
        if (!(err instanceof UniqueConstraintError)) {
            throw err;
        }

        if (!err.fields) throw err;

        let error;

        if (err.fields[0] === "email") {
            error = {
                error_code: EMAIL_IN_USE,
                error_message: "email is already in use"
            };
        } else if (err.fields[0] === "name") {
            error = {
                error_code: NAME_IN_USE,
                error_message: "username is already taken"
            };
        } else throw err;

        res.status(401).json(error);
    }
});

function token_handler(req, res, next) {
    if (!req.headers.authorization) return next();
    if (!req.headers.authorization.startsWith("Bearer ")) return next();

    try {
        const payload = jwt.verify(req.headers.authorization.slice(7), JWT_KEY);
        req.user = {
            id: payload.id,
            name: payload.name,
            email: payload.email
        };
    } catch {} finally {
        next();
    }
}

module.exports = { auth_router, token_handler };
