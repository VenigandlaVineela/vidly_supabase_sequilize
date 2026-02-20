const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middleware/async');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

const { sequelize } = require('../startup/db');


// GET all rentals
router.get('/', asyncMiddleware(async (req, res) => {
  const rentals = await Rental.findAll({
    include: [
      { model: Customer },
      { model: Movie }
    ],
    order: [['dateOut', 'DESC']],
  });

  res.send(rentals);
})
);




// // CREATE rental
// router.post('/', async (req, res) => {
//   const { error } = validateRental(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const customer = await Customer.findByPk(req.body.customerId);
//   if (!customer) return res.status(400).send('Invalid customer');

//   const movie = await Movie.findByPk(req.body.movieId);
//   if (!movie) return res.status(400).send('Invalid movie');

//   if (movie.numberInStock === 0)
//     return res.status(400).send('Movie not in stock');

//   const rental = await Rental.create({
//     customerId: customer.id,
//     movieId: movie.id,
//   });

//   await movie.decrement('numberInStock');

//   res.send(rental);
// });




 
router.post('/', asyncMiddleware(async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByPk(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findByPk(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock');

  const t = await sequelize.transaction();

  try {
    const rental = await Rental.create(
      {
        customerId: customer.id,
        movieId: movie.id,
      },
      { transaction: t }
    );

    await movie.decrement('numberInStock', { transaction: t });

    await t.commit();
    res.send(rental);

  } catch (err) {
    await t.rollback();
    throw err;  
  }
})
);







// GET rental by id
router.get('/:id', async (req, res) => {
  const rental = await Rental.findByPk(req.params.id, {
    include: [
      { model: Customer },
      { model: Movie }
    ],
  });

  if (!rental) return res.status(404).send('Rental not found');

  res.send(rental);
});

module.exports = router;
