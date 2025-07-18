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
var IntegrationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const integration_service_1 = require("./integration.service");
const webhook_dto_1 = require("../dto/webhook.dto");
let IntegrationController = IntegrationController_1 = class IntegrationController {
    integrationService;
    logger = new common_1.Logger(IntegrationController_1.name);
    constructor(integrationService) {
        this.integrationService = integrationService;
    }
    async getReportsSummary(startDate, endDate) {
        try {
            this.logger.log('Fetching reports summary', { startDate, endDate });
            const summary = await this.integrationService.getReportsSummary(startDate, endDate);
            return {
                success: true,
                data: summary,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error fetching reports summary', error);
            throw error;
        }
    }
    async getInvoiceReports(page = 1, limit = 10, status) {
        try {
            this.logger.log('Fetching invoice reports', { page, limit, status });
            const reports = await this.integrationService.getInvoiceReports(+page, +limit, status);
            return {
                success: true,
                data: reports,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error fetching invoice reports', error);
            throw error;
        }
    }
    async getQueryReports(page = 1, limit = 10, status) {
        try {
            this.logger.log('Fetching query reports', { page, limit, status });
            const reports = await this.integrationService.getQueryReports(+page, +limit, status);
            return {
                success: true,
                data: reports,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error fetching query reports', error);
            throw error;
        }
    }
    async handleWebhook(webhookData) {
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
        }
        catch (error) {
            this.logger.error('Error processing webhook', error);
            throw error;
        }
    }
    getHealth() {
        return {
            status: 'healthy',
            service: 'integration-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Get)('reports/summary'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getReportsSummary", null);
__decorate([
    (0, common_1.Get)('reports/invoices'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getInvoiceReports", null);
__decorate([
    (0, common_1.Get)('reports/queries'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getQueryReports", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhook_dto_1.WebhookDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationController.prototype, "getHealth", null);
exports.IntegrationController = IntegrationController = IntegrationController_1 = __decorate([
    (0, common_1.Controller)('integration'),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map