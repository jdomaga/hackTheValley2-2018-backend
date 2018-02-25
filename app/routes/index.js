// routes/index.js

const matchingroutes = require('./match_routes');
module.exports = function(app, db) {
    matchingroutes(app, db);
  // Other route groups could go here, in the future
};