const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allFoods = () => database('foods')
  .select()

const oneFood = (foodId) => database('foods')
  .where('id', foodId).select()

module.exports = {
  allFoods, oneFood,
  // oneFood, newFood, updateFood, deleteFood
}