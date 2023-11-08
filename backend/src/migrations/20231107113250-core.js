'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            hash: {
                type: Sequelize.STRING
            }
        });

        // Ensure no two users can have the same email/name
        await queryInterface.addIndex("Users", {
            fields: ["name"],
            unique: true
        });
        await queryInterface.addIndex("Users", {
            fields: ["email"],
            unique: true
        });

        await queryInterface.createTable('Movies', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: { 
                type: Sequelize.STRING,
                allowNull: false
            },
            release: { 
                type: Sequelize.DATEONLY,
                allowNull: false
            }
        });

        await queryInterface.createTable("Showings", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true 
            },
            start_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            movie_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Movies",
                    key: "id"
                },
                allowNull: false,
                onUpdate: "cascade",
                onDelete: "cascade"
            },
            screen_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Screens",
                    key: "id"
                },
                allowNull: false,
                onUpdate: "cascade",
                onDelete: "cascade"
            }
        });

        await queryInterface.createTable("Screens", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            }
        });

        await queryInterface.createTable("Seats", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: { 
                type: Sequelize.STRING,
                allowNull: false
            },
            screen_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Screens",
                    key: "id"
                },
                allowNull: false,
                onUpdate: "cascade",
                onDelete: "cascade"
            }
        });

        await queryInterface.createTable("Bookings", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                references: {
                    model: "Users",
                    key: "id"
                },
                onUpdate: "cascade",
                onDelete: "set null"
            },
            showing_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Showings",
                    key: "id"
                },
                allowNull: false,
                onUpdate: "cascade",
                onDelete: "cascade"
            }
        });

        await queryInterface.createTable("BookingSeats", {
            booking_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: "Bookings",
                    key: "id"
                },
                allowNull: false,
                onUpdate: "cascade",
                onDelete: "cascade"
            },
            seat_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: "Seats",
                    key: "id"
                },
                allowNull: false,
                onUpdate: "cascade",
                onDelete: "cascade"
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('BookingSeats');
        await queryInterface.dropTable('Bookings');
        await queryInterface.dropTable('Seats');
        await queryInterface.dropTable('Showings');
        await queryInterface.dropTable('Screens');
        await queryInterface.dropTable('Movies');
        await queryInterface.dropTable('Users');
    }
};
