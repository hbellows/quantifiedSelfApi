
exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
  .then(function () {
    var today = new Date(2010,10,10);
    return knex('meals').insert([
      { name: 'Breakfast', date: today },
      { name: 'Sanck', date: today },
      { name: 'Lunch', date: today },
      { name: 'Dinner', date: today }
    ])
    .then(() => console.log('Meals Table Seeded'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
