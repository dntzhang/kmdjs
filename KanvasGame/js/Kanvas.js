kmdjs.exec([
{
    a: ["DisplayObject"],
    b: function () {
        Kanvas.Shape = Kanvas.DisplayObject.extend({
            "ctor": function () {
                this._super();
                this.cmds = [];
                this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
            },
            "draw": function (ctx) {
                for (var i = 0, len = this.cmds.length; i < len; i++) {
                    var cmd = this.cmds[i];
                    if (this.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                        ctx[cmd[0]] = cmd[1][0];
                    } else {
                        ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
                    }
                }
            },
            "beginPath": function () {
                this.cmds.push(["beginPath", arguments]);
                return this;
            },
            "arc": function () {
                this.cmds.push(["arc", arguments]);
                return this;
            },
            "closePath": function () {
                this.cmds.push(["closePath", arguments]);
                return this;
            },
            "fillStyle": function () {
                this.cmds.push(["fillStyle", arguments]);
                return this;
            },
            "fill": function () {
                this.cmds.push(["fill", arguments]);
                return this;
            },
            "strokeStyle": function () {
                this.cmds.push(["strokeStyle", arguments]);
                return this;
            },
            "lineWidth": function () {
                this.cmds.push(["lineWidth", arguments]);
                return this;
            },
            "stroke": function () {
                this.cmds.push(["stroke", arguments]);
                return this;
            },
            "moveTo": function () {
                this.cmds.push(["moveTo", arguments]);
                return this;
            },
            "lineTo": function () {
                this.cmds.push(["lineTo", arguments]);
                return this;
            },
            "bezierCurveTo": function () {
                this.cmds.push(["bezierCurveTo", arguments]);
                return this;
            },
            "clone": function () { }
        });
        return Shape;

    },
    c: "Kanvas.Shape",
    d: ["Kanvas.DisplayObject"],
    e: "Kanvas.DisplayObject"
},
{
    a: ["Container", "Button"],
    b: function () {
        Kanvas.UI.ShapeButton = Kanvas.UI.Button.extend({
            "ctor": function (shape, txt) {
                var up = new Kanvas.Container();
                up.add(shape, txt);
                var down = up.clone();
                down.x++;
                down.y++;
                var over = up.clone();
                over.x--;
                over.y--;
                this._super(up, down, over);
            }
        });
        return ShapeButton;

    },
    c: "Kanvas.UI.ShapeButton",
    d: ["Kanvas.Container", "Kanvas.UI.Button"],
    e: "Kanvas.UI.Button"
},
{
    a: ["TWEEN"],
    b: function () {
        Kanvas.TWEEN = __class.extend({
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
                    var _easingFunction = Kanvas.TWEEN.Easing.Linear.None;
                    var _interpolationFunction = Kanvas.TWEEN.Interpolation.Linear;
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
                        Kanvas.TWEEN.add(this);
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
                        Kanvas.TWEEN.remove(this);
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
                            return 1 - Kanvas.TWEEN.Easing.Bounce.Out(1 - k);
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
                            if (k < .5) return Kanvas.TWEEN.Easing.Bounce.In(k * 2) * .5;
                            return Kanvas.TWEEN.Easing.Bounce.Out(k * 2 - 1) * .5 + .5;
                        }
                    }
                },
                "Interpolation": {
                    "Linear": function (v, k) {
                        var m = v.length - 1,
                            f = m * k,
                            i = Math.floor(f),
                            fn = Kanvas.TWEEN.Interpolation.Utils.Linear;
                        if (k < 0) return fn(v[0], v[1], f);
                        if (k > 1) return fn(v[m], v[m - 1], m - f);
                        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
                    },
                    "Bezier": function (v, k) {
                        var b = 0,
                            n = v.length - 1,
                            pw = Math.pow,
                            bn = Kanvas.TWEEN.Interpolation.Utils.Bernstein,
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
                            fn = Kanvas.TWEEN.Interpolation.Utils.CatmullRom;
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
                            var fc = Kanvas.TWEEN.Interpolation.Utils.Factorial;
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
        return TWEEN;

    },
    c: "Kanvas.TWEEN",
    d: ["Kanvas.TWEEN"]
},
{
    a: [],
    b: function () {
        Kanvas.UID = __class.extend({
            "statics": {
                "_nextID": 0,
                "get": function () {
                    return this._nextID++;
                }
            }
        });
        return UID;

    },
    c: "Kanvas.UID",
    d: []
},
{
    a: ["Container"],
    b: function () {
        Kanvas.UI.Button = Kanvas.Container.extend({
            "ctor": function (up, down, over, disable) {
                this._super();
                this.up = up;
                this.down = down;
                this.over = over;
                this.disable = disable;
                this.down.visible = false;
                this.over && (this.over.visible = false);
                this.add(this.up, this.down, this.over, this.disable);
                this.on("mousedown", function () {
                    this.down.visible = true;
                    this.up.visible = false;
                    this.over && (this.over.visible = false);
                });
                this.on("mouseup", function () {
                    this.down.visible = false;
                    this.up.visible = true;
                    this.over && (this.over.visible = false);
                });
                if (this.over) {
                    this.hover(function () {
                        this.down.visible = false;
                        this.up.visible = false;
                        this.over.visible = true;
                    }, function () {
                        this.down.visible = false;
                        this.up.visible = true;
                        this.over.visible = false;
                    });
                }
            }
        });
        return Button;

    },
    c: "Kanvas.UI.Button",
    d: ["Kanvas.Container"],
    e: "Kanvas.Container"
},
{
    a: [],
    b: function () {
        Kanvas.RAF = __class.extend({
            "statics": {
                "ctor": function () {
                    var requestAnimFrame = function () {
                        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                        function (callback, element) {
                            window.setTimeout(callback, 1e3 / 60);
                        };
                    }();
                    var requestInterval = function (fn, delay) {
                        if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) return window.setInterval(fn, delay);
                        var start = new Date().getTime(),
                            handle = new Object();

                        function loop() {
                            var current = new Date().getTime(),
                                delta = current - start;
                            if (delta >= delay) {
                                fn.call();
                                start = new Date().getTime();
                            }
                            handle.value = requestAnimFrame(loop);
                        }
                        handle.value = requestAnimFrame(loop);
                        return handle;
                    };
                    var clearRequestInterval = function (handle) {
                        window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) : clearInterval(handle);
                    };
                    this.requestInterval = requestInterval;
                    this.clearRequestInterval = clearRequestInterval;
                }
            }
        });
        return RAF;

    },
    c: "Kanvas.RAF",
    d: []
},
{
    a: ["RAF", "DisplayObject"],
    b: function () {
        Kanvas.Sprite = Kanvas.DisplayObject.extend({
            "ctor": function (option) {
                this._super();
                this.option = option;
                this.currentFrameIndex = 0;
                this.animationFrameIndex = 0;
                this.currentAnimation = "walk";
                this._rect = [0, 0, 10, 10];
                this.img = this.option.imgs[0];
                var self = this;
                this.loop = Kanvas.RAF.requestInterval(function () {
                    var opt = self.option;
                    var frames = opt.animations[self.currentAnimation].frames,
                        len = frames.length;
                    self.animationFrameIndex++;
                    if (self.animationFrameIndex > len - 1) self.animationFrameIndex = 0;
                    self._rect = opt.frames[frames[self.animationFrameIndex]];
                    if (self._rect.length > 4) self.img = opt.imgs[self._rect[4]];
                }, 1e3 / this.option.framerate);
            },
            "draw": function (ctx) {
                ctx.drawImage(this.img, this._rect[0], this._rect[1], this._rect[2], this._rect[3], 0, 0, this._rect[2], this._rect[3]);
            }
        });
        return Sprite;

    },
    c: "Kanvas.Sprite",
    d: ["Kanvas.RAF", "Kanvas.DisplayObject"],
    e: "Kanvas.DisplayObject"
},
{
    a: ["Circle", "DisplayObject"],
    b: function () {
        Kanvas.Shape.Circle = Kanvas.DisplayObject.extend({
            "ctor": function (r, color, isHollow) {
                this._super();
                this.r = r || 1;
                this.color = color || "black";
                this.isHollow = isHollow;
            },
            "draw": function (ctx) {
                ctx.beginPath();
                ctx.arc(0, 0, this.r, 0, Math.PI * 2);
                this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());
            },
            "clone": function () {
                var c = new Kanvas.Shape.Circle(this.r, this.color, this.isHollow);
                this.cloneProps(c);
                return c;
            }
        });
        return Circle;

    },
    c: "Kanvas.Shape.Circle",
    d: ["Kanvas.Shape.Circle", "Kanvas.DisplayObject"],
    e: "Kanvas.DisplayObject"
},
{
    a: [],
    b: function () {
        Kanvas.Loader = __class.extend({
            "ctor": function () {
                this.audios = {};
                this.res = {};
                this.loadedCount = 0;
                this.resCount = -1;
                this.FILE_PATTERN = /(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-%\.]+)(?:\.)(\w+)?(\?\S+)?/i;
                this.ns = 3;
                this.sounds = [];
                for (var i = 0; i < this.ns; i++) this.sounds.push([]);
                this.playing = [];
                this.soundsCount = 0;
            },
            "get": function (id) {
                return this.res[id];
            },
            "loadRes": function (arr) {
                this.resCount = arr.length;
                for (var i = 0; i < arr.length; i++) {
                    if (this._getTypeByExtension(arr[i].src.match(this.FILE_PATTERN)[5]) == "audio") {
                        this.loadAudio(arr[i].id, arr[i].src);
                    } else {
                        this.loadImage(arr[i].id, arr[i].src);
                    }
                }
            },
            "loadImage": function (id, src) {
                var img = document.createElement("img");
                var self = this;
                img.onload = function () {
                    self._handleLoad(this, id);
                    img.onreadystatechange = null;
                };
                img.onreadystatechange = function () {
                    if (img.readyState == "loaded" || img.readyState == "complete") {
                        self._handleLoad(this, id);
                        img.onload = null;
                    }
                };
                img.onerror = function () { };
                img.src = src;
            },
            "loadAudio": function (id, src) {
                var tag = document.createElement("audio");
                tag.autoplay = false;
                this.res[id] = tag;
                tag.src = null;
                tag.preload = "auto";
                tag.onerror = function () { };
                tag.onstalled = function () { };
                var self = this;
                var _audioCanPlayHandler = function () {
                    self.playing[id] = 0;
                    for (var i = 0; i < self.ns; i++) {
                        self.sounds[i][id] = new Audio(src);
                    }
                    self.loadedCount++;
                    self.handleProgress(self.loadedCount, self.resCount);
                    self._clean(this);
                    this.removeEventListener && this.removeEventListener("canplaythrough", _audioCanPlayHandler, false);
                    self.checkComplete();
                };
                tag.addEventListener("canplaythrough", _audioCanPlayHandler, false);
                tag.src = src;
                if (tag.load != null) {
                    tag.load();
                }
            },
            "checkComplete": function () {
                if (this.loadedCount === this.resCount) {
                    this.handleComplete();
                }
            },
            "complete": function (fn) {
                this.handleComplete = fn;
            },
            "progress": function (fn) {
                this.handleProgress = fn;
            },
            "playSound": function (id) {
                this.sounds[this.playing[id]][id].play();
                ++this.playing[id];
                if (this.playing[id] >= this.ns) this.playing[id] = 0;
            },
            "_handleLoad": function (currentImg, id) {
                this._clean(currentImg);
                this.res[id] = currentImg;
                this.loadedCount++;
                if (this.handleProgress) this.handleProgress(this.loadedCount, this.resCount);
                this.checkComplete();
            },
            "_getTypeByExtension": function (extension) {
                switch (extension) {
                    case "jpeg":
                    case "jpg":
                    case "gif":
                    case "png":
                    case "webp":
                    case "bmp":
                        return "img";
                    case "ogg":
                    case "mp3":
                    case "wav":
                        return "audio";
                }
            },
            "_clean": function (tag) {
                tag.onload = null;
                tag.onstalled = null;
                tag.onprogress = null;
                tag.onerror = null;
            }
        });
        return Loader;

    },
    c: "Kanvas.Loader",
    d: []
},
{
    a: ["Matrix2D", "UID", "Stage", "DisplayObject"],
    b: function () {
        Kanvas.DisplayObject = __class.extend({
            "ctor": function () {
                this.alpha = this.scaleX = this.scaleY = 1;
                this.x = this.y = this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
                this.visible = true;
                this._matrix = new Kanvas.Matrix2D();
                this.events = {};
                this.id = Kanvas.UID.get();
            },
            "isVisible": function () {
                return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
            },
            "updateContext": function (ctx) {
                var mtx = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
                ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                ctx.globalAlpha *= this.alpha;
            },
            "on": function (type, fn) {
                ["mouseover", "mousemove", "mouseout", "touchstart", "touchmove", "touchend"].join("_").match(type) && (Kanvas.Stage.checkMove = true);
                this.events[type] || (this.events[type] = []);
                this.events[type].push(fn);
            },
            "execEvent": function (type) {
                var fns = this.events[type];
                this._fireFns(fns);
            },
            "hover": function (over, out) {
                this.on("mouseover", over);
                this.on("mouseout", out);
            },
            "_fireFns": function (fns) {
                if (fns) {
                    for (var i = 0, len = fns.length; i < len; i++) {
                        fns[i].call(this);
                    }
                }
            },
            "clone": function () {
                var o = new Kanvas.DisplayObject();
                this.cloneProps(o);
                return o;
            },
            "cloneProps": function (o) {
                o.visible = this.visible;
                o.alpha = this.alpha;
                o.regX = this.regX;
                o.regY = this.regY;
                o.rotation = this.rotation;
                o.scaleX = this.scaleX;
                o.scaleY = this.scaleY;
                o.skewX = this.skewX;
                o.skewY = this.skewY;
                o.x = this.x;
                o.y = this.y;
            }
        });
        return DisplayObject;

    },
    c: "Kanvas.DisplayObject",
    d: ["Kanvas.Matrix2D", "Kanvas.UID", "Kanvas.Stage", "Kanvas.DisplayObject"]
},
{
    a: ["DisplayObject"],
    b: function () {
        Kanvas.Bitmap = Kanvas.DisplayObject.extend({
            "ctor": function (img) {
                this._super();
                this.img = img;
            },
            "draw": function (ctx) {
                ctx.drawImage(this.img, 0, 0);
            }
        });
        return Bitmap;

    },
    c: "Kanvas.Bitmap",
    d: ["Kanvas.DisplayObject"],
    e: "Kanvas.DisplayObject"
},
{
    a: ["Txt", "DisplayObject"],
    b: function () {
        Kanvas.Txt = Kanvas.DisplayObject.extend({
            "ctor": function (text, font, color) {
                this._super();
                this.text = text;
                this.font = font;
                this.color = color;
                this.textAlign = "left";
                this.textBaseline = "top";
            },
            "draw": function (ctx) {
                ctx.fillStyle = this.color;
                ctx.font = this.font;
                ctx.textAlign = this.textAlign || "left";
                ctx.textBaseline = this.textBaseline || "top";
                ctx.fillText(this.text, 0, 0);
            },
            "clone": function () {
                var t = new Kanvas.Txt(this.text, this.font, this.color);
                this.cloneProps(t);
                return t;
            }
        });
        return Txt;

    },
    c: "Kanvas.Txt",
    d: ["Kanvas.Txt", "Kanvas.DisplayObject"],
    e: "Kanvas.DisplayObject"
},
{
    a: ["Matrix2D"],
    b: function () {
        Kanvas.Matrix2D = __class.extend({
            "statics": {
                "DEG_TO_RAD": 0.017453292519943295
            },
            "ctor": function (a, b, c, d, tx, ty) {
                this.a = a == null ? 1 : a;
                this.b = b || 0;
                this.c = c || 0;
                this.d = d == null ? 1 : d;
                this.tx = tx || 0;
                this.ty = ty || 0;
                return this;
            },
            "identity": function () {
                this.a = this.d = 1;
                this.b = this.c = this.tx = this.ty = 0;
                return this;
            },
            "appendTransform": function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                if (rotation % 360) {
                    var r = rotation * Kanvas.Matrix2D.DEG_TO_RAD;
                    var cos = Math.cos(r);
                    var sin = Math.sin(r);
                } else {
                    cos = 1;
                    sin = 0;
                }
                if (skewX || skewY) {
                    skewX *= Kanvas.Matrix2D.DEG_TO_RAD;
                    skewY *= Kanvas.Matrix2D.DEG_TO_RAD;
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
            "append": function (a, b, c, d, tx, ty) {
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
        return Matrix2D;

    },
    c: "Kanvas.Matrix2D",
    d: ["Kanvas.Matrix2D"]
},
{
    a: ["Stage", "Container"],
    b: function () {
        Kanvas.Stage = Kanvas.Container.extend({
            "statics": {
                "checkMove": false
            },
            "ctor": function (canvas) {
                this._super();
                this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
                this.ctx = this.canvas.getContext("2d");
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.scale = 1;
                this.scaleCanvasOffset = {
                    x: 0,
                    y: 0
                };
                this.hitCanvas = document.createElement("canvas");
                this.hitCanvas.width = 1;
                this.hitCanvas.height = 1;
                this.hitCtx = this.hitCanvas.getContext("2d");
                Function.prototype.bind = function () {
                    var __method = this;
                    var args = Array.prototype.slice.call(arguments);
                    var object = args.shift();
                    return function () {
                        return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
                    };
                };
                this.canvas.addEventListener("click", this._handleClick.bind(this), false);
                this.canvas.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
                this.canvas.addEventListener("mousedown", this._handleMouseDown.bind(this), false);
                this.canvas.addEventListener("mouseup", this._handleMouseUp.bind(this), false);
                this.offset = this._getXY(this.canvas);
                this.overObj = null;
                this.InstanceOfName = "Stage";
            },
            "update": function () {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.draw(this.ctx);
            },
            "_handleClick": function (evt) {
                var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1], "click");
            },
            "_handleMouseMove": function (evt) {
                var x = evt.pageX - this.offset[0],
                    y = evt.pageY - this.offset[1];
                if (this.canScale && this.isMouseDown) {
                    var dx = x - this.prePosition[0];
                    var dy = y - this.prePosition[1];
                    var preX = this.scaleCanvasOffset.x;
                    var preY = this.scaleCanvasOffset.y;
                    this.scaleCanvasOffset.x += dx;
                    this.scaleCanvasOffset.y += dy;
                    this.redraw(this.scaleCanvasOffset.x, this.scaleCanvasOffset.y, this.scale, preX, preY);
                    this.prePosition[0] = x;
                    this.prePosition[1] = y;
                }
                if (!Kanvas.Stage.checkMove) return;
                var child = this._getHitChild(this.hitCtx, x, y);
                if (child) {
                    if (this.overObj) {
                        if (child.id != this.overObj.id) {
                            this.overObj.execEvent("mouseout");
                            child.execEvent("mouseover");
                            this.overObj = child;
                        } else {
                            child.execEvent("mousemove");
                        }
                    } else {
                        this.overObj = child;
                        child.execEvent("mouseover");
                    }
                } else {
                    if (this.overObj) {
                        this.overObj.execEvent("mouseout");
                        this.overObj = null;
                    }
                }
            },
            "scalable": function () {
                this.canScale = true;
                var self = this;
                Wheel.Hamster(this.canvas).wheel(function (e, delta, deltaX, deltaY) {
                    var positionX = e.pageX - self.offset[0],
                        positionY = e.pageY - self.offset[1];
                    var width = self.width * self.scale;
                    var height = self.height * self.scale;
                    var xRatio = (positionX - self.scaleCanvasOffset.x) / width;
                    var yRatio = (positionY - self.scaleCanvasOffset.y) / height;
                    var preX = self.scaleCanvasOffset.x;
                    var preY = self.scaleCanvasOffset.y;
                    if (deltaY < 0) {
                        self.scale -= .1;
                        if (self.scale < .1) {
                            self.scale = .1;
                            return;
                        }
                        self.scaleCanvasOffset.x += self.width * .1 * xRatio;
                        self.scaleCanvasOffset.y += self.height * .1 * yRatio;
                    } else {
                        self.scale += .1;
                        self.scaleCanvasOffset.x -= self.width * .1 * xRatio;
                        self.scaleCanvasOffset.y -= self.height * .1 * yRatio;
                    }
                    self.redraw(self.scaleCanvasOffset.x, self.scaleCanvasOffset.y, deltaY < 0 ? self.scale + .1 : self.scale - .1, preX, preY);
                    e.preventDefault();
                });
            },
            "redraw": function (x, y, preScale, preX, preY) {
                for (var i = 0, len = this.children.length; i < len; i++) {
                    var child = this.children[i];
                    child.x = this.scale * (child.x - preX) / preScale + x;
                    child.y = this.scale * (child.y - preY) / preScale + y;
                    child.scaleX = this.scale * child.scaleX / preScale;
                    child.scaleY = this.scale * child.scaleY / preScale;
                }
                this.update();
            },
            "_handleMouseDown": function (evt) {
                var positionX = evt.pageX - this.offset[0],
                    positionY = evt.pageY - this.offset[1];
                if (this.canScale) {
                    this.canvas.style.cursor = "move";
                    this.prePosition = [positionX, positionY];
                    this.isMouseDown = true;
                }
                var child = this._getHitChild(this.hitCtx, positionX, positionY, "mousedown");
            },
            "_handleMouseUp": function (evt) {
                if (this.canScale) {
                    this.canvas.style.cursor = "default";
                    this.isMouseDown = false;
                }
                var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1], "mouseup");
            },
            "_getXY": function (el) {
                var _t = 0,
                    _l = 0;
                if (el) {
                    if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
                        var box = {
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0
                        };
                        try {
                            box = el.getBoundingClientRect();
                            _l = box.left;
                            _t = box.top;
                        } catch (ex) {
                            alert(1);
                            return [0, 0];
                        }
                    } else {
                        while (el.offsetParent) {
                            _t += el.offsetTop;
                            _l += el.offsetLeft;
                            el = el.offsetParent;
                        }
                    }
                }
                return [_l + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft), _t + Math.max(document.documentElement.scrollTop, document.body.scrollTop)];
            }
        });
        return Stage;

    },
    c: "Kanvas.Stage",
    d: ["Kanvas.Stage", "Kanvas.Container"],
    e: "Kanvas.Container"
},
{
    a: ["Container", "DisplayObject"],
    b: function () {
        Kanvas.Container = Kanvas.DisplayObject.extend({
            "ctor": function () {
                this._super();
                this.children = [];
                this.InstanceOfName = "Container";
            },
            "draw": function (ctx) {
                for (var i = 0, len = this.children.length; i < len; i++) {
                    var child = this.children[i];
                    if (!child.isVisible()) continue;
                    ctx.save();
                    child.updateContext(ctx);
                    child.draw(ctx);
                    ctx.restore();
                }
            },
            "add": function (obj) {
                var len = arguments.length;
                if (len > 1) {
                    for (var i = 0; i < len; i++) {
                        var item = arguments[i];
                        if (item) {
                            this.children.push(item);
                            item.parent = this;
                        }
                    }
                } else {
                    if (obj) {
                        this.children.push(obj);
                        obj.parent = this;
                    }
                }
            },
            "remove": function (obj) {
                var len = arguments.length,
                    childLen = this.children.length;
                if (len > 1) {
                    for (var j = 0; j < len; j++) {
                        var currentObj = arguments[j];
                        for (var k = childLen; --k >= 0;) {
                            if (this.children[k].id == currentObj.id) {
                                currentObj.parent = null;
                                this.children.splice(k, 1);
                                break;
                            }
                        }
                    }
                } else {
                    for (var i = childLen; --i >= 0;) {
                        if (this.children[i].id == obj.id) {
                            obj.parent = null;
                            this.children.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            "_getHitChild": function (ctx, x, y, evtType) {
                var l = this.children.length;
                ctx.clearRect(0, 0, 2, 2);
                for (var i = l - 1; i >= 0; i--) {
                    var child = this.children[i];
                    child.x -= x;
                    child.y -= y;
                    ctx.save();
                    child.updateContext(ctx);
                    child.InstanceOfName == "Container" ? child._hitDraw(ctx, evtType) : child.draw(ctx);
                    ctx.restore();
                    child.x += x;
                    child.y += y;
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                        child.execEvent(evtType);
                        return child;
                    }
                }
            },
            "_hitDraw": function (ctx, evtType) {
                for (var i = this.children.length; --i >= 0;) {
                    var child = this.children[i];
                    if (!child.isVisible()) continue;
                    ctx.save();
                    child.updateContext(ctx);
                    child.InstanceOfName == "Container" ? child._hitDraw(ctx, evtType) : child.draw(ctx);
                    ctx.restore();
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                        child.execEvent(evtType);
                        break;
                    }
                }
            },
            "clone": function () {
                var o = new Kanvas.Container();
                this.cloneProps(o);
                var arr = o.children = [];
                for (var i = this.children.length - 1; i > -1; i--) {
                    var clone = this.children[i].clone();
                    arr.unshift(clone);
                }
                return o;
            },
            "removeAll": function () {
                var kids = this.children;
                while (kids.length) {
                    kids.pop().parent = null;
                }
            }
        });
        return Container;

    },
    c: "Kanvas.Container",
    d: ["Kanvas.Container", "Kanvas.DisplayObject"],
    e: "Kanvas.DisplayObject"
}
])