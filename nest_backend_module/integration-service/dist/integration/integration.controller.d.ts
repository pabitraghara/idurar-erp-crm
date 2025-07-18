import { IntegrationService } from './integration.service';
import { WebhookDto } from '../dto/webhook.dto';
export declare class IntegrationController {
    private readonly integrationService;
    private readonly logger;
    constructor(integrationService: IntegrationService);
    getReportsSummary(startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
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
        };
        timestamp: string;
    }>;
    getInvoiceReports(page?: number, limit?: number, status?: string): Promise<{
        success: boolean;
        data: {
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
        };
        timestamp: string;
    }>;
    getQueryReports(page?: number, limit?: number, status?: string): Promise<{
        success: boolean;
        data: {
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
        };
        timestamp: string;
    }>;
    handleWebhook(webhookData: WebhookDto): Promise<{
        success: boolean;
        message: string;
        data: {
            message: string;
            clientId: string;
        } | {
            message: string;
            clientId?: undefined;
        };
        timestamp: string;
    }>;
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
    };
}
