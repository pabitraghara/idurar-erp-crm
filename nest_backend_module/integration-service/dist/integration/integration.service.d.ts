import { Model } from 'mongoose';
import { WebhookDto } from '../dto/webhook.dto';
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
export declare class IntegrationService {
    private readonly invoiceModel;
    private readonly queryModel;
    private readonly clientModel;
    private readonly logger;
    constructor(invoiceModel: Model<Invoice>, queryModel: Model<Query>, clientModel: Model<Client>);
    getReportsSummary(startDate?: string, endDate?: string): Promise<{
        invoices: {
            byStatus: any[];
            monthly: any[];
            total: any;
            totalRevenue: any;
        };
        queries: {
            byStatus: any[];
            total: any;
        };
        clients: {
            total: number;
        };
        generatedAt: string;
    }>;
    getInvoiceReports(page: number, limit: number, status?: string): Promise<{
        invoices: {
            id: string;
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getQueryReports(page: number, limit: number, status?: string): Promise<{
        queries: {
            id: string;
            description: string;
            status: string;
            priority: string;
            client: {
                name: string;
                email: string;
            };
            created: Date;
            updated: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    processWebhook(webhookData: WebhookDto): Promise<{
        message: string;
        clientId: string;
    } | {
        message: string;
        clientId?: undefined;
    }>;
    private handleLeadCreated;
    private handleContactUpdated;
    private handleSupportRequest;
}
export {};
