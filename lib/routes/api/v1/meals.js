const express = require('express');
const router = express.Router();
const mealsController = require('../../../controllers/meals_controller')

router.get('/', mealsController.index);
// router.get('/:id', mealsController.show);
// router.patch('/:id', mealsController.update);
// router.post('/', mealsController.create);
// router.delete('/:id', mealsController.destroy)

module.exports = router