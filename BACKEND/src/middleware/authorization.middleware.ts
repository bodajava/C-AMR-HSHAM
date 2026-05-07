import { NextFunction, Response, Request } from "express";
import { RoleEnum } from "../common/enums/user.enum.js";
import { ForbiddenException } from "../common/exception/domain.exception.js";
import { configService } from "../common/services/config.service.js";

export const authorization = (accessRoles: RoleEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userEmail = user?.email?.toLowerCase()?.trim();

    const allowedAdmins = [
      configService.get('ADMIN_EMAIL'),
      'awm214365879@gmail.com',
      'amr917151@gmail.com',
      'bodajava@gmail.com'
    ].filter(Boolean).map(email => email?.toLowerCase()?.trim());

    console.log(`[AUTH] --- Authorization Check ---`);
    console.log(`[AUTH] Request User: ${JSON.stringify({ id: user?._id, email: user?.email, role: user?.role })}`);
    console.log(`[AUTH] Allowed Admins: ${allowedAdmins.join(', ')}`);
    console.log(`[AUTH] Required Roles: ${accessRoles.join(', ')}`);

    // If user's email is in the allowed list, they get full admin access
    const isEmailAdmin = userEmail && allowedAdmins.includes(userEmail);
    
    if (isEmailAdmin) {
      console.log(`[AUTH] Access granted via Admin Email whitelist: ${userEmail}`);
      return next();
    }

    if (!user) {
      console.error(`[AUTH] Access denied: No user found in request`);
      return next(new ForbiddenException("Not authorized account (No user session) 👀"));
    }

    // Otherwise, check if user's role is allowed for this route
    const userRole = Number(user.role);
    const hasRequiredRole = accessRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      console.error(`[AUTH] Access denied: Role ${userRole} not in [${accessRoles.join(', ')}]`);
      return next(new ForbiddenException(`Not authorized account (Role mismatch: ${userRole}) 👀`));
    }

    console.log(`[AUTH] Access granted via Role: ${userRole}`);
    return next();


    return next();
  };
};
