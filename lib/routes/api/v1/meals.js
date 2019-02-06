const express = require('express');
const router = express.Router();
const mealsController = require('../../../controllers/meals_controller')

router.get('/', mealsController.index);
router.get('/:meal_id/foods', mealsController.show);
router.post('/:meal_id/foods/:id', mealsController.create);
router.delete('/:meal_id/foods/:id', mealsController.destroy)

module.exports = router