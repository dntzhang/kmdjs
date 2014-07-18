define("Ket.Util.Base", {
    statics: {
        isUndefined: function (o) {
            return typeof (o) === "undefined";
        },
        isNull: function (o) {
            return o === null;
        }

    }
});