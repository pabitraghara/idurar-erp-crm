# Idurar ERP/CRM Backend

This is the backend service for the Idurar ERP/CRM system. It is built with Node.js, Express, and MongoDB, and provides RESTful APIs for managing invoices, clients, payments, and more. The backend also supports AI-powered features using Google Gemini and OpenAI APIs.

## Features

- Invoice, client, payment, quote, and tax management
- User authentication and admin management
- File uploads and PDF generation
- AI-powered note summarization (Google Gemini/OpenAI)

## Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB database

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory with the following variables:

   ```env
   DATABASE=your_mongodb_connection_string
   PORT=8888
   # AI Integration (optional)
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

3. **Run the backend server:**
   ```bash
   npm run dev
   ```
   The server will start on the port specified in your `.env` file (default: 8888).

## AI Integration

- The backend supports AI-powered note summarization for invoices and queries.
- To enable, set `GEMINI_API_KEY` (Google Gemini) and/or `OPENAI_API_KEY` in your `.env` file.
- If the keys are missing or invalid, AI features will be disabled.

## Project Structure

```
backend/
  src/
    controllers/      # API controllers
    models/           # Mongoose models
    routes/           # Express routes
    services/         # Business logic and AI integration
    middlewares/      # Express middlewares
    ...
  package.json
  .env
```

## Useful Commands

- `npm run dev` — Start the server with nodemon (auto-restart on changes)
- `npm start` — Start the server normally

## Notes

- Make sure MongoDB is running and accessible from your backend server.
- For AI features, ensure your API keys are valid and have sufficient quota.
- For any issues, check backend logs for error messages.

---

For more details, see the main project documentation or contact the maintainer.
