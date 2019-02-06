const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allMeals = () => database.raw(`
  SELECT meals.id, meals.name, meals.date, array_to_json
  (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
  AS foods
  FROM meals
  LEFT OUTER JOIN meal_foods ON meals.id = meal_foods.meal_id
  LEFT OUTER JOIN foods ON meal_foods.food_id = foods.id
  GROUP BY meals.id`)

const findMeal = (meal) => database.raw(`
  SELECT count(meals)
  AS count
  FROM meals
  WHERE name = '${meal.name}'
  AND meals.date = '${meal.date}'`)

const newMeal = (meal) => database('meals')
  .insert(meal, 'id')
 
module.exports = {
  allMeals, findMeal, newMeal
}
