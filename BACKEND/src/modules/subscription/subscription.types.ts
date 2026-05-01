import { SubscriptionPlan } from "../../common/enums/SubscriptionPlan.js";

export interface CreateCheckoutSessionDto {
  plan: SubscriptionPlan;
  userId: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan?: SubscriptionPlan;
  currentPeriodEnd?: Date;
}
