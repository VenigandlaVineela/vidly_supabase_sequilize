const request = require('supertest');
const { start } = require('../../index');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { Customer } = require('../../models/customer');
const { generateAuthToken } = require('../../models/user');
const { sequelize } = require('../../startup/db');

let server;

describe('/api/returns', () => {

  let rental;
  let movie;
  let customer;
  let token;

  beforeAll(async () => {
    server = await start();
    await sequelize.sync({ force: true }); // Create tables once
  });

  afterAll(async () => {
    await sequelize.close();
    await server.close();
  });

  beforeEach(async () => {
    // Clear test data without dropping tables
    await Rental.destroy({ where: {} });
    await Movie.destroy({ where: {} });
    await Customer.destroy({ where: {} });

    customer = await Customer.create({
      name: 'cust1',
      phone: '12345',
      isGold: false
    });

    movie = await Movie.create({
      title: 'movie1',
      numberInStock: 10,
      dailyRentalRate: 2,
      genreId: null
    });

    rental = await Rental.create({
      customerId: customer.id,
      movieId: movie.id
    });

    token = generateAuthToken({ id: 1, isAdmin: false });
  });

  const exec = () =>
    request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ rentalId: rental.id });

  it('401 if not logged in', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('400 if rentalId missing', async () => {
    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({});
    expect(res.status).toBe(400);
  });

  it('404 if rental not found', async () => {
    const nonExistingId = 99999;
    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ rentalId: nonExistingId });
    expect(res.status).toBe(404);
  });

  it('400 if already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('200 if valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

});
