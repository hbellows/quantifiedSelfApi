const Meal = require('../models/meal')

const index = (request, response) => {
  Meal.allMeals()
    .then((meals) => {
      response.status(200).json(meals.rows)
    })
    .catch((error) => {
      response.sendStatus(404).json({ error })
    })
}

module.exports = {
  index, 
}