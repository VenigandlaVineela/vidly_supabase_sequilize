const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const { User, generateAuthToken } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) return res.status(400).send('Invalid email ');

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!validPassword)
    return res.status(400).send('Invalid password');

  //  Use model method
  const token = generateAuthToken(user);

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(req);
}

module.exports = router;
