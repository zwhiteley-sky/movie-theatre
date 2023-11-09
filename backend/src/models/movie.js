"use strict";

const {
    Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Movie extends Model {
        /**
        * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
        */
        static associate(models) {
            Movie.hasMany(models.Showing, { foreignKey: "movie_id" });
        }
    }

    Movie.init({
        name: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        release: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "Movie",
        name: {
            singular: "movie",
            plural: "movies"
        }
    });

    return Movie;
};
