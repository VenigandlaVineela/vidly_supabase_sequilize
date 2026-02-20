const { DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');

const Customer = sequelize.define(
     'Customer',
     {
          name: {
               type: DataTypes.STRING(50),
               allowNull: false,
          },

          isGold: {
               type: DataTypes.BOOLEAN,
               defaultValue: false,
          },

          phone: {
               type: DataTypes.STRING(50),
               allowNull: false,
          },
     },
     {
          tableName: 'customers',
          timestamps: true,
     }
);

/* Joi validation */
function validateCustomer(customer) {
     const schema = Joi.object({
          name: Joi.string().min(5).max(50).required(),
          phone: Joi.string().min(5).max(50).required(),
          isGold: Joi.boolean(),
     });

     return schema.validate(customer);
}

module.exports = { Customer, validateCustomer };
