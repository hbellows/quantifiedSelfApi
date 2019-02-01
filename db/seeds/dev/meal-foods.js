
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE meal_foods RESTART IDENTITY CASCADE')
  .then(function () {
    // Inserts seed entries
    return knex('meal_foods').insert([
      {
        meal_id: 1,
        food_id: 1,
      },
      {
        meal_id: 1,
        food_id: 5,
      },
      {
        meal_id: 1,
        food_id: 9,
      },
      {
        meal_id: 2,
        food_id: 4,
      },
      {
        meal_id: 2,
        food_id: 6,
      },
      {
        meal_id: 3,
        food_id: 3,
      },
      {
        meal_id: 3,
        food_id: 8,
      },
      {
        meal_id: 4,
        food_id: 2,
      },
      {
        meal_id: 4,
        food_id: 7,
      },
    ], 'id')
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
