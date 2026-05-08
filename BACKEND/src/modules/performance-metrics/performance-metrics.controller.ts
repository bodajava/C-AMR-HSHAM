import { Router, Request, Response } from "express";
import { successResponse } from "../../common/res/index.js";
import performanceMetricsService from "./performance-metrics.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

const performanceMetricsRouter = Router();

performanceMetricsRouter.get("/", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { userId } = req.query;
    
    // If target userId is provided and requester is ADMIN/COACH
    const targetUserId = (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) 
        ? (userId as string) 
        : user._id.toString();

    const metrics = await performanceMetricsService.getMetrics(targetUserId);
    return successResponse({ res, data: metrics });
}));

performanceMetricsRouter.patch("/", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { userId } = req.query;
        
        // If target userId is provided and requester is ADMIN/COACH
        const targetUserId = (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) 
            ? (userId as string) 
            : user._id.toString();

        const metrics = await performanceMetricsService.updateMetrics(targetUserId, req.body);
        return successResponse({ res, message: "Metrics updated successfully", data: metrics });
    })
);

export default performanceMetricsRouter;
