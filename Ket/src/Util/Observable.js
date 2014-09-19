define("Util.Observable", {
    statics: {
        ctor: function () {
   
            this.methods = ["concat",  "every", "filter", "forEach", "indexOf","join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight",   "reverse", "shift",  "slice", "some", "sort", "splice", "unshift", "valueOf"], this.mStr = this.methods.join(","), this.triggerStr =["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift"].join(",");
        }
    },
    ctor: function () {
        this.observe();      
    },
    observe:function(){
        for (var prop in this) {
            if (this.hasOwnProperty(prop) && prop != "_super") {
                this.watch(this, prop);
            }
        }
    },
    change: function (fn) {
        this.propertyChangedHandler = fn;
    },
    onPropertyChanged: function (prop, value) {
        this.propertyChangedHandler && this.propertyChangedHandler(prop, value);
    },
    watch: function (target, prop) {
        //不再watch内部的
        if (prop.substr(0, 2) == "__") return;
        var self = this;
        if (Helper.isArray(target) &&Helper.isFunction(target[prop])) return;
        var currentValue = target["__" + prop] = target[prop];
        Object.defineProperty(target, prop, {
            get: function () {
                return this["__" + prop]
            },
            set: function (value) {
                this["__" + prop] = value;
                self.onPropertyChanged(prop, value)
            }
        })

        if (typeof currentValue == "object") {
            if (Helper.isArray(currentValue)) {
                Observable.methods.forEach(function (item) {
                    currentValue[item] = function () {
                        
                        var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                        for (var cprop in this) {
                            if (this.hasOwnProperty(cprop) && cprop != "_super" && !new RegExp("\\b" + cprop + "\\b").test(Observable.mStr)) {
                                self.watch(this, cprop);
                            }
                        }

                        if (new RegExp("\\b" + item + "\\b").test(Observable.triggerStr)) {
                       
                            self.onPropertyChanged("array", item);
                        }
                        return result;
                    }

                })
            }
            for (var cprop in currentValue) {
                if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {

                    this.watch(currentValue, cprop);
                }
            }
        }
    }


})