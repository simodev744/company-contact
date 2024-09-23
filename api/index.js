const app = require('../index.js'); // Adjust the path to your Express app
const serverless = require('serverless-http');

module.exports.handler = serverless(app);