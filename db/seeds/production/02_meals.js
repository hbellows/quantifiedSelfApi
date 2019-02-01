
exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
  .then(function () {
    return knex('meals').insert([
      { name: 'Breakfast' },
      { name: 'Sanck' },
      { name: 'Lunch' },
      { name: 'Dinner' }
    ])
    .then(() => console.log('Meals Table Seeded'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
