import { TFlexTypes } from "../index";

export const concat = (
  delimiter: TFlexTypes,
  ...args: TFlexTypes[]
): string => {
  let result = "";
  for (const arg of args) {
      const index = args.indexOf(arg);
      if (typeof arg === "string") {
          result += arg;
      } else {
          result += concat(delimiter, ...arg);
      }
      if (index < args.length - 1) {
      // use delimiter or empty string if delimiter is null
      result += delimiter || "";
    }
  }
    return result.trim();
};
