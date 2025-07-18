const aiService = require('@/services/aiService');

const generateNoteSummary = async (Model, req, res) => {
  try {
    const { id } = req.params;

    // Find the invoice
    const invoice = await Model.findOne({ _id: id, removed: false });
    if (!invoice) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Invoice not found',
      });
    }

    // Check if AI service is available
    console.log('AI service available:', aiService.isAvailable());
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        result: null,
        message: 'AI service is not available. Please check server configuration.',
      });
    }

    // Extract notes from invoice items
    const notes = invoice.items
      .map((item) => item.notes)
      .filter((note) => note && note.trim())
      .filter((note) => note.length > 0);

    // Handle empty notes case
    if (notes.length === 0) {
      return res.status(200).json({
        success: true,
        result: {
          summary: 'No notes available to summarize.',
          notesCount: 0,
        },
        message: 'No notes found in invoice items',
      });
    }

    // Generate AI summary
    const summary = await aiService.generateSummary(notes);

    // Update the invoice with AI summary (optional - store in notes field)
    invoice.notes = invoice.notes
      ? `${invoice.notes}\n\nAI Summary: ${summary}`
      : `AI Summary: ${summary}`;

    await invoice.save();

    return res.status(200).json({
      success: true,
      result: {
        summary: summary,
        notesCount: notes.length,
        originalNotes: notes,
      },
      message: 'AI summary generated successfully',
    });
  } catch (error) {
    console.error('Error generating note summary:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Internal server error while generating summary',
    });
  }
};

module.exports = generateNoteSummary;
