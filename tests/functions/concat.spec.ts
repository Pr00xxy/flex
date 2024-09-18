import { flex } from "../../src/index";

describe("concat", () => {
  it("should return the argument if no other arguments were passed", () => {
    const testObject = {
      foo: "hello",
      bar: "world",
    };
    const concatResult = flex("@concat(@space(),$.foo)", testObject);
    expect(concatResult).toEqual("hello");
  });
  it("should be compatible with @nothing function", () => {
    const testObject = {
      foo: "hello",
      bar: "world",
    };
    const concatResult = flex("@concat(@nothing(),$.foo,$.bar)", testObject);
    expect(concatResult).toEqual("helloworld");
  });
  it("should be compatible with @space function", () => {
    const testObject = {
      foo: "hello",
      bar: "world",
    };
    const concatResult = flex("@concat(@space(),$.foo,$.bar)", testObject);
    expect(concatResult).toEqual("hello world");
  });
  it("should concat single dimension arrays if given as argument", () => {
    const testObject = {
      foo: ["hello", "world"],
    };
    const concatResult = flex("@concat(@space(), $.foo[*])", testObject);
    expect(concatResult).toEqual("hello world");
  });
  it("should concat multiple single dimension arrays if given as argument", () => {
    const testObject = {
      foo: ["hello", "world"],
      bar: ["brown", "fox"],
    };
    const concatResult = flex(
      "@concat(@space(),$.foo[*],$.bar[*])",
      testObject
    );
    expect(concatResult).toEqual("hello world brown fox");
  });
  it("should concat all elements of nested arrays into a single string", () => {
    const testObject = {
      biz: [
        ["brown", "fox"],
        ["brown", "fox"],
      ],
    };
    const concatResult = flex(
      "@concat(@space(),$.biz[*])",
      testObject
    );
    expect(concatResult).toEqual("brown fox brown fox");
  });
});
