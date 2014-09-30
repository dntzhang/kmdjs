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

    var TWEEN = __class.extend({
        "statics": {
            "ctor": function () {
                if (Date.now === undefined) {
                    Date.now = function () {
                        return new Date().valueOf();
                    };
                }
                this._tweens = [];
            },
            "REVISION": "14",
            "getAll": function () {
                return this._tweens;
            },
            "removeAll": function () {
                this._tweens = [];
            },
            "add": function (tween) {
                this._tweens.push(tween);
            },
            "remove": function (tween) {
                var i = this._tweens.indexOf(tween);
                if (i !== -1) {
                    this._tweens.splice(i, 1);
                }
            },
            "update": function (time) {
                if (this._tweens.length === 0) return false;
                var i = 0;
                time = time !== undefined ? time : typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
                while (i < this._tweens.length) {
                    if (this._tweens[i].update(time)) {
                        i++;
                    } else {
                        this._tweens.splice(i, 1);
                    }
                }
                return true;
            },
            "Tween": function (object) {
                var _object = object;
                var _valuesStart = {};
                var _valuesEnd = {};
                var _valuesStartRepeat = {};
                var _duration = 1e3;
                var _repeat = 0;
                var _yoyo = false;
                var _isPlaying = false;
                var _reversed = false;
                var _delayTime = 0;
                var _startTime = null;
                var _easingFunction = TWEEN.Easing.Linear.None;
                var _interpolationFunction = TWEEN.Interpolation.Linear;
                var _chainedTweens = [];
                var _onStartCallback = null;
                var _onStartCallbackFired = false;
                var _onUpdateCallback = null;
                var _onCompleteCallback = null;
                var _onStopCallback = null;
                for (var field in object) {
                    _valuesStart[field] = parseFloat(object[field], 10);
                }
                this.to = function (properties, duration) {
                    if (duration !== undefined) {
                        _duration = duration;
                    }
                    _valuesEnd = properties;
                    return this;
                };
                this.start = function (time) {
                    TWEEN.add(this);
                    _isPlaying = true;
                    _onStartCallbackFired = false;
                    _startTime = time !== undefined ? time : typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
                    _startTime += _delayTime;
                    for (var property in _valuesEnd) {
                        if (_valuesEnd[property] instanceof Array) {
                            if (_valuesEnd[property].length === 0) {
                                continue;
                            }
                            _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
                        }
                        _valuesStart[property] = _object[property];
                        if (_valuesStart[property] instanceof Array === false) {
                            _valuesStart[property] *= 1;
                        }
                        _valuesStartRepeat[property] = _valuesStart[property] || 0;
                    }
                    return this;
                };
                this.stop = function () {
                    if (!_isPlaying) {
                        return this;
                    }
                    TWEEN.remove(this);
                    _isPlaying = false;
                    if (_onStopCallback !== null) {
                        _onStopCallback.call(_object);
                    }
                    this.stopChainedTweens();
                    return this;
                };
                this.stopChainedTweens = function () {
                    for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                        _chainedTweens[i].stop();
                    }
                };
                this.delay = function (amount) {
                    _delayTime = amount;
                    return this;
                };
                this.repeat = function (times) {
                    _repeat = times;
                    return this;
                };
                this.yoyo = function (yoyo) {
                    _yoyo = yoyo;
                    return this;
                };
                this.easing = function (easing) {
                    _easingFunction = easing;
                    return this;
                };
                this.interpolation = function (interpolation) {
                    _interpolationFunction = interpolation;
                    return this;
                };
                this.chain = function () {
                    _chainedTweens = arguments;
                    return this;
                };
                this.onStart = function (callback) {
                    _onStartCallback = callback;
                    return this;
                };
                this.onUpdate = function (callback) {
                    _onUpdateCallback = callback;
                    return this;
                };
                this.onComplete = function (callback) {
                    _onCompleteCallback = callback;
                    return this;
                };
                this.onStop = function (callback) {
                    _onStopCallback = callback;
                    return this;
                };
                this.update = function (time) {
                    var property;
                    if (time < _startTime) {
                        return true;
                    }
                    if (_onStartCallbackFired === false) {
                        if (_onStartCallback !== null) {
                            _onStartCallback.call(_object);
                        }
                        _onStartCallbackFired = true;
                    }
                    var elapsed = (time - _startTime) / _duration;
                    elapsed = elapsed > 1 ? 1 : elapsed;
                    var value = _easingFunction(elapsed);
                    for (property in _valuesEnd) {
                        var start = _valuesStart[property] || 0;
                        var end = _valuesEnd[property];
                        if (end instanceof Array) {
                            _object[property] = _interpolationFunction(end, value);
                        } else {
                            if (typeof end === "string") {
                                end = start + parseFloat(end, 10);
                            }
                            if (typeof end === "number") {
                                _object[property] = start + (end - start) * value;
                            }
                        }
                    }
                    if (_onUpdateCallback !== null) {
                        _onUpdateCallback.call(_object, value);
                    }
                    if (elapsed == 1) {
                        if (_repeat > 0) {
                            if (isFinite(_repeat)) {
                                _repeat--;
                            }
                            for (property in _valuesStartRepeat) {
                                if (typeof _valuesEnd[property] === "string") {
                                    _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
                                }
                                if (_yoyo) {
                                    var tmp = _valuesStartRepeat[property];
                                    _valuesStartRepeat[property] = _valuesEnd[property];
                                    _valuesEnd[property] = tmp;
                                }
                                _valuesStart[property] = _valuesStartRepeat[property];
                            }
                            if (_yoyo) {
                                _reversed = !_reversed;
                            }
                            _startTime = time + _delayTime;
                            return true;
                        } else {
                            if (_onCompleteCallback !== null) {
                                _onCompleteCallback.call(_object);
                            }
                            for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                                _chainedTweens[i].start(time);
                            }
                            return false;
                        }
                    }
                    return true;
                };
            },
            "Easing": {
                "Linear": {
                    "None": function (k) {
                        return k;
                    }
                },
                "Quadratic": {
                    "In": function (k) {
                        return k * k;
                    },
                    "Out": function (k) {
                        return k * (2 - k);
                    },
                    "InOut": function (k) {
                        if ((k *= 2) < 1) return .5 * k * k;
                        return -.5 * (--k * (k - 2) - 1);
                    }
                },
                "Cubic": {
                    "In": function (k) {
                        return k * k * k;
                    },
                    "Out": function (k) {
                        return --k * k * k + 1;
                    },
                    "InOut": function (k) {
                        if ((k *= 2) < 1) return .5 * k * k * k;
                        return .5 * ((k -= 2) * k * k + 2);
                    }
                },
                "Quartic": {
                    "In": function (k) {
                        return k * k * k * k;
                    },
                    "Out": function (k) {
                        return 1 - --k * k * k * k;
                    },
                    "InOut": function (k) {
                        if ((k *= 2) < 1) return .5 * k * k * k * k;
                        return -.5 * ((k -= 2) * k * k * k - 2);
                    }
                },
                "Quintic": {
                    "In": function (k) {
                        return k * k * k * k * k;
                    },
                    "Out": function (k) {
                        return --k * k * k * k * k + 1;
                    },
                    "InOut": function (k) {
                        if ((k *= 2) < 1) return .5 * k * k * k * k * k;
                        return .5 * ((k -= 2) * k * k * k * k + 2);
                    }
                },
                "Sinusoidal": {
                    "In": function (k) {
                        return 1 - Math.cos(k * Math.PI / 2);
                    },
                    "Out": function (k) {
                        return Math.sin(k * Math.PI / 2);
                    },
                    "InOut": function (k) {
                        return .5 * (1 - Math.cos(Math.PI * k));
                    }
                },
                "Exponential": {
                    "In": function (k) {
                        return k === 0 ? 0 : Math.pow(1024, k - 1);
                    },
                    "Out": function (k) {
                        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
                    },
                    "InOut": function (k) {
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if ((k *= 2) < 1) return .5 * Math.pow(1024, k - 1);
                        return .5 * (-Math.pow(2, -10 * (k - 1)) + 2);
                    }
                },
                "Circular": {
                    "In": function (k) {
                        return 1 - Math.sqrt(1 - k * k);
                    },
                    "Out": function (k) {
                        return Math.sqrt(1 - --k * k);
                    },
                    "InOut": function (k) {
                        if ((k *= 2) < 1) return -.5 * (Math.sqrt(1 - k * k) - 1);
                        return .5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
                    }
                },
                "Elastic": {
                    "In": function (k) {
                        var s, a = .1,
                            p = .4;
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if (!a || a < 1) {
                            a = 1;
                            s = p / 4;
                        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                        return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                    },
                    "Out": function (k) {
                        var s, a = .1,
                            p = .4;
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if (!a || a < 1) {
                            a = 1;
                            s = p / 4;
                        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                        return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
                    },
                    "InOut": function (k) {
                        var s, a = .1,
                            p = .4;
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if (!a || a < 1) {
                            a = 1;
                            s = p / 4;
                        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                        if ((k *= 2) < 1) return -.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                        return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * .5 + 1;
                    }
                },
                "Back": {
                    "In": function (k) {
                        var s = 1.70158;
                        return k * k * ((s + 1) * k - s);
                    },
                    "Out": function (k) {
                        var s = 1.70158;
                        return --k * k * ((s + 1) * k + s) + 1;
                    },
                    "InOut": function (k) {
                        var s = 1.70158 * 1.525;
                        if ((k *= 2) < 1) return .5 * (k * k * ((s + 1) * k - s));
                        return .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
                    }
                },
                "Bounce": {
                    "In": function (k) {
                        return 1 - TWEEN.Easing.Bounce.Out(1 - k);
                    },
                    "Out": function (k) {
                        if (k < 1 / 2.75) {
                            return 7.5625 * k * k;
                        } else if (k < 2 / 2.75) {
                            return 7.5625 * (k -= 1.5 / 2.75) * k + .75;
                        } else if (k < 2.5 / 2.75) {
                            return 7.5625 * (k -= 2.25 / 2.75) * k + .9375;
                        } else {
                            return 7.5625 * (k -= 2.625 / 2.75) * k + .984375;
                        }
                    },
                    "InOut": function (k) {
                        if (k < .5) return TWEEN.Easing.Bounce.In(k * 2) * .5;
                        return TWEEN.Easing.Bounce.Out(k * 2 - 1) * .5 + .5;
                    }
                }
            },
            "Interpolation": {
                "Linear": function (v, k) {
                    var m = v.length - 1,
                        f = m * k,
                        i = Math.floor(f),
                        fn = TWEEN.Interpolation.Utils.Linear;
                    if (k < 0) return fn(v[0], v[1], f);
                    if (k > 1) return fn(v[m], v[m - 1], m - f);
                    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
                },
                "Bezier": function (v, k) {
                    var b = 0,
                        n = v.length - 1,
                        pw = Math.pow,
                        bn = TWEEN.Interpolation.Utils.Bernstein,
                        i;
                    for (i = 0; i <= n; i++) {
                        b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
                    }
                    return b;
                },
                "CatmullRom": function (v, k) {
                    var m = v.length - 1,
                        f = m * k,
                        i = Math.floor(f),
                        fn = TWEEN.Interpolation.Utils.CatmullRom;
                    if (v[0] === v[m]) {
                        if (k < 0) i = Math.floor(f = m * (1 + k));
                        return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
                    } else {
                        if (k < 0) return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                        if (k > 1) return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                        return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
                    }
                },
                "Utils": {
                    "Linear": function (p0, p1, t) {
                        return (p1 - p0) * t + p0;
                    },
                    "Bernstein": function (n, i) {
                        var fc = TWEEN.Interpolation.Utils.Factorial;
                        return fc(n) / fc(i) / fc(n - i);
                    },
                    "Factorial": function (n) {
                        var s = 1,
                            i;
                        if (a[n]) return a[n];
                        for (i = n; i > 1; i--) s *= i;
                        return a[n] = s;
                    },
                    "CatmullRom": function (p0, p1, p2, p3, t) {
                        var v0 = (p2 - p0) * .5,
                            v1 = (p3 - p1) * .5,
                            t2 = t * t,
                            t3 = t * t2;
                        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
                    }
                }
            }
        }
    });

    var matrix3D = __class.extend({

        statics: {
            DEG_TO_RAD: Math.PI / 180
        },
        ctor: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

            this.elements =Float32Array? new Float32Array(16):[];

            // TODO: if n11 is undefined, then just set to identity, otherwise copy all other values into matrix
            //   we should not support semi specification of Matrix4, it is just weird.

            var te = this.elements;

            te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
            te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
            te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
            te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;
        },
        set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

            var te = this.elements;

            te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
            te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
            te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
            te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

            return this;

        },
        identity: function () {
             this.set(

			    1, 0, 0, 0,
			    0, 1, 0, 0,
			    0, 0, 1, 0,
			    0, 0, 0, 1

		    );

            return this;
        },
        append: function (m) {
            return this.multiplyMatrices(this, m);

        },
        multiplyMatrices: function (a, b) {

            var ae = a.elements;
            var be = b.elements;
            var te = this.elements;

            var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
            var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
            var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
            var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

            var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
            var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
            var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
            var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return this;

        },
        appendTransform: function (perspective, x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, regX, regY, regZ) {

            var rx = rotateX * matrix3D.DEG_TO_RAD;
            var cosx = Math.cos(rx);
            var sinx = Math.sin(rx);

            var ry = rotateY * matrix3D.DEG_TO_RAD;
            var cosy = Math.cos(ry);
            var siny = Math.sin(ry);
            var rz = rotateZ * matrix3D.DEG_TO_RAD;
            var cosz = Math.cos(rz);
            var sinz = Math.sin(rz);

            this.append(new matrix3D(
                cosy, 0, siny, x,
                0, 1, 0, y,
                -siny, 0, cosy, z,
                siny / perspective, 0, -cosy / perspective, (perspective - z) / perspective
            ));

            this.append(new matrix3D(
                1, 0, 0, 0,
                0, cosx, sinx, 0,
                0, -sinx, cosx, 0,
                0, sinx / perspective, -cosx / perspective, 1
            ));

            this.append(new matrix3D(
                cosz * scaleX, sinz * scaleY, 0, 0,
               -sinz * scaleX, cosz * scaleY, 0, 0,
                0, 0, 1 * scaleZ, 0,
               0, 0, -1 / perspective, 1
            ));


            if (regX || regY || regZ) {
          
                this.elements[12] -= regX * this.elements[0] + regY * this.elements[4]+ regZ * this.elements[8];
                this.elements[13] -= regX * this.elements[1] + regY * this.elements[5]+ regZ * this.elements[9];
                this.elements[14] -= regX * this.elements[2] + regY * this.elements[6] + regZ * this.elements[10];
            }
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
            element.perspective = 400;
            element.scaleX = element.scaleY = element.scaleZ = 1;
            element.x = element.y = element.z = element.rotateX = element.rotateY=  element.rotateZ= element.regX = element.regY = element.skewX = element.skewY=element.regX=element.regY=element.regZ = 0;
            element.matrix3D = new matrix3D();
            var observer = observable.watch(element, ["x","y","z","scaleX","scaleY","scaleZ","perspective","rotateX", "rotateY", "rotateZ","regX","regY","regZ"]);

            this.element = element;
            var self = this;
            observer.propertyChangedHandler = function () {
                var mtx = self.element.matrix3D.identity().appendTransform(self.element.perspective, self.element.x, self.element.y, self.element.z, self.element.scaleX, self.element.scaleY, self.element.scaleZ, self.element.rotateX, self.element.rotateY, self.element.rotateZ, self.element.regX, self.element.regY, self.element.regZ);
  
                self.element.style.transform = self.element.style.msTransform = self.element.style.OTransform = self.element.style.MozTransform = self.element.style.webkitTransform = "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
            }
        }

    });

    var tojs = __class.extend({
        statics: {
            get: function (selector) {
                return new this(selector);
            },
            actions: ["x", "rotateY"],
            bounceOut:TWEEN.Easing.Bounce.Out,
            linear: TWEEN.Easing.Linear.None,
            quadraticIn:TWEEN.Easing.Quadratic.In,
            quadraticOut:TWEEN.Easing.Quadratic.Out,
            quadraticInOut:TWEEN.Easing.Quadratic.InOut,
            cubicIn:TWEEN.Easing.Cubic.In,
            cubicOut:TWEEN.Easing.Cubic.Out,
            cubicInOut:TWEEN.Easing.Cubic.InOut,
            quarticIn:TWEEN.Easing.Quartic.In,
            quarticOut:TWEEN.Easing.Quartic.Out,
            quarticInOut:TWEEN.Easing.Quartic.InOut,
            quinticIn:TWEEN.Easing.Quintic.In,
            quinticOut:TWEEN.Easing.Quintic.Out,
            quinticInOut:TWEEN.Easing.Quintic.InOut,
            sinusoidalIn:TWEEN.Easing.Sinusoidal.In,
            sinusoidalOut:TWEEN.Easing.Sinusoidal.Out,
            sinusoidalInOut:TWEEN.Easing.Sinusoidal.InOut,
            exponentialIn:TWEEN.Easing.Exponential.In,
            exponentialOut:TWEEN.Easing.Exponential.Out,
            exponentialInOut:TWEEN.Easing.Exponential.InOut,
            circularIn:TWEEN.Easing.Circular.In,
            circularOut:TWEEN.Easing.Circular.Out,
            circularInOut:TWEEN.Easing.Circular.InOut,
            elasticIn:TWEEN.Easing.Elastic.In,
            elasticOut:TWEEN.Easing.Elastic.Out,
            elasticInOut:TWEEN.Easing.Elastic.InOut,
            backIn:TWEEN.Easing.Back.In,
            backOut:TWEEN.Easing.Back.Out,
            backInOut:TWEEN.Easing.Back.InOut,
            bounceIn:TWEEN.Easing.Bounce.In,
            bounceOut:TWEEN.Easing.Bounce.Out,
            bounceInOut:TWEEN.Easing.Bounce.InOut,
            interpolationLinear:TWEEN.Interpolation.Linear,
            interpolationBezier: TWEEN.Interpolation.Bezier,
            interpolationCatmullRom: TWEEN.Interpolation.CatmullRom       
        },
        ctor: function (selector) {    
            this.element = document.querySelector(selector);
            !"perspective" in this.element||transform.mix(this.element);
            this.cmds = [];
            this.index = 0;
            this.loop = setInterval(function () {
                TWEEN.update();
            }, 15);
        },
        to: function () {
            this.cmds.push(["to"]);
            return this;
        },
        x: function () {
            this.cmds[this.cmds.length - 1].push(["x", arguments]);
            return this;
        },
        y: function () {
            this.cmds[this.cmds.length - 1].push(["y", arguments]);
            return this;
        },
        z: function () {
            this.cmds[this.cmds.length - 1].push(["z", arguments]);
            return this;
        },
        rotateX: function () {
            this.cmds[this.cmds.length - 1].push(["rotateX", arguments]);
            return this;
        },
        rotateY: function () {
            this.cmds[this.cmds.length - 1].push(["rotateY", arguments]);
            return this;
        },
        rotateZ: function () {
            this.cmds[this.cmds.length - 1].push(["rotateZ", arguments]);
            return this;
        },
        scaleX: function () {
            this.cmds[this.cmds.length - 1].push(["scaleX", arguments]);
            return this;
        },
        scaleY: function () {
            this.cmds[this.cmds.length - 1].push(["scaleY", arguments]);
            return this;
        },
        scaleZ: function () {
            this.cmds[this.cmds.length - 1].push(["scaleZ", arguments]);
            return this;
        },
        regX: function () {
            this.cmds[this.cmds.length - 1].push(["regX", arguments]);
            return this;
        },
        regY: function () {
            this.cmds[this.cmds.length - 1].push(["regY", arguments]);
            return this;
        },
        regZ: function () {
            this.cmds[this.cmds.length - 1].push(["regZ", arguments]);
            return this;
        },
        perspective: function () {
            this.cmds[this.cmds.length - 1].push(["perspective", arguments]);
            return this;
        },
        begin: function (fn) {
            this.cmds[this.cmds.length - 1].begin = fn;
            return this;
        },
        progress: function (fn) {
            this.cmds[this.cmds.length - 1].progress = fn;
            return this;
        },
        end: function (fn) {
            this.cmds[this.cmds.length - 1].end=fn ;
            return this;
        },
        wait: function () {
            this.cmds.push(["wait", arguments]);
            return this;
        },
        then: function () {
            this.cmds.push(["then", arguments]);
            return this;
        },
        cycle: function () {
            this.cmds.push(["cycle", arguments]);
            return this;
        },
        start: function () {
            //for (var i = 0, l = this.cmds.length; i < l; i++) {
            //    var cmd = this.cmds[i];
            //    this.exec(cmd);
            //}
           // console.log(this.index)
            var len = this.cmds.length;
            if (this.index < len) {
                this.exec(this.cmds[this.index], this.index == len - 1);

            } else {
                 clearInterval(this.loop);
            }
          //  console.log(this.cmds)
        },
        exec: function (cmd, last) {
            var len = cmd.length, self = this;

            switch (cmd[0]) {
                case "to":
                    for (var i = 1; i < len; i++) {

                        var task = cmd[i];
                        var ease = task[1][2];

                        var target = {};
                        var prop = task[0];
                        target[prop] = task[1][0];

                        var t = new TWEEN.Tween(this.element)
                        .to(target, task[1][1])
                         .onStart(function () {
                             if (cmd.start) cmd.start();
                         })
                         .onUpdate(function () {
                             if (cmd.progress) cmd.progress();
                             self.element[prop] = this[prop];
                         })
                        .easing(ease ? ease : tojs.linear)
                        .onComplete(

                            (function (i) {

                                return function () {
                                    if (i == len - 1) {
                                        if (cmd.end) cmd.end();
                                        if (last && self.complete) self.complete();
                                        self.index++;
                                        self.start();
                                    }
                                }
                            })(i)
                        

                        )
                        .start();
                    }
                    break;
                case "wait":
                    setTimeout(function () {
                        self.index++;
                        self.start();
                        if (last && self.complete) self.complete();
                    }, cmd[1][0]);
                    break;
                case "then":
                    var arg = cmd[1][0];
                    arg.index = 0;
                    arg.complete = function () {
                        self.index++;

                        self.start();
                        if (last && self.complete) self.complete();
                    }

                    arg.start()

                    break;
                case "cycle":

                    self.index = cmd[1][0];
                    self.start();
                    // 
                    //this.index=
                    break;

            }

        }

    });

    

    if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = tojs }
    else if (typeof define === 'function' && define.amd) { define(tojs) }
        //export to kmd project，以后大家写模块的时候多加下面这几行代码，当耐特在这里谢谢大家了
    else if (typeof define === 'function' && define.kmd) {
        define("observable", __class.export[0]);
        define("matrix3D", __class.export[1]);
        define("transform", __class.export[2]);
        define("tojs", __class.export[3]);
        //you can also add any namespace to observable such as blow code:
        //define("util.matrix3D", __class.export[1]);
        //define("base.observable", __class.export[0]);
        //note: why not   'define("base.transform", ["util","base"], __class.export[2]);'?because transform belong to base, so "base" need not to write.
        //define("base.transform", ["util"], __class.export[2]);
    }
    else { win.tojs = tojs };

})(Function('return this')());