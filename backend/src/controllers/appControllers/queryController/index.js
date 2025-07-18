const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');
const addNote = require('./addNote');
const removeNote = require('./removeNote');
const generateAISummary = require('./generateAISummary');

function modelController() {
  const Model = mongoose.model('Query');
  const methods = createCRUDController('Query');

  // Add custom methods
  methods.summary = (req, res) => summary(Model, req, res);
  methods.addNote = (req, res) => addNote(Model, req, res);
  methods.removeNote = (req, res) => removeNote(Model, req, res);
  methods.generateAISummary = (req, res) => generateAISummary(Model, req, res);

  return methods;
}

module.exports = modelController();
