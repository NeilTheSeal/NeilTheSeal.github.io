(function () {
  var prev = Module.onRuntimeInitialized;
  Module.onRuntimeInitialized = function () {
    if (typeof prev === "function")
      try {
        prev();
      } catch (e) {}
    try {
      if (typeof HEAPU8 !== "undefined" && HEAPU8) Module.HEAPU8 = HEAPU8;
      if (typeof HEAP8 !== "undefined" && HEAP8) Module.HEAP8 = HEAP8;
      if (typeof wasmMemory !== "undefined" && wasmMemory)
        Module.wasmMemory = wasmMemory;
    } catch (e) {}
  };
})();
