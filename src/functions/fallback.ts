import { TFlexTypes } from "../index";

/**
 * Returns the first non falsy and non-empty value from the given arguments.
 */
export const fallback = (...args: TFlexTypes[]) => {
  for (const arg of args) {
    if (arg && arg.length > 0) {
      return arg[0];
    }
  }
  return undefined;
};
