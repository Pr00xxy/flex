import { flex } from "../../src/flex";

describe("nothing", function () {
  it("should return null", function () {
    const query = "@nothing()";
    const result = flex(query, {});
    expect(result).toBe(null);
  });
});
