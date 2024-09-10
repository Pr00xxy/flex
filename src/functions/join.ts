import { TFlexTypes } from "../index";

/**
 * Joins all arguments into a single array.
 */
export const join = (...args: TFlexTypes[]): TFlexTypes =>
  args.flatMap((arg) => {
    return Array.isArray(arg) ? join(...arg) : arg;
  });
