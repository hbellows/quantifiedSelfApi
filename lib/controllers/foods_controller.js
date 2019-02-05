const Food = require('../models/food')

const index = (request, response) => {
  Food.allFoods()
  .then((foods) => {
    response.status(200).json(foods);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}

const show = (request, response) => {
  let foodId = request.params.id
  Food.oneFood(foodId)
  .then(foods => {
    if (foods.length) {
      response.status(200).json(foods);
    } else {
      response.status(404).json({
        error: `Could not find food with id ${request.params.id}`
      });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
};

module.exports = {
  index, show,
  // create
}