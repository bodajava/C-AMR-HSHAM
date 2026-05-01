import { Router, Response } from 'express';
import { subscriptionService } from './subscription.service.js';
import { asyncHandler } from '../../common/utils/async-handler.util.js';
import { successResponse } from '../../common/res/success.response.js';
import { authentication } from '../../middleware/authentication.middleware.js';
import { authorization } from '../../middleware/authorization.middleware.js';
import { RoleEnum } from '../../common/enums/user.enum.js';

const router = Router();

/**
 * @route GET /subscription/plans
 * @desc Get all active plans
 * @access Public
 */
router.get(
  '/plans',
  asyncHandler(async (req: any, res: Response) => {
    const plans = await subscriptionService.getPlans();
    return successResponse({
      res,
      message: 'Plans retrieved successfully',
      data: plans,
    });
  })
);

/**
 * @route POST /subscription/checkout
 * @desc Create a Stripe Checkout Session
 * @access Private
 */
router.post(
  '/checkout',
  authentication(),
  asyncHandler(async (req: any, res: Response) => {
    const { planId } = req.body;
    const userId = req.user._id.toString();
    const email = req.user.email;

    const url = await subscriptionService.createCheckoutSession(userId, planId, email);

    return successResponse({
      res,
      message: 'Checkout session created successfully',
      data: { url },
    });
  })
);

/**
 * @route GET /subscription/status
 * @desc Get user subscription status
 * @access Private
 */
router.get(
  '/status',
  authentication(),
  asyncHandler(async (req: any, res: Response) => {
    const userId = req.user._id;
    const status = await subscriptionService.getSubscriptionStatus(userId);

    return successResponse({
      res,
      message: 'Subscription status retrieved successfully',
      data: status,
    });
  })
);

/**
 * @route POST /subscription/webhook
 * @desc Handle Stripe Webhooks
 * @access Public
 */
router.post(
  '/webhook',
  asyncHandler(async (req: any, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const result = await subscriptionService.handleWebhook(req.rawBody || req.body, sig);
    return res.status(200).send(result);
  })
);

// --- ADMIN ROUTES ---

/**
 * @route GET /subscription/admin/plans
 * @desc Get all plans (admin)
 * @access Private/Admin
 */
router.get(
  '/admin/plans',
  authentication(),
  authorization([RoleEnum.ADMIN]),
  asyncHandler(async (req: any, res: Response) => {
    const plans = await subscriptionService.getAllPlansAdmin();
    return successResponse({
      res,
      message: 'All plans retrieved successfully',
      data: plans,
    });
  })
);

/**
 * @route POST /subscription/admin/plans
 * @desc Create a new plan
 * @access Private/Admin
 */
router.post(
  '/admin/plans',
  authentication(),
  authorization([RoleEnum.ADMIN]),
  asyncHandler(async (req: any, res: Response) => {
    const plan = await subscriptionService.createPlan(req.body);
    return successResponse({
      res,
      message: 'Plan created successfully',
      data: plan,
    });
  })
);

/**
 * @route PATCH /subscription/admin/plans/:id
 * @desc Update a plan
 * @access Private/Admin
 */
router.patch(
  '/admin/plans/:id',
  authentication(),
  authorization([RoleEnum.ADMIN]),
  asyncHandler(async (req: any, res: Response) => {
    const plan = await subscriptionService.updatePlan(req.params.id, req.body);
    return successResponse({
      res,
      message: 'Plan updated successfully',
      data: plan,
    });
  })
);

/**
 * @route DELETE /subscription/admin/plans/:id
 * @desc Delete a plan
 * @access Private/Admin
 */
router.delete(
  '/admin/plans/:id',
  authentication(),
  authorization([RoleEnum.ADMIN]),
  asyncHandler(async (req: any, res: Response) => {
    await subscriptionService.deletePlan(req.params.id);
    return successResponse({
      res,
      message: 'Plan deleted successfully',
    });
  })
);

export default router;
