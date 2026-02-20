const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { User, validateUser, generateAuthToken } = require('../models/user');

const router = express.Router();


router.get('/me', auth, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.send(user);
});

 
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ where: { email: req.body.email } });
  if (user) return res.status(400).send('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: req.body.isAdmin
  });

  const token = generateAuthToken(user);

  res
    .header('x-auth-token', token)
    .send({
      id: user.id,
      name: user.name,
      email: user.email
    });
});

module.exports = router;
