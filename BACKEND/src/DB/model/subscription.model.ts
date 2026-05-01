import { model, Schema, Types } from "mongoose";

export interface ISubscription {
  userId: Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: string;
  status: string;
  currentPeriodEnd?: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String },
  plan: { type: String, required: true },
  status: { type: String, required: true },
  currentPeriodEnd: { type: Date },
}, {
  timestamps: true,
  collection: "Subscription",
});

const SubscriptionModel = model<ISubscription>("Subscription", subscriptionSchema);

export default SubscriptionModel;
