"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let IntegrationService = IntegrationService_1 = class IntegrationService {
    invoiceModel;
    queryModel;
    clientModel;
    logger = new common_1.Logger(IntegrationService_1.name);
    constructor(invoiceModel, queryModel, clientModel) {
        this.invoiceModel = invoiceModel;
        this.queryModel = queryModel;
        this.clientModel = clientModel;
    }
    async getReportsSummary(startDate, endDate) {
        try {
            const dateFilter = { removed: false };
            if (startDate || endDate) {
                dateFilter.created = {};
                if (startDate) {
                    dateFilter.created.$gte = new Date(startDate);
                }
                if (endDate) {
                    dateFilter.created.$lte = new Date(endDate);
                }
            }
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
            const queryStats = await this.queryModel.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]);
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
            const clientCount = await this.clientModel.countDocuments({
                removed: false,
            });
            return {
                invoices: {
                    byStatus: invoiceStats,
                    monthly: monthlyInvoices,
                    total: invoiceStats.reduce((sum, stat) => sum + stat.count, 0),
                    totalRevenue: invoiceStats.reduce((sum, stat) => sum + stat.totalAmount, 0),
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
        }
        catch (error) {
            this.logger.error('Error generating reports summary', error);
            throw new common_1.BadRequestException('Failed to generate reports summary');
        }
    }
    async getInvoiceReports(page, limit, status) {
        try {
            const filter = { removed: false };
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
        }
        catch (error) {
            this.logger.error('Error fetching invoice reports', error);
            throw new common_1.BadRequestException('Failed to fetch invoice reports');
        }
    }
    async getQueryReports(page, limit, status) {
        try {
            const filter = { removed: false };
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
        }
        catch (error) {
            this.logger.error('Error fetching query reports', error);
            throw new common_1.BadRequestException('Failed to fetch query reports');
        }
    }
    async processWebhook(webhookData) {
        try {
            this.logger.log('Processing webhook data', {
                source: webhookData.source,
                event: webhookData.event,
                contact: webhookData.contact.name,
            });
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
        }
        catch (error) {
            this.logger.error('Error processing webhook', error);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handleLeadCreated(webhookData) {
        const { contact } = webhookData;
        const existingClient = await this.clientModel.findOne({
            email: contact.email,
            removed: false,
        });
        if (existingClient) {
            this.logger.log('Client already exists', { email: contact.email });
            return { message: 'Client already exists', clientId: existingClient._id };
        }
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
    async handleContactUpdated(webhookData) {
        const { contact } = webhookData;
        const updatedClient = await this.clientModel.findOneAndUpdate({ email: contact.email, removed: false }, {
            name: contact.name,
            phone: contact.phone,
            company: contact.company,
            updated: new Date(),
        }, { new: true });
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
    async handleSupportRequest(webhookData) {
        const { contact, message } = webhookData;
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
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = IntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Invoice')),
    __param(1, (0, mongoose_1.InjectModel)('Query')),
    __param(2, (0, mongoose_1.InjectModel)('Client')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map