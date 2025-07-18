const mongoose = require('mongoose');

const list = async (userModel, req, res) => {
  const Model = mongoose.model(userModel);

  try {
    // Get all active admin users
    const result = await Model.find({
      removed: false,
      enabled: true,
    })
      .select('_id name surname email role')
      .sort({ created: -1 });

    // Return the list of users
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully retrieved user list',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error retrieving user list',
      error: error.message,
    });
  }
};

module.exports = list;
