import { flex } from "../../src/flex";

describe("complex structures", function () {
  it("flex() can handle layers of nested functions", () => {
    const testObject = {
      foo: "hello",
      bar: "world",
    };
    const joinResult = flex(
      "@join(@join($.foo,$.bar), @join($.foo,$.bar))",
      testObject
    );
    expect(joinResult).toEqual(["hello", "world", "hello", "world"]);
  });
});
