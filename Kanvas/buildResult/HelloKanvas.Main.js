(function (n) {
    function l(n, t, u) { var f = i.createElement("script"), s; u && (s = isFunction(u) ? u(n) : u, s && (f.charset = s)), a(f, t, n), f.async = !0, f.src = n, o = f, e ? r.insertBefore(f, e) : r.appendChild(f), o = null } function a(n, t, i) { function u(i) { n.onload = n.onerror = n.onreadystatechange = null, c.debug || r.removeChild(n), n = null, t(i) } var f = "onload" in n; f ? (n.onload = u, n.onerror = function () { throw "bad request!__" + i + "  404 (Not Found) "; }) : n.onreadystatechange = function () { /loaded|complete/.test(n.readyState) && u() } } function v(n, t) { var r, i; if (n.lastIndexOf) return n.lastIndexOf(t); for (r = t.length, i = n.length - 1 - r; i > -1; i--) if (t === n.substr(i, r)) return i; return -1 } var h = "HelloKanvas", i = document, c = {}, r = i.head || i.getElementsByTagName("head")[0] || i.documentElement, e = r.getElementsByTagName("base")[0], o, u = {}, t; u.get = function (n, i) { var f, e, o, u, r, s; for (typeof n == "string" && (n = [n]), r = 0, u = n.length; r < u; r++) v(n[r], ".") == -1 && (n[r] = h + "." + n[r]); for (f = !0, e = [], r = 0, u = n.length; r < u; r++) t.modules[n[r]] ? e.push(t.modules[n[r]]) : f = !1; if (f) i.apply(null, e); else for (o = 0, u = n.length, r = 0; r < u; r++) s = [], l(n[r] + ".js", function () { if (o++, o == u) { for (var r = 0; r < u; r++) t.modules[n[r]] && s.push(t.modules[n[r]]); i.apply(null, s) } }) }, u.exec = function (n) { for (var u, o, s, r = 0, f = n.length; r < f; r++) { var i = n[r], e = [], h = new Function(i.a, i.b); for (u = 0, o = i.d.length; u < o; u++) e.push(t.modules[i.d[u]]); s = h.apply(null, e), t.modules[i.c] = s } }, n.kmdjs = u; var f = !1, y = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, s = function () { }; s.extend = function (n) { function i() { !f && this.ctor && this.ctor.apply(this, arguments) } var e = this.prototype, u, r, t; f = !0, u = new this, f = !1; for (t in n) t != "statics" && (u[t] = typeof n[t] == "function" && typeof e[t] == "function" && y.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = e[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (n.statics) for (t in n.statics) t == "ctor" ? n.statics[t].call(i) : i[t] = n.statics[t]; return i.prototype = u, i.prototype.constructor = i, i.extend = arguments.callee, i }, n.__class = s, t = {}, t.modules = {}, n.__modules = t.modules;

    ; (function () {

        var Matrix2D = __class.extend({
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
                    var r = rotation * Matrix2D.DEG_TO_RAD;
                    var cos = Math.cos(r);
                    var sin = Math.sin(r);
                } else {
                    cos = 1;
                    sin = 0;
                }
                if (skewX || skewY) {
                    skewX *= Matrix2D.DEG_TO_RAD;
                    skewY *= Matrix2D.DEG_TO_RAD;
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

        var DisplayObject = __class.extend({
            "ctor": function () {
                this.scaleX = this.scaleY = 1;
                this.x = this.y = this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
                this._matrix = new Matrix2D();
                this.events = {};
            },
            "updateContext": function (ctx) {
                var mtx = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
                ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            },
            "on": function (type, fn) {
                this.events[type] || (this.events[type] = []);
                this.events[type].push(fn);
            },
            "execEvent": function (evt) {
                var fns = this.events[evt.type];
                if (fns) {
                    for (var i = 0, len = fns.length; i < len; i++) {
                        fns[i].call(this);
                    }
                }
            }
        });

        var Container = DisplayObject.extend({
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
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                for (var i = l - 1; i >= 0; i--) {
                    var child = this.children[i];
                    ctx.save();
                    child.updateContext(ctx);
                    child.draw(ctx);
                    ctx.restore();
                    if (ctx.getImageData(x, y, 1, 1).data[3] > 1) {
                        return child;
                    }
                }
            }
        });

        var Stage = Container.extend({
            "ctor": function (canvas) {
                this._super();
                this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
                this.ctx = this.canvas.getContext("2d");
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.hitCanvas = document.createElement("canvas");
                this.hitCanvas.width = this.width;
                this.hitCanvas.height = this.height;
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
                this.offset = this._getXY(this.canvas);
            },
            "update": function () {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.draw(this.ctx);
            },
            "_handleClick": function (evt) {
                var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
                if (child) child.execEvent(evt);
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

        var Txt = DisplayObject.extend({
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

        var Bitmap = DisplayObject.extend({
            "ctor": function (img) {
                this._super();
                this.img = img;
            },
            "draw": function (ctx) {
                ctx.drawImage(this.img, 0, 0);
            }
        });

        var Circle = DisplayObject.extend({
            "ctor": function (r, color, isHollow) {
                this._super();
                this.r = r || 1;
                this.color = color || "black";
                this.isHollow = isHollow;
            },
            "draw": function (ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());
            }
        });

        var Main = __class.extend({
            "ctor": function () {
                var stage = new Stage("#ourCanvas");
                var text = new Txt("Hello Kanvas!", "bold 36px Arial", "green");
                text.x = 140;
                text.y = 100;
                text.regX = 100;
                text.regY = 20;
                text.skewX = 30;
                text.skewY = -30;
                text.rotation = 20;
                stage.add(text);
                stage.update();
                var text2 = new Txt("KMD:Kill AMD and CMD!", "bold 26px Arial", "red");
                text2.y = 400;
                text2.on("click", function () {
                    alert(this.text);
                });
                var text3 = new Txt("Click Me!", "bold 46px Arial", "blue");
                text3.y = 230;
                text3.x = 50;
                text3.on("click", function () {
                    alert(this.text);
                });
                var kmdImg = new Image();
                kmdImg.onload = function () {
                    var bmp = new Bitmap(kmdImg);
                    bmp.x = 100;
                    bmp.y = 100;
                    stage.add(bmp);
                };
                kmdImg.src = "img/kmd.png";
                var pigImg = new Image(),
                    pgBmp;
                pigImg.onload = function () {
                    pgBmp = new Bitmap(pigImg);
                    pgBmp.x = 164;
                    pgBmp.y = 334;
                    pgBmp.regX = 64;
                    pgBmp.regY = 64;
                    stage.add(pgBmp);
                    pgBmp.on("click", function () {
                        alert("i am a pig");
                    });
                };
                pigImg.src = "img/pig.png";
                stage.add(text2, text3);
                var circle = new Circle(55, "red");
                circle.x = 30;
                circle.y = 30;
                circle.on("click", function () {
                    alert("i'm a red ball!");
                });
                var circle2 = new Circle(35, "green");
                circle2.x = 30;
                circle2.y = 30;
                circle2.on("click", function () {
                    alert("i'm a green ball!");
                });
                var circle3 = new Circle(18, "yellow");
                circle3.x = 30;
                circle3.y = 30;
                stage.add(circle, circle2, circle3);
                var ctt = new Container();
                ctt.x = 268;
                ctt.y = 58;
                var circle4 = new Circle(48, "#777777");
                var test4 = new Txt("Container!", "bold 16px Arial", "white");
                test4.regX = 40;
                test4.regY = 8;
                ctt.add(circle4, test4);
                stage.add(ctt);
                ctt.on("click", function () {
                    alert("i am a Container!");
                });
                setInterval(function () {
                    text.rotation++;
                    if (pgBmp) pgBmp.rotation--;
                    stage.update();
                }, 15);
            }
        });

        new Main();
    })();
})(this)