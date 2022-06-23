// In this file you can configure migrate-mongo
require('dotenv').config()

const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: `${process.env.DATABASE}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.MONGO_DOCKER_PORT}`,

    // TODO Change this to your database name:
    databaseName: `${process.env.DB_NAME}`,

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir 
  migrationFileExtension: ".js",

  moduleSystem: 'commonjs',  
};

// Return the config as a promise
module.exports = config;
