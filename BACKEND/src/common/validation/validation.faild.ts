import z from "zod";
import { GenderEnum, ProviderEnum, RoleEnum } from "../enums/user.enum.js";
import { AvalibilityEnum } from "../enums/post.enum.js";

/**
 * Common validation fields reused across the application.
 * Note: Named with 'faild' to match the user's requested import path.
 */
export const validationGeneralFaild = {
    userName: z.string()
        .min(2, "User name must be at least 2 characters")
        .max(50, "User name must not exceed 50 characters"),
    email: z.string()
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100),
    phone: z.string().optional().or(z.literal("")),
    profilePicture: z.string().url("Invalid image URL").optional(),
    profileCoverPictures: z.array(z.string().url("Invalid image URL")).optional(),
    gender: z.nativeEnum(GenderEnum).optional(),
    role: z.nativeEnum(RoleEnum).optional(),
    provider: z.nativeEnum(ProviderEnum).optional(),
    DOB: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.date().optional()),
    otp: z.string().length(4, "OTP must be 4 digits"),

    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    avalibality: z.coerce.number().default(AvalibilityEnum.PUBLIC),

    file: function (mimetype: string[]) {
        return z.strictObject({
            fieldname: z.string(),
            originalname: z.string(),
            encoding: z.string(),
            mimetype: z.enum(mimetype as [string, ...string[]]),
            destination: z.string(),
            filename: z.string(),
            path: z.string().optional(),
            buffer: z.any().optional(),
            size: z.number(),
        }).superRefine((args , ctx)=>{
            if(!args.path && !args.buffer){
                ctx.addIssue({
                    path:['buffer'],
                    code : "custom",
                    message: "buffer is reqiered "
                })
            }
        })
    }
};