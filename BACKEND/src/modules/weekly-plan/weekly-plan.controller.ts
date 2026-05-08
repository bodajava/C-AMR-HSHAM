import { Router, Response } from 'express';
import { weeklyPlanService } from './weekly-plan.service.js';
import { asyncHandler } from '../../common/utils/async-handler.util.js';
import { successResponse } from '../../common/res/success.response.js';
import { authentication } from '../../middleware/authentication.middleware.js';
import { authorization } from '../../middleware/authorization.middleware.js';
import { RoleEnum } from '../../common/enums/user.enum.js';

const router = Router();

/**
 * @route GET /weekly-plan
 * @desc Get all weekly plan days
 * @access Private
 */
router.get(
    '/',
    authentication(),
    asyncHandler(async (req: any, res: Response) => {
        const user = req.user;
        const { userId } = req.query;
        
        const targetUserId = (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) 
            ? (userId as string) 
            : user._id.toString();

        const plans = await weeklyPlanService.getAll(targetUserId);
        return successResponse({
            res,
            message: 'Weekly plans retrieved successfully',
            data: plans,
        });
    })
);

/**
 * @route GET /weekly-plan/:day
 * @desc Get plan for a specific day
 * @access Private
 */
router.get(
    '/:day',
    authentication(),
    asyncHandler(async (req: any, res: Response) => {
        const user = req.user;
        const { userId } = req.query;
        
        const targetUserId = (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) 
            ? (userId as string) 
            : user._id.toString();

        const plan = await weeklyPlanService.getByDay(targetUserId, req.params.day);
        return successResponse({
            res,
            message: `Plan for ${req.params.day} retrieved successfully`,
            data: plan,
        });
    })
);

/**
 * @route PATCH /weekly-plan/:day
 * @desc Update plan for a specific day (Admin/Coach only)
 * @access Private/Admin
 */
router.patch(
    '/:day',
    authentication(),
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]),
    asyncHandler(async (req: any, res: Response) => {
        const user = req.user;
        const { userId } = req.query;
        
        const targetUserId = (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) 
            ? (userId as string) 
            : user._id.toString();

        const plan = await weeklyPlanService.updateByDay(targetUserId, req.params.day, req.body);
        return successResponse({
            res,
            message: `Plan for ${req.params.day} updated successfully`,
            data: plan,
        });
    })
);

export default router;
