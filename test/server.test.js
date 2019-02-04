
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.equal('Welcome to the Quantified Self API');
      done();
    });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('GET /api/v1/foods', () => {
    it('should return all foods', done => {
       chai.request(server)
         .get('/api/v1/foods')
         .end((err, response) => {
           response.should.have.status(200);
           response.should.be.json;
           response.body.should.be.a('array');
           response.body.length.should.equal(9);
           response.body[0].should.have.property('name');
           response.body[0].should.have.property('calories');
           response.body[0].name.should.equal('Banana');
           response.body[0].calories.should.equal(150);
           response.body[8].name.should.equal('Sausage');
           response.body[8].calories.should.equal(900);
           done();
         });
       });
     });

  describe('GET /api/v1/foods/:id', () => {
    it('should return requested food', done => {
       chai.request(server)
         .get('/api/v1/foods/1')
         .end((err, response) => {
           response.should.have.status(200);
           response.should.be.json;
           response.body.should.be.a('array');
           response.body.length.should.equal(1);
           response.body[0].should.have.property('name');
           response.body[0].should.have.property('calories');
           response.body[0].name.should.equal('Banana');
           response.body[0].calories.should.equal(150);
           done();
         });
       });

    it('should return an error if the requested food is not found', done => {
      chai.request(server)
      .get('/api/v1/foods/100')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('PATCH /api/v1/foods/1', () => {
    it('should update an existing food', done => {
      chai.request(server)
       .patch('/api/v1/foods/1')
       .send({
         name: "Grapes",
         calories: 250
       })
       .end((err, response) => {
         response.should.have.status(201);
         response.should.be.json;
         response.body.should.be.a('object');
         response.body.should.have.property('food');
         response.body.food.name.should.equal('Grapes');
         response.body.food.calories.should.equal(250);
        })
        done();
      })

    it('should return 400 if datatypes incorrect', done => {
      chai.request(server)
       .patch('/api/v1/foods/10')
       .send({
         name: "Grapes",
         calories: 250
       })
        .end((err, response) => {
          response.should.have.status(400);
        });
        done();
     });

    it('should return 422 if patch does not include all attributes', done => {
     chai.request(server)
       .patch('/api/v1/foods/1')
       .send({
         name: "Grapes"
       })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { name: <String>, calories: <String> }. You\'re missing a "calories" property.')
          done();
        });
     });
  });

  describe("CREATE /api/v1/foods", () => {
    it('should create a new food', done => {
      chai.request(server)
      // Notice the change in the verb
        .post('/api/v1/foods')
        // Here is the information sent in the body or the request
        .send({
          name: 'NewFood',
          calories: 200
        })
        .end((err, response) => {
          // Different status here
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          done();
        });
    });
    it('should not duplicate foods', done => {
      chai.request(server)
        .post('/api/v1/foods')
        .send({
          name: 'Banana',
          calories: 200
        }).end((err, response) => {
          response.should.have.status(409);
          response.body.error.should.equal('Duplicate entries are not permitted.')
          done();
        });
    });
  });


    describe('DELETE /api/v1/foods/1', () => {
      it('should delete a specific food', done => {
        let id = 1
        chai.request(server)
          .delete(`/api/v1/foods/${id}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.message.should.equal(`Successfully deleted food with id ${id}`);
            chai.request(server)
            .get('/api/v1/foods/1')
            .end((err, response) => {
              response.should.have.status(404);
            });
            done();
          });
        });

    it('should return a 500 if the food is not found', done => {
      chai.request(server)
        .delete('/api/v1/foods/102')
        .end((error, response) => {
          should.not.exist(error)
          response.should.have.status(500)
          done();
        });
      });
  });


  // -----------------MEALS TESTS-----------------------

  describe('GET /api/v1/meals', () => {
    it('should return all meals', done => {
      chai.request(server)
        .get('/api/v1/meals')
        .end((error, response) => {
          should.not.exist(error)
          response.should.be.json
          response.should.have.status(200)
          response.body.should.be.an('array')
          response.body.length.should.equal(4)
          response.body[0].should.have.property('id')
          response.body[0].id.should.equal(1)
          response.body[0].should.have.property('name')
          response.body[0].name.should.equal('Breakfast')
          response.body[0].should.have.property('foods')
          response.body[0].foods.should.be.an('array')
          response.body[0].foods[0].should.have.property('id')
          response.body[0].foods[0].id.should.equal(1)
          response.body[0].foods[0].should.have.property('name')
          response.body[0].foods[0].name.should.equal('Banana')
          response.body[0].foods[0].should.have.property('calories')
          response.body[0].foods[0].calories.should.equal(150)
          done();
        });
      });
  });
  
  describe('GET /api/v1/meals/:meal_id/foods', () => {
    it('should return all foods associated with a meal', done => {
      chai.request(server)
      .get('/api/v1/meals/1/foods')
      .end((error, response) => {
        should.not.exist(error)
        response.should.be.json
        response.should.be.have.status(200)
        response.body.should.be.an('object')
        response.body.should.have.property('id')
        response.body.id.should.equal(1)
        response.body.foods.length.should.equal(3)
        response.body.foods[0].should.have.property('name')
        response.body.foods[0].name.should.equal('Banana')
        response.body.foods[0].should.have.property('calories')
        response.body.foods[0].calories.should.equal(150)
        done();
      });
    });
    
    it('should return 404 if meal id does not exist', done => {
      let meal_id = 5
      chai.request(server)
      .get(`/api/v1/meals/${meal_id}/foods`)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.error.should.equal(`Could not find meal with id ${meal_id}`);
        done()
      });
    });
  })

  describe('POST /api/v1/meals/:meal_id/foods/:id', () => {
    let meal = 'Dinner'
    let food = 'Taquitos'
    it('should add a food to a meal', done => {
      chai.request(server)
      .post(`/api/v1/foods`)
      .send ({
        name: 'Taquitos',
        calories: 500
      })
      .end((err, response) => {
        response.should.have.status(201)
        response.body.id.should.equal(10)
      });

      chai.request(server)
      .post(`/api/v1/meals/4/foods/10`)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.message.should.equal(`Successfully added ${food} to ${meal}.`)
        done()
      });
    });

    it('should return 400 if meal can\'t be found', done => {
      chai.request(server)
      .post(`/api/v1/meals/5/foods/10`)
      .end((err, response) => {
        response.should.have.status(400)
        done()
      })
    });

    it('should return 400 if food can\'t be found', done => {
      chai.request(server)
      .post(`/api/v1/meals/4/foods/100`)
      .end((err, response) => {
        response.should.have.status(400)
        done()
      })
    });
  });
  
});

