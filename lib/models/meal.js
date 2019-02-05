const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allMeals = () =>  database.raw(`
  SELECT meals.id, meals.name, array_to_json
  (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
  AS foods
  FROM meals
  JOIN meal_foods ON meals.id = meal_foods.meal_id
  JOIN foods ON meal_foods.food_id = foods.id
  GROUP BY meals.id`
  )

const mealFoods = (id) =>   database.raw(`
  SELECT meals.id, meals.name, array_to_json
  (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
  AS foods
  FROM meals
  JOIN meal_foods ON meals.id = meal_foods.meal_id
  JOIN foods ON meal_foods.food_id = foods.id
  WHERE meals.id = ${id}
  GROUP BY meals.id`
  )

module.exports = {
  allMeals, mealFoods,
}