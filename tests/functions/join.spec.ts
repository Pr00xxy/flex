import { flex } from "../../src/flex";

describe("join", function () {
  /**
   * given string arguments should return a new array with the arguments
   */
  it("should join two fields together into a single array", function () {
    const data = {
      field_1: "one",
      field_2: "two",
    };
    const query = "@join($.field_1, $.field_2)";
    const result = flex(query, data);
    expect(result).toStrictEqual(["one", "two"]);
  });

  /**
   * given array arguments should return a new array with all the elements of all of the arrays
   */
  it("should join two string arrays together into a single array", function () {
    const data = {
      field_1: ["one", "two"],
      field_2: ["three", "four"],
    };
    const query = "@join($.field_1, $.field_2)";
    const result = flex(query, data);
    expect(result).toStrictEqual(["one", "two", "three", "four"]);
  });

  /**
   * given object arguments should return a new array with the objects
   */
  it("should join two objects together into a single array", function () {
    const data = {
      field_1: { one: 1, two: 2 },
      field_2: { three: 3, four: 4 },
    };
    const query = "@join($.field_1, $.field_2)";
    const result = flex(query, data);
    expect(result).toStrictEqual([
      { one: 1, two: 2 },
      { three: 3, four: 4 },
    ]);
  });

  /**
   * given array of objects arguments should return a new array with the objects of all of the arrays
   */
  it("should join two arrays of objects together into a single array", function () {
    const data = {
      field_1: [
        { one: 1, two: 2 },
        { three: 3, four: 4 },
      ],
      field_2: [
        { five: 5, six: 6 },
        { seven: 7, eight: 8 },
      ],
    };
    const query = "@join($.field_1, $.field_2)";
    const result = flex(query, data);
    expect(result).toStrictEqual([
      { one: 1, two: 2 },
      { three: 3, four: 4 },
      { five: 5, six: 6 },
      { seven: 7, eight: 8 },
    ]);
  });

  /**
   * given a mix of string, array, and object arguments should return a new array with all the elements of all of the arrays
   * All arguments should be flattened into a single array
   */
  it("should join a mix of string, array, and object arguments together into a single array", function () {
    const data = {
      field_1: "one",
      field_2: ["two", "three"],
      field_3: { four: 4, five: 5 },
    };
    const query = "@join($.field_1, $.field_2, $.field_3)";
    const result = flex(query, data);
    expect(result).toStrictEqual(["one", "two", "three", { four: 4, five: 5 }]);
  });
});
