import { Schema, model } from "mongoose";

const CreditTransactionTypes = [
  "purchase",
  "refund",
  "admin_adjustment",
  "feature_usage",
  "bonus",
  "expiry",
  "reversal",
];
const CreditTransactionStatus = [
  "pending",
  "completed",
  "failed",
  "cancelled",
  "reversed",
];
const FeatureTypes = [
  "lead_accept",
  "premium_visibility",
  "search_boost",
  "featured_listing",
  "profile_highlight",
];

const creditTransactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: CreditTransactionTypes,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: CreditTransactionStatus,
      default: "completed",
      index: true,
    },
    professional_id: {
      type: Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    package_id: {
      type: Schema.Types.ObjectId,
      ref: "CreditPackage",
    },
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
    },
    feature_type: {
      type: String,
      enum: FeatureTypes,
    },
    price: {
      type: Number,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance_before: {
      type: Number,
      required: true,
    },
    balance_after: {
      type: Number,
      required: true,
    },

    payment_currency: {
      type: String,
      default: "USD",
    },
    payment_method: {
      type: String,
    },
    payment_transaction_id: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      index: true,
    },
    processed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "credit_transactions",
  }
);
creditTransactionSchema.index({ professional_id: 1, createdAt: -1 });
creditTransactionSchema.index({ user_id: 1, createdAt: -1 });
creditTransactionSchema.index({ type: 1, status: 1 });
creditTransactionSchema.index({ payment_transaction_id: 1 });
creditTransactionSchema.index({ expires_at: 1 });

export default model("CreditTransaction", creditTransactionSchema);
