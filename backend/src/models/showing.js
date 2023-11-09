"use strict";

const {
    Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Showing extends Model {
        /**
        * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
        */
        static associate(models) {
            Showing.belongsTo(models.Screen, { foreignKey: "screen_id" });
            Showing.belongsTo(models.Movie, { foreignKey: "movie_id" });
            Showing.hasMany(models.Booking, { foreignKey: "showing_id" });
        }
    }

    Showing.init({
        start_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "Showing",
        name: {
            singular: "showing",
            plural: "showings"
        }
    });

    return Showing;
};
