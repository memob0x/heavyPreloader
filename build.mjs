(async () =>
    await Promise.all([
        import("./build/tasks/library.mjs"),
        import("./build/tasks/demo.mjs"),
    ]))();
