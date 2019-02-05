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
  // .count()
  // .then(count => {
    // console.log(count)
    // if (!(count[0]['count'] == "0")) {
    //   response.status(409).json({
    //     error: 'Duplicate entries are not permitted.'
    //   });
    // } else {
    //   database('foods').insert(food, 'id')
    //     .then(food => {
    //       response.status(201).json({ id: food[0] })
    //     })
    //     .catch(error => {
    //       response.status(500).json({ error });
    //     });
    // }
// });

const newFood = (food) => database('foods')
  .insert(food, 'id')



module.exports = {
  allFoods, oneFood, editFood, findNewFood, newFood,
  // oneFood, newFood, updateFood, deleteFood
}