const express = require('express');
const router = express.Router();
const mealsController = require('../../../controllers/mealsController')

router.get('/', mealsController.index)
router.post('/', mealsController.createMeal)
router.get('/:meal_id/foods', mealsController.show)
router.get('/:meal_id/foods/:id', mealsController.show)
router.post('/:meal_id/foods/:id', mealsController.create)
router.delete('/:meal_id/foods/:id', mealsController.destroy)

module.exports = router
