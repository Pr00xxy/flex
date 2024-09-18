import { flex } from "../../src/index";

describe("nothing", function () {
  it("should return null", function () {
    const query = "@nothing()";
    const result = flex(query, {});
    expect(result).toBe(null);
  });
});
