define("Kanvas.UID", {
    statics: {
        _nextID: 0,
        get: function () {
            return this._nextID++;
        }
    }
})
