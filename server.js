const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const foods = require('./lib/routes/api/v1/foods')
const meals = require('./lib/routes/api/v1/meals')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';

// CORS Configuration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Client Routes
app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API');
});

// API Endpoints
app.use('/api/v1/foods', foods)
app.use('/api/v1/meals', meals)

// app.get('/api/v1/foods', foods)
// app.get('/api/v1/foods/:id', foods)
// app.patch('/api/v1/foods/:id', foods)
// app.post('/api/v1/foods', foods)
// app.delete('/api/v1/foods/:id', foods)
// app.post('/api/v1/foods', foods)

app.post('/api/v1/foods', (request, response) => {
  const food = request.body;

  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('foods')
    .where('name', food.name)
    .count()
    .then(count => {
      if (!(count[0]['count'] == "0")) {
        response.status(409).json({
          error: 'Duplicate entries are not permitted.'
        });
      } else {
        database('foods').insert(food, 'id')
          .then(food => {
            response.status(201).json({ id: food[0] })
          })
          .catch(error => {
            response.status(500).json({ error });
          });
      }
    });
});


app.delete('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).del()
    .then((foods) => {
      if (foods == 1) {
      response.status(200).send({ message: `Successfully deleted food with id ${request.params.id}` })
    }
    else {
        response.sendStatus(500);
      }
    })
    .catch(() => {
      response.sendStatus(404);
  })
});

// ----------------MEALS ENDPOINT------------------

app.get('/api/v1/meals', (request, response) => {
  database.raw(`
    SELECT meals.id, meals.name, meals.date, array_to_json
    (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
    AS foods
    FROM meals
    LEFT OUTER JOIN meal_foods ON meals.id = meal_foods.meal_id
    LEFT OUTER JOIN foods ON meal_foods.food_id = foods.id
    GROUP BY meals.id`)
    .then((meals) => {
      response.status(200).json(meals.rows)
    })
    .catch((error) => {
      response.sendStatus(404).json({ error })
    })
});

app.post('/api/v1/meals', (request, response) => {
  const meal = request.body

  for (let requiredParameter of ['name', 'date']) {
    if (!meal[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, date: <yyyy-mm-dd> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database.raw(`
    SELECT count(meals)
      AS count
      FROM meals
      WHERE name = '${meal.name}'
      AND meals.date = '${meal.date}'
    `)
    .then(result => {
      // var count = response[]
      console.log(result)
      console.log(result['rows'][0]['count']);
      console.log(result['rows'][0]['count'] == "0");
      if (!(result['rows'][0]['count'] == "0")) {
        response.status(409).json({
          error: 'Duplicate entries are not permitted.'
        });
      } else {
        database('meals').insert(meal, 'id')
          .then(meal => {
            response.status(201).json({ id: meal[0] })
          })
          .catch(error => {
            response.status(500).json({ error });
          });
      }
    });
});

app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  const id = request.params.meal_id
  database.raw(`
    SELECT meals.id, meals.name, array_to_json
    (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
    AS foods
    FROM meals
    JOIN meal_foods ON meals.id = meal_foods.meal_id
    JOIN foods ON meal_foods.food_id = foods.id
    WHERE meals.id = ${id}
    GROUP BY meals.id`
    )
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
});


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
