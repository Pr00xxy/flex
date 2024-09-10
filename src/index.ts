import * as jp from "jsonpath";
import { fallback } from "./functions/fallback";
import { concat } from "./functions/concat";
import { join } from "./functions/join";
import { space } from "./functions/space";
import { nothing } from "./functions/nothing";

// Syntax tokens
const T_START_PARAMS = "(";
const T_END_PARAMS = ")";
const T_ARG_SEPARATOR = ",";
const T_START_FN = "@";
const T_START_JPQ = "$";
const T_START_LITERAL = "'";

type TFunctionMap = {
  [name: string]: CallableFunction;
};

type TTree<T> = T | Array<T> | Array<TTree<T>>;

export type TFlexTypes = TTree<string>;

export type TFlexFunction = {
  (sequence: string, data: Record<string, any>, functionMap?: TFunctionMap):
    | string
    | string[];
};

/**
 * The default flex function with all the standard functions
 */
export const flex: TFlexFunction = (
  sequence: string,
  data: Record<string, any>,
  functionMap?: TFunctionMap
) => {
  const functions = {
    ...defaultFunctions,
    ...functionMap,
  };
  return evaluate(sequence, data, functions);
};

/**
 * A safer version of flex that does not include the standard functions
 */
export const flexSafe: TFlexFunction = (
  sequence: string,
  data: Record<string, any>,
  functionMap: TFunctionMap = {}
) => {
  return evaluate(sequence, data, functionMap);
};

/**
 * @param sequence the FLEX sequence string
 * @param data The data object which to run the sequence against
 * @param functionMap Any custom functions
 */
function evaluate(
  sequence: string,
  data: Record<string, any>,
  functionMap: TFunctionMap
): string {
  const tokenStack: any[] = [[]];
  let currentToken = "";

  for (let i = 0; i < sequence.length; i++) {
    const char = sequence[i];

    switch (char) {
      case T_START_PARAMS:
        tokenStack[tokenStack.length - 1].push(
          currentToken.trim() || undefined
        );
        currentToken = "";
        tokenStack.push([]);
        break;

      case T_START_LITERAL:
        tokenStack[tokenStack.length - 1].push(
          currentToken.trim() || undefined
        );
        currentToken = "";
        break;

      case T_END_PARAMS:
        // REached the end of a function call. Start executing

        tokenStack[tokenStack.length - 1].push(
          currentToken.trim() || undefined
        );
        currentToken = "";

        // Get the raw args
        const args = tokenStack.pop();
        const flexFunction = tokenStack[tokenStack.length - 1].pop();
        // Remove the T_START_FN token so that we can call the actual function in the map
        const functionName = flexFunction.replace(T_START_FN, "");

        /**
         * NoteToSelf later:
         * The reason all return types are array is because jq.query will always return an array
         * So if all arguments are equal it should be easier?
         */
        const parsedArgs = args
          // We push undefined undefined currentToken to the stack sometimes
          .filter((arg: string) => arg !== undefined)
          .map((arg: string) => {
            if (typeof arg !== "string") {
              return arg;
            }
            if (arg.startsWith(T_START_FN)) {
              // function encounter, Go deeper into the stack, deja vu?
              return evaluate(arg, data, functionMap);
            }
            if (arg.startsWith(T_START_JPQ)) {
              // Parse argument like it was a jp query
              return jp.query(data, arg);
            }
            return arg;
          });

        if (
          !functionMap[functionName] &&
          !functionName.startsWith(T_START_FN)
        ) {
          tokenStack[tokenStack.length - 1].push(functionName);
          break;
        }

        const fn = functionMap[functionName];
        if (fn) {
          const result = fn(...parsedArgs);
          tokenStack[tokenStack.length - 1].push(result);
        } else {
          throw new Error(`Unknown function: ${functionName}`);
        }
        break;

      case T_ARG_SEPARATOR:
        tokenStack[tokenStack.length - 1].push(
          currentToken.trim() || undefined
        );
        currentToken = "";
        break;

      default:
        currentToken += char ? char.replace('"', "") : char;
        break;
    }
  }

  tokenStack[tokenStack.length - 1].push(currentToken.trim() || undefined);

  if (tokenStack.length > 1) {
    throw new Error("Unmatched opening parenthesis");
  }

  return tokenStack[0][0];
}

const defaultFunctions: TFunctionMap = {
  concat: concat,
  join: join,
  space: space,
  fallback: fallback,
  nothing: nothing,
};
