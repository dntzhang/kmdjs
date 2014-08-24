define("Kanvas.Stage:Kanvas.Container", {
    statics: {
        checkMove:false
    },
    ctor: function (canvas) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;


        this.hitCanvas = document.createElement("canvas");
        this.hitCanvas.width =1;
        this.hitCanvas.height = 1;
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
        this.canvas.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
        this.canvas.addEventListener("mousedown", this._handleMouseDown.bind(this), false);
        this.canvas.addEventListener("mouseup", this._handleMouseUp.bind(this), false);
        this.offset = this._getXY(this.canvas);

        this.overObj = null;
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw(this.ctx);
    },
    _handleClick: function (evt) {
        var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
        if (child) child.execEvent("click");
    },
    _handleMouseMove: function (evt) {
        if (!Stage.checkMove) return;
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
    _handleMouseDown: function (evt) {
        var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
        if (child) child.execEvent("mousedown");
    },

    _handleMouseUp: function (evt) {
        var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1]);
        if (child) child.execEvent("mouseup");
    },
    _getXY: function (el) {
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
        return [_l + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft), _t + Math.max(document.documentElement.scrollTop, document.body.scrollTop)];
    }  
})


