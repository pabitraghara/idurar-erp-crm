import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { WebhookDto } from '../dto/webhook.dto';

@Controller('integration')
export class IntegrationController {
  private readonly logger = new Logger(IntegrationController.name);

  constructor(private readonly integrationService: IntegrationService) {}

  @Get('reports/summary')
  async getReportsSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      this.logger.log('Fetching reports summary', { startDate, endDate });

      const summary = await this.integrationService.getReportsSummary(
        startDate,
        endDate,
      );

      return {
        success: true,
        data: summary,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error fetching reports summary', error);
      throw error;
    }
  }

  @Get('reports/invoices')
  async getInvoiceReports(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
  ) {
    try {
      this.logger.log('Fetching invoice reports', { page, limit, status });

      const reports = await this.integrationService.getInvoiceReports(
        +page,
        +limit,
        status,
      );

      return {
        success: true,
        data: reports,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error fetching invoice reports', error);
      throw error;
    }
  }

  @Get('reports/queries')
  async getQueryReports(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
  ) {
    try {
      this.logger.log('Fetching query reports', { page, limit, status });

      const reports = await this.integrationService.getQueryReports(
        +page,
        +limit,
        status,
      );

      return {
        success: true,
        data: reports,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error fetching query reports', error);
      throw error;
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body(new ValidationPipe({ transform: true })) webhookData: WebhookDto,
  ) {
    try {
      this.logger.log('Processing webhook', {
        source: webhookData.source,
        event: webhookData.event,
      });

      const result = await this.integrationService.processWebhook(webhookData);

      return {
        success: true,
        message: 'Webhook processed successfully',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error processing webhook', error);
      throw error;
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'integration-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
