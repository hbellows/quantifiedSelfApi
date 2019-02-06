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

// Client Routes
app.get('/', (request, response) => {
  response.send('Welcome to the Quantified Self API');
});


// API
app.use('/api/v1/foods', foods)
app.use('/api/v1/meals', meals)

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app
