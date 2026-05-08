import { RoleEnum } from "../../common/enums/user.enum.js";



export const endPoint ={
    profile : [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.COACH, RoleEnum.CLIENT],
    clients : [RoleEnum.ADMIN, RoleEnum.COACH]
}  