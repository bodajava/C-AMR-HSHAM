import { Router, Request, Response } from "express";
import { successResponse } from "../../common/res/index.js";
import mealService from "./meal.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { asyncHandler } from "../../common/utils/async-handler.util.js";

const mealRouter = Router();

// Public/User routes
mealRouter.get("/", authentication(), asyncHandler(async (req: Request, res: Response) => {
    const meals = await mealService.findAll();
    return successResponse({ res, data: meals });
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
        const meal = await mealService.create(req.body);
        return successResponse({ res, message: "Meal created successfully", data: meal, statusCode: 201 });
    })
);

mealRouter.patch("/presigned-url",
    authentication(),
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]),
    asyncHandler(async (req: Request, res: Response) => {
        const data = await mealService.createPresignedUrl(req.body);
        return successResponse({ res, data });
    })
);

mealRouter.patch('/:id/image', authentication(), authorization([RoleEnum.ADMIN, RoleEnum.COACH]), asyncHandler(async (req: Request, res: Response) => {
  if (req.body.key) {
    const meal = await (mealService as any).update(req.params.id, { image: req.body.key });
    return successResponse({ res, message: "Meal image updated successfully.", data: { meal } });
  }
  const meal = await mealService.createPresignedUrl({ ...req.body, id: req.params.id });
  return successResponse({ res, message: "Meal image presigned URL generated.", data: { meal } });
}));

mealRouter.patch("/:id", 
    authentication(), 
    authorization([RoleEnum.ADMIN, RoleEnum.COACH]), 
    asyncHandler(async (req: Request, res: Response) => {
        const meal = await (mealService as any).update(req.params.id as string, req.body);
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
