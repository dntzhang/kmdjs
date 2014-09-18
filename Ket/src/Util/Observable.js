define("Util.Observable", {
    statics: {
        ctor: function () {
            //kmd fix了remove，build时候发现的
            if (!Array.prototype.remove) {
                Array.prototype.remove = function (b) {
                    var a = this.indexOf(b);
                    if (a != -1) {
                        this.splice(a, 1);
                        return true
                    }
                    return false;
                }
            }

            this.methods = ["add", "addAll", "clear", "clone", "concat", "contains", "containsAll", "every", "filter", "forEach", "indexOf", "isEmpty", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "remove", "removeAll", "retainAll", "reverse", "shift", "size", "slice", "some", "sort", "splice", "unshift", "valueOf"], this.mStr = this.methods.join(","), this.triggerStr =["add", "addAll", "clear", "concat", "pop", "push", "remove", "removeAll", "reverse", "shift", "slice", "sort", "splice", "unshift"].join(",");
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
        //不再watch内部的,  todo:还有arr的方法
        if (prop.substr(0, 2) == "__") return;
        var self = this;
        if (Helper.isArray(target) && new RegExp("\\b" + prop + "\\b").test(Observable.mStr)) return;
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