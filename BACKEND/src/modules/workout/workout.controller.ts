import { Router, Request, Response } from "express";
import { successResponse } from "../../common/res/index.js";
import workoutService from "./workout.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

const workoutRouter = Router();

// Public/User routes
workoutRouter.get("/", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const workouts = await workoutService.findAll();
    return successResponse({ res, data: workouts });
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
        const workout = await workoutService.create(req.body);
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

workoutRouter.delete("/:id", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        await workoutService.delete(req.params.id as string);
        return successResponse({ res, message: "Workout deleted successfully" });
    })
);

export default workoutRouter;
