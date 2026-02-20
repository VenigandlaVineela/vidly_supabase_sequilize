 const { DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');
const { Genre } = require('./genre');

const Movie = sequelize.define(
  'Movie',
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    numberInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dailyRentalRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'movies',
    timestamps: true,
  }
);

 
Genre.hasMany(Movie, { foreignKey: 'genreId' });
Movie.belongsTo(Genre, { foreignKey: 'genreId' });

//Joi Validation 
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.number().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

module.exports = { Movie, validateMovie };
