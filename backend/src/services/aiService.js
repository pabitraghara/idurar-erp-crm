const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeAI();
  }

  initializeAI() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn(
        'GEMINI_API_KEY not found in environment variables. AI features will be disabled.'
      );
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini AI initialized successfully');
    } catch (error) {
      console.error('Error initializing Gemini AI:', error);
    }
  }

  async generateSummary(notes) {
    if (!this.model) {
      throw new Error('AI service is not initialized. Please check your GEMINI_API_KEY.');
    }

    if (!notes || notes.length === 0) {
      return 'No notes available to summarize.';
    }

    try {
      const notesText = notes.filter((note) => note && note.trim()).join('\n');

      if (!notesText.trim()) {
        return 'No meaningful notes content to summarize.';
      }

      const prompt = `Please provide a concise summary of the following invoice item notes. Focus on key details, requirements, and any important information:

${notesText}

Summary:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      return summary || 'Unable to generate summary at this time.';
    } catch (error) {
      console.error('Error generating AI summary:', error);
      throw new Error('Failed to generate AI summary. Please try again later.');
    }
  }

  async generateQuerySummary(queryData) {
    if (!this.model) {
      throw new Error('AI service is not initialized. Please check your GEMINI_API_KEY.');
    }

    try {
      const { description, status, priority, notes } = queryData;
      const notesText =
        notes && notes.length > 0
          ? notes.map((note) => note.content).join('\n')
          : 'No notes available';

      const prompt = `Please provide a professional summary of this customer query:

Query Description: ${description}
Status: ${status}
Priority: ${priority}
Notes: ${notesText}

Please provide a concise summary highlighting the key points, current status, and any important details:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      return summary || 'Unable to generate summary at this time.';
    } catch (error) {
      console.error('Error generating query AI summary:', error);
      throw new Error('Failed to generate query AI summary. Please try again later.');
    }
  }

  isAvailable() {
    return this.model !== null;
  }
}

module.exports = new AIService();
