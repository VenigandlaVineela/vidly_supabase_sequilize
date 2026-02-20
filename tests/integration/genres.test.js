const request = require('supertest');
const { start } = require('../../index');
const { Genre } = require('../../models/genre');
const { generateAuthToken } = require('../../models/user');
const { sequelize } = require('../../startup/db');

jest.setTimeout(20000);

let server;

describe('app/genres (Sequelize)', () => {

  beforeAll(async () => {
    server = await start();
    await sequelize.sync({ force: true }); // Ensures tables exist
  });

  afterAll(async () => {
    await sequelize.close();
    await server.close();
  });

  beforeEach(async () => {
    // Delete all genres without truncate to avoid FK issues
    await Genre.destroy({ where: {} });
  });

  // ================= GET ALL =================
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.bulkCreate([{ name: 'genre1' }, { name: 'genre2' }]);

      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  // ================= GET BY ID =================
  describe('GET /:id', () => {
    it('should return genre if valid id', async () => {
      const genre = await Genre.create({ name: 'genre1' });
      const res = await request(server).get('/api/genres/' + genre.id);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('genre1');
    });

    it('should return 404 if not found', async () => {
      const res = await request(server).get('/api/genres/99999');
      expect(res.status).toBe(404);
    });
  });

  // ================= POST =================
  describe('POST /', () => {
    let token;
    let name;

    const exec = () => request(server).post('/api/genres')
      .set('x-auth-token', token)
      .send({ name });

    beforeEach(() => {
      token = generateAuthToken({ id: 1, isAdmin: true });
      name = 'genre1';
    });

    it('401 if not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('400 if name < 5', async () => {
      name = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save genre if valid', async () => {
      await exec();
      const genre = await Genre.findOne({ where: { name } });
      expect(genre).not.toBeNull();
    });
  });

  // ================= PUT =================
  describe('PUT /:id', () => {
    let token;
    let genre;
    let id;

    const exec = () => request(server)
      .put('/api/genres/' + id)
      .set('x-auth-token', token)
      .send({ name: 'updatedName' });

    beforeEach(async () => {
      genre = await Genre.create({ name: 'genre1' });
      id = genre.id;
      token = generateAuthToken({ id: 1, isAdmin: true });
    });

    it('should update genre', async () => {
      await exec();
      const updated = await Genre.findByPk(id);
      expect(updated.name).toBe('updatedName');
    });
  });

  // ================= DELETE =================
  describe('DELETE /:id', () => {
    let token;
    let genre;
    let id;

    const exec = () => request(server)
      .delete('/api/genres/' + id)
      .set('x-auth-token', token);

    beforeEach(async () => {
      genre = await Genre.create({ name: 'genre1' });
      id = genre.id;
      token = generateAuthToken({ id: 1, isAdmin: true });
    });

    it('should delete genre', async () => {
      await exec();
      const found = await Genre.findByPk(id);
      expect(found).toBeNull();
    });
  });
});
