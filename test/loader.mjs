import Loader from "../src/loader.mjs";

describe("constructor and public methods", () => {
    const instance = new Loader();

    it("constructor should expose load and fetch methods", (done) => {
        expect(instance).to.respondTo("load");
        expect(instance).to.respondTo("fetch");

        done();
    });

    describe("fetch public method", () => {
        it("should be able to handle an url object", (done) => done());

        it("should be able to lists of url objects", (done) => done());

        it("should be able to handle strings", (done) => done());

        it("should be able to handle lists of url objects", (done) => done());

        it("should be able to handle strings", (done) => done());

        it("should be able to handle lists of url objects", (done) => done());
    });

    describe("load public method", () => {
        it("should be able to handle an url object", (done) => done());

        it("should be able to lists of url objects", (done) => done());

        it("should be able to handle strings", (done) => done());

        it("should be able to handle lists of url objects", (done) => done());

        it("should be able to handle strings", (done) => done());

        it("should be able to handle lists of url objects", (done) => done());

        it("should be able to handle blob objects", (done) => done());

        it("should be able to handle lists of blob objects", (done) => done());

        it("should be able to handle lists of options if a list of resources is given", (done) =>
            done());
    });
});
