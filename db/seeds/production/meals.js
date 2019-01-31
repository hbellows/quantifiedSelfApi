
exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY')
  .then(function () {
    return knex('meals').insert([
      {name: 'Breakfast', created_at: new Date, updated_at: new Date},
      {name: 'Sanck', created_at: new Date, updated_at: new Date},
      {name: 'Lunch', created_at: new Date, updated_at: new Date},
      {name: 'Dinner', created_at: new Date, updated_at: new Date}
    ])
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
