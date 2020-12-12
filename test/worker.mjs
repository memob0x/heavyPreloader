import LoaderWorker from "../src/worker.mjs";

describe("worker", () => {
    const lworker = new LoaderWorker();
    
    it("should be able to create a worker dynamically", (done) => {
        expect(lworker.worker()).to.be.an.instanceof(Worker);
        expect(lworker.terminate()).to.be.a("null");

        done();
    });

    // TODO: simplify this test body
    it("should be able to retrieve a previously created worker without creating a new one", async () => {
        const value = "same-worker";

        const worker = lworker.worker();

        const promise = new Promise((resolve) => {
            worker.onmessage = (event) => {
                if (event.data === value) {
                    resolve(event.data);
                }
            };
        });

        worker.postMessage("foobar");

        lworker.worker().postMessage(value);

        const result = await promise;

        expect(result).to.equals(value);

        lworker.terminate();
        lworker.terminate();

        return promise;
    });

    it("should be able to terminate the worker when all instances are disposed", (done) => {
        expect(lworker.worker()).to.be.an.instanceof(Worker);

        expect(lworker.worker()).to.be.an.instanceof(Worker);

        expect(lworker.terminate()).to.be.an.instanceof(Worker);

        expect(lworker.terminate()).to.be.a("null");

        done();
    });
});
