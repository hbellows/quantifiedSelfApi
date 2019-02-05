const Meal = require('../models/meal')

const index = (request, response) => {
  Meal.allMeals()
    .then((meals) => {
      response.status(200).json(meals.rows)
    })
    .catch((error) => {
      response.sendStatus(404).json({ error })
    })
};

const show = (request, response) => {
  let id = request.params.meal_id
  Meal.mealFoods(id)
    .then((foods) => {
      if (foods.rows.length == 0) {
        response.status(404).send({error: `Could not find meal with id ${id}`})
      }
      else {
        response.status(200).json(foods.rows[0])
      }
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
};

module.exports = {
  index, show,
}