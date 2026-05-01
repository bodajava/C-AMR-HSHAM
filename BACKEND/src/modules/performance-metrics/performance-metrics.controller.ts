import { Router, Request, Response } from "express";
import { successResponse } from "../../common/res/index.js";
import performanceMetricsService from "./performance-metrics.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

const performanceMetricsRouter = Router();

performanceMetricsRouter.get("/", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const metrics = await performanceMetricsService.getMetrics();
    return successResponse({ res, data: metrics });
}));

performanceMetricsRouter.patch("/", 
    authentication(), 
    authorization([RoleEnum.ADMIN]), 
    asyncHandler(async (req: Request, res: Response) => {
        const metrics = await performanceMetricsService.updateMetrics(req.body);
        return successResponse({ res, message: "Metrics updated successfully", data: metrics });
    })
);

export default performanceMetricsRouter;
