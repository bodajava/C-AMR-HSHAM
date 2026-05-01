export const RoleEnum = {
    USER: 0,
    ADMIN: 1,
    COACH: 2
} as const;

export type RoleEnum = typeof RoleEnum[keyof typeof RoleEnum];
