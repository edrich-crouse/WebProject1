const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const customersService = require('./customers.service');

// routes

router.get('/seed', seedCustomer);
router.get('/chart', getChart);
router.get('/', authorize([Role.Admin, Role.User]), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize([Role.Admin, Role.User]), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.post(
  '/:id/add-service',
  authorize([Role.Admin, Role.User]),
  createService
);

module.exports = router;

function createService(req, res, next) {
  customersService
    .createService(req.params.id, req.body)
    .then((data) => res.json({ message: 'Service added successfully' }))
    .catch(next);
}

function seedCustomer(req, res, next) {
  customersService
    .seedCustomer()
    .then((data) => res.json('Customers are seeded'))
    .catch(next);
}

function getChart(req, res, next) {
  customersService
    .getChart()
    .then((data) => res.json(data))
    .catch(next);
}

function getAll(req, res, next) {
  customersService
    .getAll()
    .then((accounts) => res.json(accounts))
    .catch(next);
}

function getById(req, res, next) {
  // users can get their own customer and admins can get any customer
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  customersService
    .getById(req.params.id)
    .then((customer) => (customer ? res.json(customer) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    bed: Joi.number().less(30).greater(0),
    noOfDays: Joi.number().greater(0),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  customersService
    .create(req.body)
    .then((customer) => res.json(customer))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    title: Joi.string().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    bed: Joi.number().less(30).greater(0),
    noOfDays: Joi.number().greater(0),
  };

  // only admins can update role
  if (req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
  }

  const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own customer and admins can update any customer
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  customersService
    .update(req.params.id, req.body)
    .then((customer) => res.json(customer))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own customer and admins can delete any customer
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  customersService
    .delete(req.params.id)
    .then(() => res.json({ message: 'Customer deleted successfully' }))
    .catch(next);
}
