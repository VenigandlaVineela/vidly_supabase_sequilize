const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');

const router = express.Router();

/* GET all customers */
router.get('/', async (req, res) => {
  const customers = await Customer.findAll({
    order: [['name', 'ASC']],
  });

  res.send(customers);
});



// GET customer by ID 
router.get('/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);

  if (!customer)
    return res.status(404).send('Customer not found');

  res.send(customer);
});


// CREATE customer 
router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.create({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  res.send(customer);
});

//UPDATE customer  
router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByPk(req.params.id);
  if (!customer)
    return res.status(404).send('Customer not found');

  await customer.update({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  res.send(customer);
});

// DELETE customer 
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);

  if (!customer)
    return res.status(404).send('Customer not found');

  await customer.destroy();
   res.send({ message: 'Customer deleted successfully' });
});

 
 

module.exports = router;
