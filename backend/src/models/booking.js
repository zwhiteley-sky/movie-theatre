'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
        * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
        */
        static associate(models) {
            Booking.belongsTo(models.User, { foreignKey: "user_id" });
            Booking.belongsTo(models.Showing, { foreignKey: "showing_id" });
            Booking.belongsToMany(models.Seat, {
                through: "BookingSeats",
                foreignKey: "booking_id",
                otherKey: "seat_id"
            });
        }
    }

    Booking.init({}, {
        sequelize,
        modelName: 'Booking',
        name: {
            singular: "booking",
            plural: "bookings"
        }
    });

    return Booking;
};
