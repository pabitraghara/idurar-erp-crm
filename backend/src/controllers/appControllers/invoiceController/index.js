const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Invoice');

const mongoose = require('mongoose');

const sendMail = require('./sendMail');
const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const read = require('./read');
const generateNoteSummary = require('./generateNoteSummary');

// Get the Invoice model
const Invoice = mongoose.model('Invoice');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;
methods.list = paginatedList;
methods.read = read;
methods.generateNoteSummary = (req, res) => generateNoteSummary(Invoice, req, res);

module.exports = methods;
