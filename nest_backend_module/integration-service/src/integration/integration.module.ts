import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

// Define schemas that match the main application
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Invoice', schema: InvoiceSchema },
      { name: 'Query', schema: QuerySchema },
      { name: 'Client', schema: ClientSchema },
    ]),
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}
