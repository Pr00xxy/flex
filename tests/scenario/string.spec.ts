import {flex} from "../../src/flex";

describe("string tests", () => {
    it("should be possible to use string value as literals", () => {
        const testObject = {};
        const concatResult = flex("@concat(@space(), 'hello','world')", testObject);
        expect(concatResult).toEqual("hello world");
    });
});