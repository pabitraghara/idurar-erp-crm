const create = async (Model, req, res) => {
  // Creating a new document in the collection
  req.body.removed = false;

  // Add current user ID to createdBy field if it exists in the model
  if (req.admin && req.admin.id) {
    req.body.createdBy = req.admin.id;
  }

  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
