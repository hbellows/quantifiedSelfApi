
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('meal_foods', function(table) {
      table.increments('id').primary();
      table.string('foods');
      table.integer('food_id').unsigned()
      table.foreign('food_id')
        .references('foods.id');

      table.string('meals');
      table.integer('meal_id').unsigned()
      table.foreign('meal_id')
        .references('meals.id');

      table.timestamps(true, true);
    })
  ])
};
  

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('meals'),
    knex.schema.dropTable('foods'),
    knex.schema.dropTable('meal_foods'),
  ]);
}


