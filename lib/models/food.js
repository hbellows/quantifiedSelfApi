const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allFoods = () => database('foods')
  .select()

const oneFood = (foodId) => database('foods')
  .where('id', foodId).select()

const updateFood = (food, foodId) => database('foods')
  .where('id', foodId).update(food)


module.exports = {
  allFoods, oneFood, updateFood,
  // oneFood, newFood, updateFood, deleteFood
}