define("Kanvas.Stage:Kanvas.Container", {
    ctor: function (canvas) {
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
                return __method.apply(object,
                     args.concat(Array.prototype.slice.call(arguments)));
            }
        }
     
        this.canvas.addEventListener("click", this._handleClick.bind(this), false);
     
        this.offset = this._getXY(this.canvas);
    },
    add: function (obj) {
        if (arguments.length > 1) {
            this.children.push.apply(this.children, Array.prototype.slice.call(arguments));
        } else {
            this.children.push(obj);
        }
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw(this.ctx);
    },
    _handleClick: function (evt) {
        var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
        if (child) child.execEvent(evt);
    },
    _getClientXY : function (el) {
        var _t = 0,
            _l = 0;

        if (el) {
            if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
                var box = { left: 0, top: 0, right: 0, bottom: 0 };//
                try {
                    box = el.getBoundingClientRect();
                    _l = box.left;
                    _t = box.top;
                } catch (ex) {
                    alert(1)
                    return [0, 0];
                }
            } else {//这里只有safari执行。
                while (el.offsetParent) {
                    _t += el.offsetTop;
                    _l += el.offsetLeft;
                    el = el.offsetParent;
                }
            }
        }
        return [_l, _t];
    },

    _getXY : function (el) {
        var xy = this._getClientXY(el);

        xy[0] = xy[0] + this._getScrollLeft();
        xy[1] = xy[1] + this._getScrollTop();
        return xy;
    },

    _getScrollLeft : function (el) {
        var scrollLeft;
        if (el) {
            scrollLeft = el.scrollLeft;
        } else {
            scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        }
        return scrollLeft || 0;
    },

    _getScrollTop : function (el) {
        var scrollTop;
        if (el) {
            scrollTop = el.scrollTop;
        } else {
            scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }
        return scrollTop || 0;
    }

})


