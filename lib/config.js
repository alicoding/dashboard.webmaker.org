var habitat = require( "habitat" );

// Load config from ".env"
habitat.load();

module.exports = new habitat();
