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

const update = (request, response) => {
  const food = request.body;
  let foodId = request.params.id

  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  Food.updateFood(food, foodId)
    .then(foods => {
      if (foods == 1) {
        response.status(201).json({"food": food });
      }
    })
    .catch((error) => {
      response.status(400).json({ error });
    });
};

module.exports = {
  index, show, update,
  // create
}