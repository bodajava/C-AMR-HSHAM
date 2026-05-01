import z from "zod";
import { validationGeneralFaild } from "../../common/validation/validation.faild.js";

export const loginSchema = {
    body: z.object({
        email: validationGeneralFaild.email,
        password: validationGeneralFaild.password,
        FCM: z.string().optional(),
    })
};

export const signupSchema = {
    body: z.object({
        userName: validationGeneralFaild.userName,
        email: validationGeneralFaild.email,
        password: validationGeneralFaild.password,
        phone: validationGeneralFaild.phone.optional(),
        profilePicture: validationGeneralFaild.profilePicture.optional(),
        profileCoverPictures: validationGeneralFaild.profileCoverPictures.optional(),
        gender: validationGeneralFaild.gender.optional(),
        role: validationGeneralFaild.role.optional(),
        provider: validationGeneralFaild.provider.optional(),
        DOB: validationGeneralFaild.DOB.optional()
    })
};

export const confirmEmail = {
    body: z.object({
        email: validationGeneralFaild.email,
        otp: validationGeneralFaild.otp
    })
};

export const reSendConfifrmEmailDto = {
    body: z.object({
        email: validationGeneralFaild.email,
    })
};