const express = require('express');
const router = express.Router();
const mealsController = require('../../../controllers/mealsController')

router.get('/', mealsController.index)
router.post('/', mealsController.create)
router.get('/:meal_id/foods', mealsController.show)

module.exports = router
