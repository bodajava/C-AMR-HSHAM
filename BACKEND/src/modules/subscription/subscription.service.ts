import Stripe from 'stripe';
import { configService } from '../../common/services/config.service.js';
import SubscriptionModel from '../../DB/model/subscription.model.js';
import PlanModel from '../../DB/model/plan.model.js';


class SubscriptionService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
  }

  /**
   * List all plans
   */
  async getPlans() {
    return await PlanModel.find({ isActive: true });
  }

  /**
   * Admin: List all plans (including inactive)
   */
  async getAllPlansAdmin() {
    return await PlanModel.find();
  }

  /**
   * Admin: Create a new plan
   */
  async createPlan(data: { name: string; description: string; price: number; features: string[] }) {
    // 1. Create Product in Stripe
    const product = await this.stripe.products.create({
      name: data.name,
      description: data.description,
    });

    // 2. Create Price in Stripe
    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: data.price * 100, // Stripe expects amounts in cents
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    // 3. Save to DB
    return await PlanModel.create({
      ...data,
      priceId: price.id,
    });
  }

  /**
   * Admin: Update a plan
   */
  async updatePlan(id: string, data: Partial<{ name: string; description: string; price: number; features: string[]; isActive: boolean }>) {
    const plan = await PlanModel.findById(id);
    if (!plan) throw new Error('Plan not found');

    let priceId = plan.priceId;

    // If price changed, create a new price in Stripe
    if (data.price && data.price !== plan.price) {
      const price = await this.stripe.prices.create({
        product: await this.getProductIdByPriceId(plan.priceId),
        unit_amount: data.price * 100,
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      priceId = price.id;
    }

    // If name or description changed, update Product in Stripe
    if (data.name || data.description) {
      const productId = await this.getProductIdByPriceId(plan.priceId);
      const productUpdate: any = {};
      if (data.name) productUpdate.name = data.name;
      if (data.description) productUpdate.description = data.description;
      
      await this.stripe.products.update(productId, productUpdate);
    }

    return await PlanModel.findByIdAndUpdate(id, { ...data, priceId }, { new: true });
  }

  /**
   * Helper to get Product ID from Price ID
   */
  private async getProductIdByPriceId(priceId: string): Promise<string> {
    const price = await this.stripe.prices.retrieve(priceId);
    return price.product as string;
  }

  /**
   * Admin: Delete a plan (soft delete/deactivate)
   */
  async deletePlan(id: string) {
    return await PlanModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  /**
   * Create a Stripe Checkout Session for a subscription
   */
  async createCheckoutSession(userId: string, planId: string, email: string) {
    const plan = await PlanModel.findById(planId);
    if (!plan) throw new Error('Invalid subscription plan');

    const priceId = plan.priceId;

    // Check if user already has a Stripe Customer ID in our DB
    let subscription = await SubscriptionModel.findOne({ userId });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      // Create a new customer in Stripe if they don't exist
      const customer = await this.stripe.customers.create({
        email,
        metadata: { user_id: userId.toString() },
    });
    customerId = customer.id;

    // Save initial subscription record
    await SubscriptionModel.create({
      userId: String(userId),
      stripeCustomerId: customerId,
      plan: 'none',
      status: 'pending'
    });
  }

  const session = await this.stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${configService.get('CLIENT_URL')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configService.get('CLIENT_URL')}/subscription/cancel`,
    metadata: {
      userId: userId.toString(),
      plan: plan.name.toString(),
    },
    });

    return session.url;
  }

  /**
   * Handle Stripe Webhooks
   */
  async handleWebhook(body: any, signature: string) {
    const webhookSecret = configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      if (webhookSecret && signature) {
        event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        event = body as Stripe.Event; // Fallback for local testing
      }
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.fulfillSubscription(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handlePaymentSuccess(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async fulfillSubscription(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId || !plan) {
      console.warn('Webhook received but missing userId or plan in metadata');
      return;
    }

    console.log(`Fulfilling subscription for user ${userId} with plan ${plan}`);

    await SubscriptionModel.findOneAndUpdate(
      { userId },
      {
        stripeSubscriptionId,
        plan,
        status: 'active',
      },
      { upsert: true }
    );
  }

  private async handlePaymentSuccess(invoice: any) {
    const stripeSubscriptionId = invoice.subscription as string;
    if (!stripeSubscriptionId) return;

    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    
    if ('deleted' in subscription && subscription.deleted) {
      return;
    }

    const sub = subscription as any;

    await SubscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId },
      {
        status: 'active',
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      }
    );
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await SubscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        status: 'canceled',
        plan: 'none',
      }
    );
  }

  async getSubscriptionStatus(userId: string) {
    const subscription = await SubscriptionModel.findOne({ userId });
    if (!subscription) {
      return { isActive: false, plan: 'none' };
    }
    return {
      isActive: subscription.status === 'active',
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  }
}

export const subscriptionService = new SubscriptionService();
