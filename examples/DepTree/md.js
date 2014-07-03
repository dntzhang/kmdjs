var define, require;
; (function () {
    var modules = {};
    window.modules = modules;
    require = function (deps, callback) {
        _excuCallback(typeof deps == "string" ? [deps] : deps, callback);
    }

    define = function (name, deps, callback) {
        if (arguments.length === 1) throw "the module must take a name";
        if (arguments.length === 2) {
            modules[name] = deps();
        } else {
            modules[name] = _excuCallback(deps, callback);
        }
    }

    _excuCallback = function (deps, callback) {
       
        var len = deps.length, moduleArr = [];
        for (var i = 0; i < len; i++) {
            moduleArr.push(modules[deps[i]]);
        }
        return callback.apply(null, moduleArr);
    }
})();