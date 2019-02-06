const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allFoods = () => database('foods')
  .select()

const oneFood = (foodId) => database('foods')
  .where('id', foodId).select()

const editFood = (food, foodId) => database('foods')
  .where('id', foodId).update(food)

const findNewFood = (food) =>  database('foods')
  .where('name', food.name)
  .count()

const newFood = (food) => database('foods')
  .insert(food, 'id')

const removeFood = (foodId) => database('foods')
  .where('id', foodId).del()


module.exports = {
  allFoods, oneFood, editFood, removeFood, findNewFood, newFood,
}