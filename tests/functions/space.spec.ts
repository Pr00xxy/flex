import { flex } from "../../src/index";

describe("space", function () {
  it("should return a string with a space character", function () {
    const query = "@space()";
    const result = flex(query, {});
    expect(result).toBe(" ");
  });
});
