let jobs = [];

const args = process.argv;

const libraryArg = args.indexOf("--library") > -1;
const demoArg = args.indexOf("--demo") > -1;

const noArgs = !libraryArg && !demoArg;

if (libraryArg || noArgs) {
    jobs.push(import("./build/tasks/library.mjs"));
}

if (demoArg || noArgs) {
    jobs.push(import("./build/tasks/demo.mjs"));
}

(async () => await Promise.all(jobs))();
