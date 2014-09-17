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
        var currentValue=target["__" + prop] = target[prop];
        
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
                 this.toObject(currentValue, target, prop);

            } else {
                for (var cprop in currentValue) {
                    if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {

                        this.watch(currentValue, cprop);
                    }
                }
            }
        }

    },
    toObject: function (arr, target, prop) {
        var obj = {}, i = 0, len = arr.length;
        for (; i < len; i++) {
            obj[i] = arr[i];
        }
        obj.length = len;
        var self = this;

        var methods = ["add", "addAll", "clear", "clone", "concat", "contains", "containsAll", "every", "filter", "forEach", "indexOf", "isEmpty", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "remove", "removeAll", "retainAll", "reverse", "shift", "size", "slice", "some", "sort", "splice", "toString", "unshift", "valueOf"], mStr = methods.join(",");
       // Array.prototype.slice.call({ 0: "a", 1: "b", length: 2 })===>["a", "b"]
        methods.forEach(function (item) {
            (function (item) {
                obj[item] = function () {
                    
                    var temp = Array.prototype.slice.call(this);
                    //  console.log(item)
                    var result = temp[item].apply(temp, Array.prototype.slice.call(arguments));

                    if (item != "toString") {
                      
                        self.toObject(temp, target, prop);

                        self.onPropertyChanged();
                    }
                    return result;

                }
            })(item)                     
        })       
        target["__" + prop] = target[prop] = obj;
      
        for (var cprop in obj) {
       
            if (obj.hasOwnProperty(cprop) && cprop != "_super" &&! new RegExp("\\b" + cprop + "\\b").test(mStr)) {
            
                this.watch(obj, cprop);
            }
        }
    }


})