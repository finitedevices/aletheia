Module.onRuntimeInitialized = function() {
    console.log("Runtime initialised");

    Module.setup();

    requestAnimationFrame(function render() {
        Module.loop();

        requestAnimationFrame(render);
    })
};