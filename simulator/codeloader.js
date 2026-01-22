var _loadCode = Module.cwrap("load_code", null, ["number", "number", "number", "number"]);

function loadCode(id, array, offset) {
    var buffer = Module._malloc(array.length);

    Module.HEAPU8.set(array, buffer);

    _loadCode(id, buffer, offset, array.length);

    Module._free(buffer);
}

export function parseAndLoadCode(id, text) {
    var matches = text.match(/([0-9a-fA-F]{4}:|[0-9a-fA-F]{2})+/g);
    var offset = 0;
    var values = [];

    for (var match of matches) {
        if (match.endsWith(":")) {
            loadCode(id, new Uint8Array(values), offset);

            offset = parseInt(match, 16);
            values = [];
        } else {
            values.push(parseInt(match, 16));
        }
    }

    loadCode(id, new Uint8Array(values), offset);
}