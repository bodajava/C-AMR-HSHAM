import { Router, Request, Response } from "express";
import { successResponse } from "../../common/res/index.js";
import workoutService from "./workout.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";
import userService from "../user/user.service.js";

const workoutRouter = Router();

// Public/User routes
workoutRouter.get("/", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { userId } = req.query;
    
    let filter = {};
    
    // If target userId is provided and requester is ADMIN/COACH
    if (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) {
        const targetUser = await userService.findById(userId as string);
        if (targetUser) {
            filter = { _id: { $in: targetUser.assignedWorkouts || [] } };
        }
    } else if (user.role === RoleEnum.CLIENT) {
        filter = { _id: { $in: user.assignedWorkouts || [] } };
    }
    
    const workouts = await workoutService.findAll(filter);
    return successResponse({ res, data: { workouts } });
}));

workoutRouter.get("/:id", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const workout = await workoutService.findById(req.params.id as string);
    return successResponse({ res, data: workout });
}));

// Admin/Coach routes
workoutRouter.post("/", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user._id;
        const workout = await workoutService.create({ ...req.body, userId });
        return successResponse({ res, message: "Workout created successfully", data: workout, statusCode: 201 });
    })
);

workoutRouter.patch("/:id", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        const workout = await workoutService.update(req.params.id as string, req.body);
        return successResponse({ res, message: "Workout updated successfully", data: workout });
    })
);

workoutRouter.patch("/presigned-url",
    authentication(),
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]),
    asyncHandler(async (req: Request, res: Response) => {
        const data = await workoutService.createPresignedUrl(req.body);
        return successResponse({ res, data });
    })
);

workoutRouter.delete("/:id", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        await workoutService.delete(req.params.id as string);
        return successResponse({ res, message: "Workout deleted successfully" });
    })
);

export default workoutRouter;
