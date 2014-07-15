
var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

// The base Class implementation (does nothing)
var __class = function () { };

// Create a new __class that inherits from this class
__class.extend = function (prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        if (name != "statics") {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
              typeof _super[name] == "function" && fnTest.test(prop[name]) ?
              (function (name, fn) {
                  return function () {
                      var tmp = this._super;

                      // Add a new ._super() method that is the same method
                      // but on the super-class
                      this._super = _super[name];

                      // The method only need to be bound temporarily, so we
                      // remove it when we're done executing
                      var ret = fn.apply(this, arguments);
                      this._super = tmp;

                      return ret;
                  };
              })(name, prop[name]) :
              prop[name];
        }
    }

    // The dummy class constructor
    function __class() {
        // All construction is actually done in the init method
        if (!initializing && this.init)
            this.init.apply(this, arguments);
    }

    for (var key in this) {
        if (this.hasOwnProperty(key) && key != "extend")
            __class[key] = this[key];
    }
   
    if (prop.statics) {
        for (var name in prop.statics) {
            if (name == "init") {
                prop["statics"][name].call(__class);
            } else {
                if (prop.statics.hasOwnProperty(name)) {
                    __class[name] = prop.statics[name];
                }
            }
        }
    }
    // Populate our constructed prototype object
    __class.prototype = prototype;

    // Enforce the constructor to be what we expect
    __class.prototype.constructor = __class;

    // And make this class extendable
    __class.extend = arguments.callee;

    return __class;
};