import { model, Schema } from "mongoose";

export interface IPlan {
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe Price ID
  features: string[];
  isActive: boolean;
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceId: { type: String, required: true },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: "Plan",
});

const PlanModel = model<IPlan>("Plan", planSchema);

export default PlanModel;
