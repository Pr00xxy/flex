import { flex } from "../../src/index";

describe("fallback", () => {
  it("@fallback() should return the first value that exists", () => {
    const fallbackObject = {
      bar: "world",
    };
    const result = flex("@fallback($.foo,$.bar)", fallbackObject);
    expect(result).toStrictEqual("world");
  });
  it("@fallback() should work on objects", () => {
    const fallbackObject = {
      one: {
        key: 1,
      },
      two: {
        key: 2,
      },
    };
    const result = flex("@fallback($.two, $.one)", fallbackObject);
    expect(result).toStrictEqual({ key: 2 });
  });
  it("@fallback() should work on arrays", () => {
    const fallbackObject = {
      key: 1,
      array: [
        {
          key: 1,
        },
        {
          key: 2,
        },
      ],
    };
    const result = flex("@fallback($.undefined,$.array)", fallbackObject);
    expect(result).toStrictEqual([{ key: 1 }, { key: 2 }]);
  });
  it("@fallback() should be compatible with @space and @nothing", () => {
    const fallbackObject = {};
    const result = flex("@fallback(@nothing(),@space())", fallbackObject);
    expect(result).toStrictEqual(" ");
  });
  it("@fallback() should return first object even if undefined", () => {
    const fallbackObject = {
      field_1: undefined,
      field_2: "value!"
    };
    const result = flex("@fallback($.field_1,$.field_2)", fallbackObject);
    expect(result).toStrictEqual(undefined);
  });
});
