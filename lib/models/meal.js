const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allMeals = () => database.raw(`
  SELECT meals.id, meals.name, array_to_json
  (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
  AS foods
  FROM meals
  JOIN meal_foods ON meals.id = meal_foods.meal_id
  JOIN foods ON meal_foods.food_id = foods.id
  GROUP BY meals.id`
  )

const mealFoods = (id) => database.raw(`
  SELECT meals.id, meals.name, array_to_json
  (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
  AS foods
  FROM meals
  JOIN meal_foods ON meals.id = meal_foods.meal_id
  JOIN foods ON meal_foods.food_id = foods.id
  WHERE meals.id = ${id}
  GROUP BY meals.id`
  )

// const findMeal = (mealId, FoodId) => database('meals').where('id', mealId).first()
//   .then(meal => {
//     targetMeal = meal
//     return database('foods').where('id', foodId).first()
//   })
//   .then(food => {
//     targetFood = food
//   })
//   .then(() => {
//     if (targetMeal && targetFood) {
//       return database('meal_foods').insert([{ food_id: foodId, meal_id: mealId }], 'id')
//     }
//   })
//   .then(() => {
//     response.status(201).json({ message: `Successfully added ${targetFood.name} to ${targetMeal.name}.` })
//   })
//   .catch((error) => {
//     response.status(400).json({ error })
//   })
// });


module.exports = {
  allMeals, mealFoods, 
  // newMealFood
}