const generateAISummary = async (Model, req, res) => {
  try {
    const { id } = req.params;

    // Find the query
    const query = await Model.findOne({ _id: id, removed: false });
    if (!query) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Query not found',
      });
    }

    // Check if there are notes to summarize
    if (!query.notes || query.notes.length === 0) {
      return res.status(200).json({
        success: true,
        result: {
          summary: 'No notes available to summarize.',
        },
        message: 'No notes found',
      });
    }

    // Collect all notes content
    const notesContent = query.notes.map((note) => `${note.content}`).join('\n\n');

    // For now, create a simple summary (AI integration will be added in Phase 3)
    // This is a placeholder that simulates AI processing
    const summary =
      `Summary of ${query.notes.length} notes:\n\n` +
      `Query: ${query.description}\n` +
      `Status: ${query.status}\n` +
      `Priority: ${query.priority}\n\n` +
      `Latest notes:\n${notesContent.substring(0, 500)}${notesContent.length > 500 ? '...' : ''}`;

    // Update the query with AI summary
    query.aiSummary = summary;
    await query.save();

    return res.status(200).json({
      success: true,
      result: {
        summary: summary,
      },
      message: 'AI summary generated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error: ' + error.message,
    });
  }
};

module.exports = generateAISummary;
