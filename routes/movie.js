const express = require('express');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

// GET all movies 
router.get('/', asyncMiddleware(async (req, res) => {
  const movies = await Movie.findAll({
    include: {
      model: Genre,
      attributes: ['id', 'name'],
    },
    order: [['title', 'ASC']],
  });

  res.send(movies);
})
);


 //CREATE movie
router.post('/', [auth, admin],asyncMiddleware( async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByPk(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.create({
    title: req.body.title,
    genreId: genre.id,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  res.send(movie);
})
);


// UPDATE movie
router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).send('Movie not found');

  const genre = await Genre.findByPk(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  await movie.update({
    title: req.body.title,
    genreId: genre.id,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  res.send(movie);
});

// DELETE movie 
router.delete('/:id', [auth, admin], async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).send('Movie not found');

  await movie.destroy();
  res.send({ message: 'Movie deleted successfully' });
});

module.exports = router;
