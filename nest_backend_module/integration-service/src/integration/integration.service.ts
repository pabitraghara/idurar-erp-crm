import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookDto } from '../dto/webhook.dto';

// Define schema interfaces to match the main application
interface Invoice {
  _id: string;
  number: number;
  year: number;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  date: Date;
  client: {
    name: string;
    email: string;
  };
  created: Date;
  updated: Date;
  removed: boolean;
}

interface Query {
  _id: string;
  description: string;
  status: string;
  priority: string;
  client: {
    name: string;
    email: string;
  };
  created: Date;
  updated: Date;
  removed: boolean;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created: Date;
  updated: Date;
  removed: boolean;
}

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @InjectModel('Query') private readonly queryModel: Model<Query>,
    @InjectModel('Client') private readonly clientModel: Model<Client>,
  ) {}

  async getReportsSummary(startDate?: string, endDate?: string) {
    try {
      const dateFilter: any = { removed: false };

      if (startDate || endDate) {
        dateFilter.created = {};
        if (startDate) {
          dateFilter.created.$gte = new Date(startDate);
        }
        if (endDate) {
          dateFilter.created.$lte = new Date(endDate);
        }
      }

      // Get invoice statistics
      const invoiceStats = await this.invoiceModel.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' },
          },
        },
      ]);

      // Get query statistics
      const queryStats = await this.queryModel.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Get monthly invoice totals
      const monthlyInvoices = await this.invoiceModel.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$created' },
              month: { $month: '$created' },
            },
            totalAmount: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      // Get client count
      const clientCount = await this.clientModel.countDocuments({
        removed: false,
      });

      return {
        invoices: {
          byStatus: invoiceStats,
          monthly: monthlyInvoices,
          total: invoiceStats.reduce((sum, stat) => sum + stat.count, 0),
          totalRevenue: invoiceStats.reduce(
            (sum, stat) => sum + stat.totalAmount,
            0,
          ),
        },
        queries: {
          byStatus: queryStats,
          total: queryStats.reduce((sum, stat) => sum + stat.count, 0),
        },
        clients: {
          total: clientCount,
        },
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error generating reports summary', error);
      throw new BadRequestException('Failed to generate reports summary');
    }
  }

  async getInvoiceReports(page: number, limit: number, status?: string) {
    try {
      const filter: any = { removed: false };
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      const [invoices, total] = await Promise.all([
        this.invoiceModel
          .find(filter)
          .populate('client', 'name email')
          .sort({ created: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.invoiceModel.countDocuments(filter),
      ]);

      return {
        invoices: invoices.map((invoice) => ({
          id: invoice._id,
          number: invoice.number,
          year: invoice.year,
          status: invoice.status,
          paymentStatus: invoice.paymentStatus,
          total: invoice.total,
          currency: invoice.currency,
          date: invoice.date,
          client: invoice.client,
          created: invoice.created,
          updated: invoice.updated,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error fetching invoice reports', error);
      throw new BadRequestException('Failed to fetch invoice reports');
    }
  }

  async getQueryReports(page: number, limit: number, status?: string) {
    try {
      const filter: any = { removed: false };
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      const [queries, total] = await Promise.all([
        this.queryModel
          .find(filter)
          .populate('client', 'name email')
          .sort({ created: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.queryModel.countDocuments(filter),
      ]);

      return {
        queries: queries.map((query) => ({
          id: query._id,
          description: query.description,
          status: query.status,
          priority: query.priority,
          client: query.client,
          created: query.created,
          updated: query.updated,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error fetching query reports', error);
      throw new BadRequestException('Failed to fetch query reports');
    }
  }

  async processWebhook(webhookData: WebhookDto) {
    try {
      this.logger.log('Processing webhook data', {
        source: webhookData.source,
        event: webhookData.event,
        contact: webhookData.contact.name,
      });

      // Process different webhook events
      switch (webhookData.event) {
        case 'lead_created':
          return await this.handleLeadCreated(webhookData);
        case 'contact_updated':
          return await this.handleContactUpdated(webhookData);
        case 'support_request':
          return await this.handleSupportRequest(webhookData);
        default:
          this.logger.warn('Unknown webhook event', {
            event: webhookData.event,
          });
          return { message: 'Event logged successfully' };
      }
    } catch (error) {
      this.logger.error('Error processing webhook', error);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  private async handleLeadCreated(webhookData: WebhookDto) {
    const { contact } = webhookData;

    // Check if client already exists
    const existingClient = await this.clientModel.findOne({
      email: contact.email,
      removed: false,
    });

    if (existingClient) {
      this.logger.log('Client already exists', { email: contact.email });
      return { message: 'Client already exists', clientId: existingClient._id };
    }

    // Create new client
    const newClient = new this.clientModel({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      created: new Date(),
      updated: new Date(),
      removed: false,
    });

    await newClient.save();

    this.logger.log('New client created from webhook', {
      clientId: newClient._id,
      email: contact.email,
    });

    return { message: 'Client created successfully', clientId: newClient._id };
  }

  private async handleContactUpdated(webhookData: WebhookDto) {
    const { contact } = webhookData;

    const updatedClient = await this.clientModel.findOneAndUpdate(
      { email: contact.email, removed: false },
      {
        name: contact.name,
        phone: contact.phone,
        company: contact.company,
        updated: new Date(),
      },
      { new: true },
    );

    if (!updatedClient) {
      this.logger.warn('Client not found for update', { email: contact.email });
      return { message: 'Client not found' };
    }

    this.logger.log('Client updated from webhook', {
      clientId: updatedClient._id,
      email: contact.email,
    });

    return {
      message: 'Client updated successfully',
      clientId: updatedClient._id,
    };
  }

  private async handleSupportRequest(webhookData: WebhookDto) {
    const { contact, message } = webhookData;

    // Find or create client
    let client = await this.clientModel.findOne({
      email: contact.email,
      removed: false,
    });

    if (!client) {
      client = new this.clientModel({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        created: new Date(),
        updated: new Date(),
        removed: false,
      });
      await client.save();
    }

    // Create support query
    const supportQuery = new this.queryModel({
      description: message || 'Support request received via webhook',
      status: 'open',
      priority: 'medium',
      client: client._id,
      notes: [],
      created: new Date(),
      updated: new Date(),
      removed: false,
    });

    await supportQuery.save();

    this.logger.log('Support query created from webhook', {
      queryId: supportQuery._id,
      clientId: client._id,
    });

    return {
      message: 'Support query created successfully',
      queryId: supportQuery._id,
      clientId: client._id,
    };
  }
}
