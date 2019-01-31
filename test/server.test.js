
// npm run test-with-coverage

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
           response.body[8].calories.should.equal(9999);
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
       });
        done();
    });

    it('should return 404 if datatypes incorrect', done => {
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
        });
        done();
     });
  });

  describe('DELETE /api/v1/foods/1', () => {
    it('should delete a specific food', done => {
      chai.request(server)
        .delete('/api/v1/foods/1')
        .end((err, response) => {
          response.should.have.status(204);
      });
      chai.request(server)
        .get('/api/v1/foods/1')
        .end((err, response) => {
          response.should.have.status(404);
        done();
        });
    });
  });


  // -----------------MEALS TESTS-----------------------

  describe('GET /api/v1/meals', () => {
    it('should return all meals', done => {
       chai.request(server)
         .get('/api/v1/meals')
         .end((err, response) => {
           response.should.have.status(200);
           response.should.be.json;
           response.body.should.be.a('array');
           response.body.length.should.equal(4);
           response.body[0].should.have.property('name');
           response.body[0].name.should.equal('Breakfast');
           response.body[3].name.should.equal('Dinner');
           done();
         });
       });
     });
  
  
});
