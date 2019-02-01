const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

module.exports = class Meals{

  static allMeals() {
    return database.raw(
      'SELECT m.id, m.name, json_agg((SELECT row_to_json(x.*) FROM (SELECT f.id, f.name, f.calories) x)) AS foods FROM meals m LEFT OUTER JOIN meal_foods mf ON mf.meal = m.id LEFT OUTER JOIN foods f ON f.id = mf.food GROUP BY m.id'
    )
  }
}