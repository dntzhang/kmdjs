define("Util.Helper", {

    statics: {
        type: function (obj) {
            var typeStr=Object.prototype.toString.call(obj).split(" ")[1];
            return typeStr.substr(0, typeStr.length - 1).toLowerCase();
        },
        isArray: function (obj) {
            return this.type(obj) == "array";
        },
        trim: function (str) {
            if (String.prototype.trim) return str.trim();
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        each: function (obj, callback) {
            if (this.type(obj) == "array") {
                for (var i = 0, len = obj.length; i < len; i++) {
                    callback.call(obj,i, obj[i]);
                }
            } else if (this.type(obj) == "object") {
                for (var name in obj) {
                    obj.hasOwnProperty(name) && callback.call(obj,name, obj[name]);
                }
            }
        }
    }

})