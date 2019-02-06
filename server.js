const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';

const foods = require('./lib/routes/api/v1/foods')
const meals = require('./lib/routes/api/v1/meals')

// CORS Configuration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API');
});

// API

app.use('/api/v1/foods', foods)
app.use('/api/v1/meals', meals)



app.post('/api/v1/meals/:meal_id/foods/:id', (request, response) => {
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
});

app.delete('/api/v1/meals/:meal_id/foods/:id', (request,response) => {
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
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app
