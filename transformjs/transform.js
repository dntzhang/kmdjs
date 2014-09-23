; (function (win) {
    var initializing = !1, fnTest = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, __class = function () { }; __class.export = []; __class.extend = function (n) { __class.export.push(n); function i() { !initializing && this.ctor && this.ctor.apply(this, arguments) } var f = this.prototype, u, r, t; initializing = !0, u = new this, initializing = !1; for (t in n) t != "statics" && (u[t] = typeof n[t] == "function" && typeof f[t] == "function" && fnTest.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = f[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (i.prototype = u, n.statics) for (t in n.statics) n.statics.hasOwnProperty(t) && (i[t] = n.statics[t], t == "ctor" && i[t]()); return i.prototype.constructor = i, i.extend = arguments.callee, i.implement = function (n) { for (var t in n) u[t] = n[t] }, i };

    var observable = __class.extend({
        "statics": {
            "ctor": function () {
                this.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "valueOf"],
                this.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift"].join(",");
            },
            "type": function (obj) {
                var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
                return typeStr.substr(0, typeStr.length - 1).toLowerCase();
            },
            "isArray": function (obj) {
                return this.type(obj) == "array";
            },
            "isInArray": function (arr, item) {
                for (var i = arr.length; --i > -1;) {
                    if (item === arr[i]) return true;
                }
                return false;
            },
            "isFunction": function (obj) {
                return this.type(obj) == "function";
            },
            "watch": function (target, arr) {
                return new this(target, arr);
            }
        },
        "ctor": function (target, arr) {
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    if ((arr && observable.isInArray(arr, prop)) || !arr) {
                        this.watch(target, prop);
                    }
                }
            }
            if (target.change) throw "naming conflicts！observable will extend 'change' method to your object ."
            var self = this;
            target.change = function (fn) {
                self.propertyChangedHandler = fn;
            }
        },
        "onPropertyChanged": function (prop, value) {
            this.propertyChangedHandler && this.propertyChangedHandler(prop, value);
        },
        "mock": function (target) {
            var self = this;
            observable.methods.forEach(function (item) {
                target[item] = function () {
                    var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                    for (var cprop in this) {
                        if (this.hasOwnProperty(cprop) && cprop != "_super" && !observable.isFunction(this[cprop])) {
                            self.watch(this, cprop);
                        }
                    }
                    if (new RegExp("\\b" + item + "\\b").test(observable.triggerStr)) {
                        self.onPropertyChanged("array", item);
                    }
                    return result;
                };
            });
        },
        "watch": function (target, prop) {
            if (prop.substr(0, 2) == "__") return;
            var self = this;
            if (observable.isFunction(target[prop])) return;

            var currentValue = target["__" + prop] = target[prop];
            Object.defineProperty(target, prop, {
                get: function () {
                    return this["__" + prop];
                },
                set: function (value) {
                    this["__" + prop] = value;
                    self.onPropertyChanged(prop, value);
                }
            });

            if (observable.isArray(target)) {
                this.mock(target);
            }
            if (typeof currentValue == "object") {
                if (observable.isArray(currentValue)) {
                    this.mock(currentValue);
                }
                for (var cprop in currentValue) {
                    if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {
                        this.watch(currentValue, cprop);
                    }
                }
            }
        }
    });

    var matrix2D = __class.extend({

        statics: {
            DEG_TO_RAD: Math.PI / 180
        },
        ctor: function (a, b, c, d, tx, ty) {
            this.a = (a == null) ? 1 : a;
            this.b = b || 0;
            this.c = c || 0;
            this.d = (d == null) ? 1 : d;
            this.tx = tx || 0;
            this.ty = ty || 0;
            return this;
        },
        identity: function () {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        },
        appendTransform: function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * matrix2D.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                skewX *= matrix2D.DEG_TO_RAD;
                skewY *= matrix2D.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            } else {
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }

            if (regX || regY) {
                this.tx -= regX * this.a + regY * this.c;
                this.ty -= regX * this.b + regY * this.d;
            }
            return this;
        },
        append: function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = a * a1 + b * c1;
            this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;
            this.d = c * b1 + d * d1;
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        }
    });

    var transform = __class.extend({
        statics: {
            mix: function (element) {
                new this(element);

            }
        },
        ctor: function (element) {
            element.scaleX = element.scaleY = 1;
            element.x = element.y = element.rotation = element.regX = element.regY = element.skewX = element.skewY = 0;
            element.matrix2D = new matrix2D();
            var observer = observable.watch(element, ["scaleX", "scaleY", "x", "y", "rotation", "regX", "regY", "skewX", "skewY"]);

            this.element = element;
            var self = this;
            observer.propertyChangedHandler = function () {
                var mtx = self.element.matrix2D.identity().appendTransform(self.element.x, self.element.y, self.element.scaleX, self.element.scaleY, self.element.rotation, self.element.skewX, self.element.skewY, self.element.regX, self.element.regY);
                //兼容性前缀
                self.element.style.transform = self.element.style.msTransform = self.element.style.OTransform = self.element.style.MozTransform = self.element.style.webkitTransform = "matrix(" + [mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty].join(",") + ")";
            }
        }

    });



    if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = transform }
    else if (typeof define === 'function' && define.amd) { define(transform) }
        //export to kmd project，以后大家写模块的时候多加下面这几行代码，当耐特在这里谢谢大家了
    else if (typeof define === 'function' && define.kmd) {
        define("observable", __class.export[0]);
        define("matrix2D", __class.export[1]);
        define("transform", __class.export[2]);
        //you can also add any namespace to observable such as blow code:
        define("util.matrix2D", __class.export[1]);
        define("base.observable", __class.export[0]);
        //not: why not   'define("base.transform", ["util","base"], __class.export[2]);'?because transform belong to base, so "base" need not to write.
        define("base.transform", ["util"], __class.export[2]);
    }
    else { win.transform = transform };

})(Function('return this')());