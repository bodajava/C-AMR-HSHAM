import { NextFunction, Response, Request } from "express";
import { RoleEnum } from "../common/enums/user.enum.js";
import { ForbiddenException } from "../common/exception/domain.exception.js";
import { configService } from "../common/services/config.service.js";

export const authorization = (accessRoles: RoleEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return next(new ForbiddenException("Not authorized account 👀"));
    }

    // First check if user's role is allowed
    if (!accessRoles.includes(user.role)) {
      return next(new ForbiddenException("Not authorized account 👀"));
    }

    // Special check for ADMIN role: must match ADMIN_EMAIL
    if (user.role === RoleEnum.ADMIN) {
      const adminEmail = configService.get('ADMIN_EMAIL');
      if (user.email !== adminEmail) {
        return next(new ForbiddenException("Access denied: You are not the authorized admin."));
      }
    }
    
    return next();
  };
};
