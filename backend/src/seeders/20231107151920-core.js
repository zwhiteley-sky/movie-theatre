'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */

        await queryInterface.bulkInsert("Users", [
            {
                id: "739c016b-b413-4f47-90d2-639a1c095989",
                name: "zachary",
                email: "zachary@example.com",
                hash: "$2a$12$30aijWjOSLkEeCLDyqVJCeT8opXaMU9EdzUQmYFFoIWWxX4SgOHa."
            }
        ]);

        await queryInterface.bulkInsert("Movies", [
            {
                name: "Five Nights at Freddy's",
                release: new Date(2023, 10, 27)
            },
            {
                name: "Sharknado",
                release: new Date(2013, 7, 11)
            }
        ]);

        // NOTE: screens only have numbers, not names, although this should probably
        // be changed to a similar way to how seats are managed
        await queryInterface.bulkInsert("Screens", [{
            id: 1
        }, {
            id: 2
        }]);

        await queryInterface.bulkInsert("Seats", [
            { screen_id: 1, name: "A1" },
            { screen_id: 1, name: "A2" },
            { screen_id: 1, name: "A3" },
            { screen_id: 1, name: "B1" },
            { screen_id: 1, name: "B2" },

            { screen_id: 2, name: "A1" },
            { screen_id: 2, name: "A2" },
            { screen_id: 2, name: "A3" },
            { screen_id: 2, name: "A4" },
            { screen_id: 2, name: "A5" },
            { screen_id: 1, name: "A1" },
        ]);

        await queryInterface.bulkInsert("Showings", [
            {
                movie_id: 1,
                screen_id: 1,
                start_at: new Date("2023-10-27T18:00:00"),
                end_at: new Date("2023-10-27T20:00:00"),
            },
            {
                movie_id: 2,
                screen_id: 1,
                start_at: new Date("2023-10-27T21:00:00"),
                end_at: new Date("2023-10-27T23:00:00"),
            },
            {
                movie_id: 1,
                screen_id: 2,
                start_at: new Date("2023-10-27T18:00:00"),
                end_at: new Date("2023-10-27T20:00:00"),
            }
        ]);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('BookingSeats', null, {});
        await queryInterface.bulkDelete('Bookings', null, {});
        await queryInterface.bulkDelete('Seats', null, {});
        await queryInterface.bulkDelete('Showings', null, {});
        await queryInterface.bulkDelete('Screens', null, {});
        await queryInterface.bulkDelete('Movies', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    }
};
