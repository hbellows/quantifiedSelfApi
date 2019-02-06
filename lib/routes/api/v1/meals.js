const express = require('express');
const router = express.Router();
const mealsController = require('../../../controllers/meals_controller')

router.get('/', mealsController.index)

module.exports = router
