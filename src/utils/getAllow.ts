export type AllowFunction = (...userRoles: string[]) => boolean;
export const getAllow = (roles?: string[]): AllowFunction => {
  return (...userRoles: string[]) => {
    if (roles) {
      let result = 0;
      for (const role of userRoles) {
        if (roles.includes(role)) result += 1;
      }
      return result > 0;
    } else {
      return false;
    }
  };
};
