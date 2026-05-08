import { Router, Request, Response } from "express";
import { successResponse } from "../../common/res/index.js";
import mealService from "./meal.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";
import { validation } from "../../middleware/validation.middleware.js";
import { createPresignedUrlSchema } from "./meal.validation.js";
import userService from "../user/user.service.js";

const mealRouter = Router();

// Public/User routes
mealRouter.get("/", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { userId } = req.query;
    
    let filter = {};
    
    // If target userId is provided and requester is ADMIN/COACH
    if (userId && [RoleEnum.ADMIN, RoleEnum.COACH].includes(user.role)) {
        const targetUser = await userService.findById(userId as string);
        if (targetUser) {
            filter = { _id: { $in: targetUser.assignedMeals || [] } };
        }
    } else if (user.role === RoleEnum.CLIENT) {
        filter = { _id: { $in: user.assignedMeals || [] } };
    }
    
    const meals = await mealService.findAll(filter);
    return successResponse({ res, data: { meals } });
}));

mealRouter.get("/:id", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const meal = await mealService.findById(req.params.id as string);
    return successResponse({ res, data: meal });
}));

// Admin/Coach routes
mealRouter.post("/", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user._id;
        const meal = await mealService.create({ ...req.body, userId });
        return successResponse({ res, message: "Meal created successfully", data: meal, statusCode: 201 });
    })
);

mealRouter.patch("/presigned-url",
    authentication(),
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]),
    validation(createPresignedUrlSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const data = await mealService.createPresignedUrl(req.body);
        return successResponse({ res, data });
    })
);

mealRouter.patch('/:id/image', 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        if (req.body.key) {
            const meal = await mealService.update(req.params.id as string, { image: req.body.key });
            return successResponse({ res, message: "Meal image updated successfully.", data: { meal } });
        }
        
        // Validate for presigned URL generation if key is not provided
        const validationResult = createPresignedUrlSchema.body.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validationResult.error.issues.map(i => ({ message: i.message, path: i.path })) 
            });
        }

        const data = await mealService.createPresignedUrl({ ...req.body, id: req.params.id });
        return successResponse({ res, message: "Meal image presigned URL generated.", data });
    })
);

mealRouter.patch("/:id", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        const meal = await mealService.update(req.params.id as string, req.body);
        return successResponse({ res, message: "Meal updated successfully", data: meal });
    })
);

mealRouter.delete("/:id", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        await mealService.delete(req.params.id as string);
        return successResponse({ res, message: "Meal deleted successfully" });
    })
);

export default mealRouter;
