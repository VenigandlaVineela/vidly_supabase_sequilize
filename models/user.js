const { DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

// JWT generator
function generateAuthToken(user) {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
config.get('jwtPrivateKey')  
  );
}

// Joi validation
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    isAdmin: Joi.boolean().required()
  });
  return schema.validate(user);
}

module.exports = { User, validateUser, generateAuthToken };
