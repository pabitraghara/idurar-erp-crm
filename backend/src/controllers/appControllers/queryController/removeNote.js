const removeNote = async (Model, req, res) => {
  try {
    const { id, noteId } = req.params;

    // Find the query
    const query = await Model.findOne({ _id: id, removed: false });
    if (!query) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Query not found',
      });
    }

    // Find the note
    const note = query.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Note not found',
      });
    }

    // Remove the note
    note.remove();

    // Save the query
    await query.save();

    // Return the updated query
    const updatedQuery = await Model.findById(id);

    return res.status(200).json({
      success: true,
      result: updatedQuery,
      message: 'Note removed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error: ' + error.message,
    });
  }
};

module.exports = removeNote;
