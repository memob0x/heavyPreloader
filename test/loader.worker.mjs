import { get, terminate } from "../src/loader.worker.mjs";

describe("worker", () => {
    it("should be able to create a worker dynamically", (done) => {
        expect(get()).to.be.an.instanceof(Worker);
        expect(terminate()).to.be.a("null");

        done();
    });

    it("should be able to retrieve a previously created worker without creating a new one", async () => {
        const value = "same-worker";

        const worker = get();

        const promise = new Promise((resolve) => {
            worker.onmessage = (event) => {
                if (event.data === value) {
                    resolve(event.data);
                }
            };
        });

        worker.postMessage("foobar");

        get().postMessage(value);

        const result = await promise;

        expect(result).to.equals(value);

        terminate();
        terminate();

        return promise;
    });

    it("should be able to terminate the worker when all instances are disposed", (done) => {
        expect(get()).to.be.an.instanceof(Worker);

        expect(get()).to.be.an.instanceof(Worker);

        expect(terminate()).to.be.an.instanceof(Worker);

        expect(terminate()).to.be.a("null");

        done();
    });
});
