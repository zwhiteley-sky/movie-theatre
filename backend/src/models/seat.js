"use strict";

const {
    Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Seat extends Model {
        /**
        * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
        */
        static associate(models) {
            Seat.belongsTo(models.Screen, { foreignKey: "screen_id" });
            Seat.belongsToMany(models.Booking, {
                through: "BookingSeats",
                foreignKey: "seat_id",
                otherKey: "booking_id"
            });
        }
    }

    Seat.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "Seat",
        name: {
            singular: "seat",
            plural: "seats"
        }
    });

    return Seat;
};
