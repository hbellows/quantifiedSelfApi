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
  Food.editFood(food, foodId)
    .then(foods => {
      if (foods == 1) {
        response.status(201).json({"food": food });
      }
    })
    .catch((error) => {
      response.status(400).json({ error });
    });
};

const create = (request, response) => {
  const food = request.body;

  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  Food.findNewFood(food)
    .then(count => {
      // console.log(count)
      if (!(count[0]['count'] == "0")) {
        response.status(409).json({
          error: 'Duplicate entries are not permitted.'
        });
      } else {
        Food.newFood(food)
          .then(food => {
            response.status(201).json({ id: food[0] })
          })
          .catch(error => {
            response.status(500).json({ error });
          });
      }
  });
};

const destroy = (request, response) => {
  let foodId = request.params.id

  Food.removeFood(foodId)
    .then((foods) => {
      if (foods == 1) {
      response.status(200).send({ message: `Successfully deleted food with id ${request.params.id}` })
    }
    else {
        response.sendStatus(500);
      }
    })
    .catch(() => {
      response.sendStatus(404);
  }) 
}

module.exports = {
  index, show, update, create, destroy,
}