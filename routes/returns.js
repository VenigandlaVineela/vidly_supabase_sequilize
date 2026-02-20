const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');

function validateReturn(body) {
  const schema = Joi.object({
    rentalId: Joi.number().integer().required(),
  });

  return schema.validate(body);
}


router.post('/',auth, asyncMiddleware(async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByPk(req.body.rentalId, {
    include: [{ model: Movie }],
  });

  if (!rental) return res.status(404).send('Rental not found');
  if (rental.dateReturned)
    return res.status(400).send('Return already processed');

  rental.dateReturned = new Date();

  const days =
    Math.ceil(
      (rental.dateReturned - rental.dateOut) / (1000 * 60 * 60 * 24)
    ) || 1;

  rental.rentalFee = days * rental.Movie.dailyRentalRate;

  await rental.save();
  await rental.Movie.increment('numberInStock');

  res.send(rental);
})
);

module.exports = router;
