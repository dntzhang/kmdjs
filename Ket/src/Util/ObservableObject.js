define("Util.ObservableObject", {

    ctor: function () {
        var self = this;
        for (var prop in this) {
            if (this.hasOwnProperty(prop) && prop != "_super") {
                this["__" + prop] = this[prop];
                (function (prop) {
                    Object.defineProperty(self, prop, {
                        get: function () {
                            return this["__" + prop]
                        },
                        set: function (value) {
                            this["__" + prop] = value;
                            self.onPropertyChanged(prop,value)
                        }
                    })
                })(prop)


            }
        }
    },
    onPropertyChanged: function (prop, value) {
        
       // alert(prop +" ___ "+ value);
    }

})