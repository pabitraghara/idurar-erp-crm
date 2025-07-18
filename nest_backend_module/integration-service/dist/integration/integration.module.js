"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const integration_controller_1 = require("./integration.controller");
const integration_service_1 = require("./integration.service");
const InvoiceSchema = new (require('mongoose').Schema)({
    number: { type: Number, required: true },
    year: { type: Number, required: true },
    status: {
        type: String,
        enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
        default: 'draft',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'partially'],
        default: 'unpaid',
    },
    total: { type: Number, default: 0 },
    currency: { type: String, required: true },
    date: { type: Date, required: true },
    client: { type: require('mongoose').Schema.Types.ObjectId, ref: 'Client' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false },
});
const QuerySchema = new (require('mongoose').Schema)({
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    client: { type: require('mongoose').Schema.Types.ObjectId, ref: 'Client' },
    notes: [
        {
            content: String,
            createdAt: { type: Date, default: Date.now },
            createdBy: {
                type: require('mongoose').Schema.Types.ObjectId,
                ref: 'Admin',
            },
        },
    ],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false },
});
const ClientSchema = new (require('mongoose').Schema)({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false },
});
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Invoice', schema: InvoiceSchema },
                { name: 'Query', schema: QuerySchema },
                { name: 'Client', schema: ClientSchema },
            ]),
        ],
        controllers: [integration_controller_1.IntegrationController],
        providers: [integration_service_1.IntegrationService],
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map