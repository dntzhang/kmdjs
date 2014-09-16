define("Util.Observable", {
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
                currentValue = this.toObject(currentValue);
                target["__" + prop] = target[prop] = currentValue;
            }
            for (var cprop in currentValue) {
                if (currentValue.hasOwnProperty(cprop) && cprop != "_super" ) {
         
                    this.watch(currentValue, cprop);
                }
            }
        }

    },
    toObject: function (arr) {   
        var obj = {}, i = 0, len = arr.length;
        for (; i < len; i++) {
            obj[i] = arr[i];
        }
        obj.length = len;
        //["add", "addAll", "clear", "clone", "concat", "contains", "containsAll", "every", "filter", "forEach", "indexOf", "isEmpty", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "remove", "removeAll", "retainAll", "reverse", "shift", "size", "slice", "some", "sort", "splice", "toString", "unshift", "valueOf"]
        var self = this;
        obj.push = function (item) {
            this[obj.length] = item;
                      
            self.watch(this, this.length);
            //触发change
            this.length++;
        }
      
        obj.toString = function () {
          
          
            var str = "";
            for (var i = 0; i < this.length; i++) {
            
                str += this[i];
                str += i == this.length - 1 ? "" : ",";
            }
            
            return str;
        }
        return obj;
    }

})