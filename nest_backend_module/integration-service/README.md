# Integration Service - Nest.js Backend Module

This is a separate Nest.js TypeScript API service that provides advanced reporting and integration endpoints for the IDURAR ERP-CRM system.

## Features

- **Advanced Reporting**: Aggregated data endpoints for business intelligence
- **Webhook Processing**: External system integration via webhooks
- **MongoDB Integration**: Direct connection to the main ERP database
- **TypeScript**: Full type safety and modern development experience
- **Validation**: Request validation using class-validator
- **Docker Support**: Multi-stage builds for production deployment
- **Health Checks**: Built-in health monitoring

## API Endpoints

### Reporting Endpoints

- `GET /api/integration/reports/summary` - Get comprehensive business summary
  - Query params: `startDate`, `endDate` (optional)
  - Returns: Invoice stats, query stats, client counts, monthly data

- `GET /api/integration/reports/invoices` - Get detailed invoice reports
  - Query params: `page`, `limit`, `status` (optional)
  - Returns: Paginated invoice data with client information

- `GET /api/integration/reports/queries` - Get query/ticket reports
  - Query params: `page`, `limit`, `status` (optional)
  - Returns: Paginated query data with client information

### Integration Endpoints

- `POST /api/integration/webhook` - Process external webhooks
  - Supports: `lead_created`, `contact_updated`, `support_request` events
  - Automatically creates/updates clients and queries

### Health Endpoints

- `GET /api/integration/health` - Service health check
  - Returns: Service status, uptime, timestamp

## Installation

### Prerequisites

- Node.js 18+
- MongoDB connection (shared with main ERP system)
- Docker (optional, for containerized deployment)

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:

```bash
npm run start:dev
```

The service will be available at `http://localhost:3001`

### Production Deployment

#### Using Docker

1. Build the Docker image:

```bash
docker build -t integration-service .
```

2. Run the container:

```bash
docker run -p 3001:3001 --env-file .env integration-service
```

#### Using Docker Compose

```bash
docker-compose up --build
```

## Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `SERVICE_NAME`: Service identifier
- `SERVICE_VERSION`: Service version

## API Usage Examples

### Get Business Summary

```bash
curl -X GET "http://localhost:3001/api/integration/reports/summary?startDate=2024-01-01&endDate=2024-12-31"
```

### Get Invoice Reports

```bash
curl -X GET "http://localhost:3001/api/integration/reports/invoices?page=1&limit=10&status=sent"
```

### Process Webhook

```bash
curl -X POST "http://localhost:3001/api/integration/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "external_crm",
    "event": "lead_created",
    "contact": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "Example Corp"
    },
    "message": "New lead from contact form"
  }'
```

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Architecture

The service follows Nest.js modular architecture:

```
src/
├── dto/                 # Data Transfer Objects
├── integration/         # Integration module
│   ├── integration.controller.ts
│   ├── integration.service.ts
│   └── integration.module.ts
├── app.module.ts        # Main application module
└── main.ts             # Application bootstrap
```

## Database Schema

The service reads from the same MongoDB database as the main ERP system:

- `invoices` collection
- `queries` collection
- `clients` collection

## Error Handling

The service includes comprehensive error handling:

- Validation errors (400 Bad Request)
- Database connection errors
- Service unavailable errors (503)
- Detailed logging for debugging

## Performance Considerations

- MongoDB aggregation pipelines for efficient reporting
- Pagination for large datasets
- Connection pooling for database efficiency
- Caching strategies (can be extended)

## Security

- Input validation using class-validator
- CORS configuration
- Non-root Docker user
- Environment variable security

## Monitoring

- Health check endpoint
- Structured logging
- Docker health checks
- Service metrics (can be extended)

## Future Enhancements

- Redis caching layer
- Rate limiting
- API authentication
- Metrics and monitoring dashboard
- Real-time notifications
- Data export capabilities
