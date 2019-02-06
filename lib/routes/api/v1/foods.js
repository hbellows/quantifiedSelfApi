const express = require('express');
const router = express.Router();
const foodsController = require('../../../controllers/foodsController')

router.get('/', foodsController.index);
router.get('/:id', foodsController.show);
router.patch('/:id', foodsController.update);
router.post('/', foodsController.create);
router.delete('/:id', foodsController.destroy)

module.exports = router