const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

pry = require('pryjs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';

// CORS Configuration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API');
});

// ---------------FOODS ENDPOINT-----------------

app.get('/api/v1/foods', (request, response) => {
  database('foods').select()
  .then((foods) => {
    response.status(200).json(foods);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).select()
    .then(foods => {
      if (foods.length) {
        response.status(200).json(foods);
      } else {
        response.status(404).json({
          error: `Could not find food with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/foods/:id', (request, response) => {
  const food = request.body;

  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('foods').where('id', request.params.id).update(food)
    .then(foods => {
      if (foods == 1) {
        response.status(201).json({"food": food });
      }
    })
    .catch((error) => {
      response.status(400).json({ error });
    });
});

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
      console.log(count)
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
      response.status(200).send(`Successfully deleted food with id ${request.params.id}`)
      }
      else {
        response.sendStatus(500);
      }
    })
    .catch(error => {
      response.sendStatus(500);
  })  
});

// ----------------MEALS ENDPOINT------------------

app.get('/api/v1/meals', (request, response) => {
  database.raw(`
    SELECT meals.id, meals.name, array_to_json
    (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
    AS foods
    FROM meals
    JOIN meal_foods ON meals.id = meal_foods.meal_id
    JOIN foods ON meal_foods.food_id = foods.id
    GROUP BY meals.id`)
    .then((meals) => {
      response.status(200).json(meals.rows)
    })
    .catch((error) => {
      response.status(404).json({ error })
  })
});


app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  let id = request.params.meal_id
  database.raw(`
    SELECT meals.id, meals.name, array_to_json
    (array_agg(json_build_object('id', foods.id, 'name', foods.name, 'calories', foods.calories)))
    AS foods
    FROM meals
    JOIN meal_foods ON meals.id = meal_foods.meal_id
    JOIN foods ON meal_foods.food_id = foods.id
    WHERE meals.id = ${id}
    GROUP BY meals.id`)
    .then((foods) => {
      response.status(200).json(foods.rows[0])
    })
    .catch((error) => {
      response.status(404).json({ error })
    })
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app
