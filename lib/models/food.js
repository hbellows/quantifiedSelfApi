const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const allFoods = () => database('foods')
  .select()

module.exports = {
  allFoods, 
  // oneFood, newFood, updateFood, deleteFood
}