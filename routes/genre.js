const express = require('express');
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// GET all genres
router.get('/', async (req, res) => {
  const genres = await Genre.findAll();
  res.send(genres);
});

// GET genre by id
router.get('/:id', async (req, res) => {
  const genre = await Genre.findByPk(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');

  res.send(genre);
});

// CREATE genre (protected)
// router.post('/', [auth,admin], async (req, res) => {
//   const { error } = validateGenre(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.create({
//     name: req.body.name,
//   });

//   res.status(201).send(genre);
// });



router.post('/', auth, async (req, res, next) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Only admin can create after validation
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  const genre = await Genre.create({ name: req.body.name });
  res.status(201).send(genre);
});





// UPDATE genre
router.put('/:id', auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByPk(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');

  genre.name = req.body.name;
  await genre.save();

  res.send(genre);
});

// DELETE genre
router.delete('/:id', auth, async (req, res) => {
  const genre = await Genre.findByPk(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');

  await genre.destroy();
  res.send(genre);
});

module.exports = router;  