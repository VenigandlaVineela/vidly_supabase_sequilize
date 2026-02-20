const { DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');

const Genre = sequelize.define(
  'Genre',
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'genres',
    timestamps: true,
  }
);

// Joi validation
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}

module.exports = { Genre, validateGenre };
