const { DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');
const { Customer } = require('./customer');
const { Movie } = require('./movie');

const Rental = sequelize.define(
  'Rental',
  { 
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    dateOut: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    dateReturned: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    rentalFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'rentals',
    timestamps: true,
  }
);

//  Associations
Customer.hasMany(Rental, { foreignKey: 'customerId' });
Rental.belongsTo(Customer, { foreignKey: 'customerId' });

Movie.hasMany(Rental, { foreignKey: 'movieId' });
Rental.belongsTo(Movie, { foreignKey: 'movieId' });

//  Joi validation
function validateRental(body) {
  const schema = Joi.object({
    customerId: Joi.number().integer().required(),
    movieId: Joi.number().integer().required(),
  });

  return schema.validate(body);
}

module.exports = { Rental, validateRental };
