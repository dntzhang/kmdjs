//create by kmdjs   https://github.com/kmdjs/kmdjs 
(function (n) {
    var initializing = !1, fnTest = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, __class = function () { }; __class.extend = function (n) { function i() { !initializing && this.ctor && this.ctor.apply(this, arguments) } var f = this.prototype, u, r, t; initializing = !0, u = new this, initializing = !1; for (t in n) t != "statics" && (u[t] = typeof n[t] == "function" && typeof f[t] == "function" && fnTest.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = f[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (i.prototype = u, n.statics) for (t in n.statics) n.statics.hasOwnProperty(t) && (i[t] = n.statics[t], t == "ctor" && i[t]()); return i.prototype.constructor = i, i.extend = arguments.callee, i.implement = function (n) { for (var t in n) u[t] = n[t] }, i };

    ; (function () {
        var Kanvas = {};
        Kanvas.Shape = {}
        var HelloKanvas = {};

        //begin-------------------HelloKanvas.Main---------------------begin

        HelloKanvas.Main = __class.extend({
            "ctor": function () {
                var ld = new Kanvas.Loader(),
                    pgBmp;
                ld.loadRes([{
                    id: "kmd",
                    src: "img/kmd.png"
                }, {
                    id: "pig",
                    src: "img/pig.png"
                }, {
                    id: "hero",
                    src: "img/hero-m.png"
                }]);
                ld.complete(function () {
                    var bmp = new Kanvas.Bitmap(ld.get("kmd"));
                    bmp.x = 100;
                    bmp.y = 100;
                    stage.add(bmp);
                    pgBmp = new Kanvas.Bitmap(ld.get("pig"));
                    pgBmp.x = 164;
                    pgBmp.y = 334;
                    pgBmp.regX = 64;
                    pgBmp.regY = 64;
                    stage.add(pgBmp);
                    pgBmp.on("click", function () {
                        alert("i am a pig");
                    });
                    pgBmp.hover(function () {
                        this.scaleX = this.scaleY = 1.1;
                    }, function () {
                        this.scaleX = this.scaleY = 1;
                    });
                    var ss = {
                        framerate: 10,
                        imgs: [ld.get("hero"), ld.get("pig")],
                        frames: [[64, 64, 64, 64], [128, 64, 64, 64], [192, 64, 64, 64], [256, 64, 64, 64], [320, 64, 64, 64], [384, 64, 64, 64], [448, 64, 64, 64]],
                        animations: {
                            walk: {
                                frames: [0, 1, 2, 3, 4, 5, 6],
                                next: "run",
                                speed: 2,
                                loop: false
                            },
                            jump: {}
                        }
                    };
                    var sp = new Kanvas.Sprite(ss);
                    sp.y = 200;
                    sp.hover(function () {
                        this.scaleX = this.scaleY = 1.1;
                    }, function () {
                        this.scaleX = this.scaleY = 1;
                    });
                    stage.add(sp);
                });
                var stage = new Kanvas.Stage("#ourCanvas");
                var text = new Kanvas.Txt("Hello Kanvas!", "bold 36px Arial", "green");
                text.x = 140;
                text.y = 100;
                text.regX = 100;
                text.regY = 20;
                text.skewX = 30;
                text.skewY = -30;
                text.rotation = 20;
                stage.add(text);
                stage.update();
                var text2 = new Kanvas.Txt("KMD:Kill AMD and CMD!", "bold 26px Arial", "red");
                text2.y = 400;
                text2.on("click", function () {
                    alert(this.text);
                });
                var text3 = new Kanvas.Txt("Click Me!", "bold 46px Arial", "blue");
                text3.y = 230;
                text3.x = 50;
                text3.on("click", function () {
                    alert(this.text);
                });
                stage.add(text2, text3);
                var circle = new Kanvas.Shape.Circle(55, "red");
                circle.x = 60;
                circle.y = 60;
                circle.on("click", function () {
                    alert("i'm a red ball!");
                });
                circle.on("mouseover", function () {
                    circle.scaleX = circle.scaleY = 1.1;
                });
                circle.on("mouseout", function () {
                    circle.scaleX = circle.scaleY = 1;
                });
                var circle2 = new Kanvas.Shape.Circle(35, "green");
                circle2.x = 60;
                circle2.y = 60;
                circle2.on("click", function () {
                    alert("i'm a green ball!");
                });
                circle2.hover(function () {
                    this.scaleX = this.scaleY = 1.1;
                }, function () {
                    this.scaleX = this.scaleY = 1;
                });
                var circle3 = new Kanvas.Shape.Circle(18, "yellow");
                circle3.x = 60;
                circle3.y = 60;
                stage.add(circle, circle2, circle3);
                circle3.hover(function () {
                    this.scaleX = this.scaleY = 1.1;
                }, function () {
                    this.scaleX = this.scaleY = 1;
                });
                var ctt = new Kanvas.Container();
                ctt.x = 268;
                ctt.y = 58;
                var circle4 = new Kanvas.Shape.Circle(48, "#777777");
                var test4 = new Kanvas.Txt("Container!", "bold 16px Arial", "white");
                test4.regX = 40;
                test4.regY = 8;
                ctt.add(circle4, test4);
                stage.add(ctt);
                ctt.on("click", function () {
                    alert("i am a Container!");
                });
                var step = .05;
                Kanvas.RAF.requestInterval(function () {
                    text.rotation++;
                    ctt.scaleX += step;
                    ctt.scaleY += step;
                    ctt.scaleY > 2 && (step *= -1);
                    ctt.scaleY < .5 && (step *= -1);
                    if (pgBmp) pgBmp.rotation--;
                    stage.update();
                }, 15);
            }
        });

        //end-------------------HelloKanvas.Main---------------------end

        //begin-------------------Kanvas.DisplayObject---------------------begin

        Kanvas.DisplayObject = __class.extend({
            "ctor": function () {
                this.scaleX = this.scaleY = 1;
                this.x = this.y = this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
                this._matrix = new Kanvas.Matrix2D();
                this.events = {};
                this.id = Kanvas.UID.get();
            },
            "updateContext": function (ctx) {
                var mtx = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
                ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            },
            "on": function (type, fn) {
                if (type == "mouseover" || type == "mousemove" || type == "mouseout") {
                    Kanvas.Stage.checkMove = true;
                }
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
            }
        });

        //end-------------------Kanvas.DisplayObject---------------------end

        //begin-------------------Kanvas.Bitmap---------------------begin

        Kanvas.Bitmap = Kanvas.DisplayObject.extend({
            "ctor": function (img) {
                this._super();
                this.img = img;
            },
            "draw": function (ctx) {
                ctx.drawImage(this.img, 0, 0);
            }
        });

        //end-------------------Kanvas.Bitmap---------------------end

        //begin-------------------Kanvas.Loader---------------------begin

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

        //end-------------------Kanvas.Loader---------------------end

        //begin-------------------Kanvas.Sprite---------------------begin

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

        //end-------------------Kanvas.Sprite---------------------end

        //begin-------------------Kanvas.Container---------------------begin

        Kanvas.Container = Kanvas.DisplayObject.extend({
            "ctor": function () {
                this._super();
                this.children = [];
            },
            "draw": function (ctx) {
                for (var i = 0, len = this.children.length; i < len; i++) {
                    var child = this.children[i];
                    ctx.save();
                    child.updateContext(ctx);
                    child.draw(ctx);
                    ctx.restore();
                }
            },
            "add": function (obj) {
                if (arguments.length > 1) {
                    this.children.push.apply(this.children, Array.prototype.slice.call(arguments));
                } else {
                    this.children.push(obj);
                }
            },
            "_getHitChild": function (ctx, x, y) {
                var l = this.children.length;
                ctx.clearRect(0, 0, 2, 2);
                for (var i = l - 1; i >= 0; i--) {
                    var child = this.children[i];
                    child.x -= x;
                    child.y -= y;
                    ctx.save();
                    child.updateContext(ctx);
                    child.draw(ctx);
                    ctx.restore();
                    child.x += x;
                    child.y += y;
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                        return child;
                    }
                }
            }
        });

        //end-------------------Kanvas.Container---------------------end

        //begin-------------------Kanvas.Txt---------------------begin

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
            }
        });

        //end-------------------Kanvas.Txt---------------------end

        //begin-------------------Kanvas.Stage---------------------begin

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
                this.canvas.addEventListener("mousemove", this._handleMousemove.bind(this), false);
                this.offset = this._getXY(this.canvas);
                this.overObj = null;
            },
            "update": function () {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.draw(this.ctx);
            },
            "_handleClick": function (evt) {
                var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
                if (child) child.execEvent("click");
            },
            "_handleMousemove": function (evt) {
                if (!Kanvas.Stage.checkMove) return;
                var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
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
            "_getClientXY": function (el) {
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
                return [_l, _t];
            },
            "_getXY": function (el) {
                var xy = this._getClientXY(el);
                xy[0] = xy[0] + this._getScrollLeft();
                xy[1] = xy[1] + this._getScrollTop();
                return xy;
            },
            "_getScrollLeft": function (el) {
                var scrollLeft;
                if (el) {
                    scrollLeft = el.scrollLeft;
                } else {
                    scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                }
                return scrollLeft || 0;
            },
            "_getScrollTop": function (el) {
                var scrollTop;
                if (el) {
                    scrollTop = el.scrollTop;
                } else {
                    scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                }
                return scrollTop || 0;
            }
        });

        //end-------------------Kanvas.Stage---------------------end

        //begin-------------------Kanvas.Shape.Circle---------------------begin

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
            }
        });

        //end-------------------Kanvas.Shape.Circle---------------------end

        //begin-------------------Kanvas.RAF---------------------begin

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

        //end-------------------Kanvas.RAF---------------------end

        //begin-------------------Kanvas.UID---------------------begin

        Kanvas.UID = __class.extend({
            "statics": {
                "_nextID": 0,
                "get": function () {
                    return this._nextID++;
                }
            }
        });

        //end-------------------Kanvas.UID---------------------end

        //begin-------------------Kanvas.Matrix2D---------------------begin

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

        //end-------------------Kanvas.Matrix2D---------------------end

        new HelloKanvas.Main();
    })();
})(this)