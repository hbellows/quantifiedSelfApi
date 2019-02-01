
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
    .then(function () {
      // Inserts seed entries
        return knex('foods').insert([
        { name: "Banana", calories: 150 },
        { name: "Bagel Bites - Four Cheese", calories: 650 },
        { name: "Chicken Burrito", calories: 800 },
        { name: "Grapes", calories: 180 },
        { name: "Blueberry Muffins",calories: 450 },
        { name: "Yogurt",calories: 550 },
        { name: "Macaroni and Cheese",calories: 950 },
        { name: "Granola Bar",calories: 200 },
        { name: "Sausage",calories: 900 }
      ])
      .then(() => console.log('Foods Table Seeded'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};