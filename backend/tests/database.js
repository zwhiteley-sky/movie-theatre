process.env.JWT_KEY = "qiOriTEI5Rg1LhFG8dfisJECEAJ3roEIIqxol5VKPAc=";

const { Umzug, SequelizeStorage } = require("umzug");
const { Sequelize } = require("sequelize");
const { sequelize, User } = require("../src/models");

const umzug = new Umzug({
    migrations: {
        glob: `${__dirname}/../src/{seeders,migrations}/*.js`,
        
        // NOTE: for some reason, sequelize-cli uses a different migration format to umzug, despite
        //       BOTH BEING DESIGNED AND MAINTAINED BY SEQUELIZE?!?! Nonsense but at least this workaround
        //       works
        resolve: ({name, path, context}) => {
          // Adjust the migration from the new signature to the v2 signature, making easier to upgrade to v3
          const migration = require(path);
          return { name, up: async () => migration.up(context, Sequelize), down: async () => migration.down(context, Sequelize) }
        }
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console
});

function test_db() {
    beforeAll(async () => {
        // Initial migration (set up the database)
        await umzug.up({ steps: 1 }); 
    });

    beforeEach(async () => {
        // Seed the database for each test
        await umzug.up({ steps: 1 });
    });

    afterEach(async () => {
        // Unseed the database
        await umzug.down({ steps: 1 });
    });

    afterAll(async () => {
        await umzug.down({ to: 0 });
    });
}

module.exports = { test_db };
