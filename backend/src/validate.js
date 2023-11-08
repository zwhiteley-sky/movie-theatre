const { validationResult } = require("express-validator");

const validate = (validators) => {
    return async function(req, res, next) {
        for (const validator of validators) {
            const result = await validator.run(req);
            if (result.errors.length) break;
        }

        const result = validationResult(req);
        if (result.isEmpty()) return next();
        
        res.status(400).json({ error: result.array() });
    }
}

module.exports = { validate };
