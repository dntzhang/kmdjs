define("Kanvas.Stage:Kanvas.Container", {
    statics: {
        checkMove: false
    },
    ctor: function (canvas) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.scale = 1;
        this.scaleCanvasOffset={x:0,y:0};
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

        this.InstanceOfName = "Stage";
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw(this.ctx);
    },
    _handleClick: function (evt) {
        var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1],"click");
       // if (child) child.execEvent("click");
    },
    _handleMouseMove: function (evt) {
        var x = evt.pageX - this.offset[0], y = evt.pageY - this.offset[1];
        if (this.canScale && this.isMouseDown) {
            var dx =x- this.prePosition[0] ;
            var dy =y- this.prePosition[1] ;
            var preX = this.scaleCanvasOffset.x;
            var preY = this.scaleCanvasOffset.y;
            this.scaleCanvasOffset.x += dx;
            this.scaleCanvasOffset.y += dy;
            this.redraw(this.scaleCanvasOffset.x, this.scaleCanvasOffset.y, this.scale, preX, preY);
            this.prePosition[0] = x;
            this.prePosition[1] = y;
        }
        if (!Stage.checkMove) return;
        var child = this._getHitChild(this.hitCtx, x,y);
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
    scalable: function () {
        this.canScale = true;
        var self = this;
        Wheel.Hamster(this.canvas).wheel(function (e, delta, deltaX, deltaY) {
            var positionX = e.pageX - self.offset[0], positionY = e.pageY - self.offset[1];

            var width = self.width * self.scale;
            var height = self.height * self.scale;
            var xRatio = (positionX - self.scaleCanvasOffset.x) / width;
            var yRatio = (positionY - self.scaleCanvasOffset.y) / height;
            var preX = self.scaleCanvasOffset.x;
            var preY = self.scaleCanvasOffset.y;
            if (deltaY < 0) {
                self.scale -= 0.1;
                if (self.scale < 0.1) {
                    self.scale = 0.1
                    return;
                }
                self.scaleCanvasOffset.x += (self.width) * 0.1 * xRatio;
                self.scaleCanvasOffset.y += (self.height) * 0.1 * yRatio;
            } else {
                self.scale += 0.1;
                self.scaleCanvasOffset.x -= (self.width) * 0.1 * xRatio;
                self.scaleCanvasOffset.y -= (self.height) * 0.1 * yRatio;
            };
            self.redraw(self.scaleCanvasOffset.x, self.scaleCanvasOffset.y, deltaY < 0 ? (self.scale + 0.1) : (self.scale - 0.1), preX, preY);

            e.preventDefault();
        });
    },
    redraw: function (x, y, preScale, preX, preY) {
     
 
        for (var i = 0, len = this.children.length; i < len; i++) {
            var child = this.children[i];
            child.x = (this.scale * (child.x - preX) / preScale) + x;
            child.y = (this.scale * (child.y - preY) / preScale) + y;
            child.scaleX = this.scale * child.scaleX / preScale;
            child.scaleY = this.scale * child.scaleY / preScale;
        }
        this.update();

    },
    _handleMouseDown: function (evt) {
        var positionX = evt.pageX - this.offset[0], positionY = evt.pageY - this.offset[1];
        if (this.canScale) {
            this.canvas.style.cursor = "move";
            this.prePosition = [positionX, positionY];
            this.isMouseDown = true;
        }
        
        var child = this._getHitChild(this.hitCtx, positionX, positionY, "mousedown");
      //  if (child) child.execEvent("mousedown");
    },

    _handleMouseUp: function (evt) {
        if (this.canScale) {
            this.canvas.style.cursor = "default";
            this.isMouseDown = false;
        }
        var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1], "mouseup");
       // if (child) child.execEvent("mouseup");
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


