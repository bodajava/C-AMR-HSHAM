import z from "zod";

export const createPresignedUrlSchema = {
    body: z.object({
        ContentType: z.string().startsWith("image/", "Content-Type must be an image (e.g., image/jpeg, image/png)"),
        originalname: z.string().optional(),
        originMealName: z.string().optional(),
        id: z.string().optional(),
    }).refine(data => data.originalname || data.originMealName, {
        message: "Either originalname or originMealName must be provided",
        path: ["originalname"]
    })
};
