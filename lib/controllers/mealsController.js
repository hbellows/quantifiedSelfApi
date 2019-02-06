const Meal = require('../models/meal')
const mealFood = require('../models/mealFood')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);


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
  const id = request.params.meal_id
  mealFood.allMealFoods(id)
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

const createMeal = (request, response) => {
  const meal = request.body
  
  for (let requiredParameter of ['name', 'date']) {
    if (!meal[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, date: <yyyy-mm-dd> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  Meal.findMeal(meal)
  .then(result => {
    // var count = response[]
    // console.log(result)
    // console.log(result['rows'][0]['count']);
    // console.log(result['rows'][0]['count'] == "0");
    if (!(result['rows'][0]['count'] == "0")) {
      response.status(409).json({
        error: 'Duplicate entries are not permitted.'
      });
    } else {
      Meal.newMeal(meal)
        .then(meal => {
          response.status(201).json({ id: meal[0] })
        })
        .catch(error => {
          response.status(500).json({ error });
        });
    }
  });
};

const create = (request, response) => {
  const mealId = request.params.meal_id
  const foodId = request.params.id

  let targetMeal
  let targetFood

  database('meals').where('id', mealId).first()
    .then(meal => {
      targetMeal = meal
      return database('foods').where('id', foodId).first()
    })
    .then(food => {
      targetFood = food
    })
    .then(() => {
      if (targetMeal && targetFood) {
        return database('meal_foods').insert([{ food_id: foodId, meal_id: mealId }], 'id')
      }
    })
    .then(() => {
      response.status(201).json({ message: `Successfully added ${targetFood.name} to ${targetMeal.name}.` })
    })
    .catch((error) => {
      response.status(400).json({ error })
    })
}; 

const destroy = (request, respone) => {
  const mealId = request.params.meal_id
  const foodId = request.params.id

  let targetMeal
  let targetFood

  database('meals').where('id', mealId).first()
    .then(meal => {
      targetMeal = meal
      return database('foods').where('id', foodId).first()
    })
    .then(food => {
      targetFood = food
    })
    .then(() => {
      if (targetMeal && targetFood) {
        return database('meal_foods').where('meal_foods.meal_id', mealId).where('meal_foods.food_id', foodId).del()
      }
    })
    .then(() => {
      response.status(200).json({ message: `Successfully removed ${targetFood.name} from ${targetMeal.name}.` })
    })
    .catch((error) => {
      response.status(400).json({ error })
    })
};



module.exports = {
  show, index, createMeal, create, destroy
}