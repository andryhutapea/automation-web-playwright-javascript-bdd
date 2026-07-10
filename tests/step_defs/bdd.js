const { createBdd } = require('playwright-bdd');
const { test } = require('./pages.fixture');

module.exports = createBdd(test);
