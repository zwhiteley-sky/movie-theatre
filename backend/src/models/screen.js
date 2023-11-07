'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Screen extends Model {
        /**
        * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
        */
        static associate(models) {
            Screen.hasMany(models.Seat, { foreignKey: "screen_id" });
            Screen.hasMany(models.Showing, { foreignKey: "screen_id" });
        }
    }

    Screen.init({}, {
        sequelize,
        modelName: 'Screen',
        name: {
            singular: "screen",
            plural: "screens"
        }
    });

    return Screen;
};
