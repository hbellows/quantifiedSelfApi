
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
    .then(function () {
      // Inserts seed entries
        return knex('foods').insert([
        {name: "Banana", calories: 150, created_at: new Date, updated_at: new Date},
        {name: "Bagel Bites - Four Cheese", calories: 650, created_at: new Date, updated_at: new Date},
        {name: "Chicken Burrito", calories: 800, created_at: new Date, updated_at: new Date},
        {name: "Grapes", calories: 180, created_at: new Date, updated_at: new Date},
        {name: "Blueberry Muffins",calories: 450, created_at: new Date, updated_at: new Date},
        {name: "Yogurt",calories: 550, created_at: new Date, updated_at: new Date},
        {name: "Macaroni and Cheese",calories: 950, created_at: new Date, updated_at: new Date},
        {name: "Granola Bar",calories: 200, created_at: new Date, updated_at: new Date},
        {name: "Sausage",calories: 9999, created_at: new Date, updated_at: new Date}
      ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};