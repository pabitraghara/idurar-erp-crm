const addNote = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Note content is required',
      });
    }

    // Find the query
    const query = await Model.findOne({ _id: id, removed: false });
    if (!query) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Query not found',
      });
    }

    // Add note
    query.notes.push({
      content: content.trim(),
      createdBy: req.admin._id,
    });

    // Save the query
    await query.save();

    // Return the updated query
    const updatedQuery = await Model.findById(id);

    return res.status(200).json({
      success: true,
      result: updatedQuery,
      message: 'Note added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error: ' + error.message,
    });
  }
};

module.exports = addNote;
