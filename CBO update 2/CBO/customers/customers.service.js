const db = require('_helpers/db');
const moment = require('moment');
const faker = require('faker');

module.exports = {
  createService,
  seedCustomer,
  getChart,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getChart() {
  const data = await db.Customer.aggregate([
    // User is the model of userSchema
    {
      $group: {
        _id: { $month: '$created' }, // group by the month *number*, mongodb doesn't have a way to format date as month names
        numberofdocuments: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false, // remove _id
        month: {
          // set the field month as the month name representing the month number
          $arrayElemAt: [
            [
              '', // month number starts at 1, so the 0th element can be anything
              ...moment.monthsShort(),
            ],
            '$_id',
          ],
        },
        numberofdocuments: true, // keep the count
      },
    },
  ]);

  return data;
}
async function createService(id, params) {
  const customer = await getCustomer(id);

  (customer.meals += +params.meals),
    (customer.clothes += +params.clothes),
    (customer.gym = params.gym),
    (customer.updated = Date.now());
  await customer.save();

  return basicDetails(customer);
}
async function seedCustomer() {
  for (let index = 0; index < 1000; index++) {
    await create({
      title: faker.name.title(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      bed: faker.datatype.number(30),
      noOfDays: faker.datatype.number(30),
      created: faker.datatype.datetime(Date.now()),
    });
  }
}

async function getAll() {
  const customers = await db.Customer.find();
  return customers.map((x) => basicDetails(x));
}

async function getById(id) {
  const customer = await getCustomer(id);
  return basicDetails(customer);
}

async function create(params) {
  // validate

  const existingCustomer = await db.Customer.findOne({ bed: +params.bed });
  if (
    existingCustomer &&
    moment(existingCustomer.created)
      .add(existingCustomer.noOfDays)
      .endOf('day') >= moment().endOf('day')
  ) {
    throw 'Bed no "' + params.bed + '" is already booked';
  }

  const customer = new db.Customer(params);

  // save customer
  await customer.save();

  return basicDetails(customer);
}

async function update(id, params) {
  const customer = await getCustomer(id);

  if (params.bed && customer.bed !== params.bed) {
    const existingCustomer = await db.Customer.findOne({ bed: +params.bed });
    if (
      existingCustomer &&
      moment(existingCustomer.created)
        .add(existingCustomer.noOfDays)
        .endOf('day') >= moment().endOf('day')
    ) {
      throw 'Bed no "' + params.bed + '" is already booked';
    }
  }

  // copy params to customer and save
  Object.assign(customer, params);
  customer.updated = Date.now();
  await customer.save();

  return basicDetails(customer);
}

async function _delete(id) {
  const customer = await getCustomer(id);
  await customer.remove();
}

// helper functions

async function getCustomer(id) {
  if (!db.isValidId(id)) throw 'Customer not found';
  const customer = await db.Customer.findById(id);
  if (!customer) throw 'Customer not found';
  return customer;
}

function basicDetails(customer) {
  const {
    id,
    title,
    firstName,
    lastName,
    bed,
    noOfDays,
    created,
    updated,
    meals,
    clothes,
    gym,
  } = customer;
  return {
    id,
    title,
    firstName,
    lastName,
    bed,
    noOfDays,
    created,
    updated,
    meals,
    clothes,
    gym,
  };
}
