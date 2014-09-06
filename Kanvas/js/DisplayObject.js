define("Kanvas.DisplayObject", {
    ctor: function () {
        this.alpha=this.scaleX = this.scaleY = 1;
        this.x = this.y = this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
        this.visible = true;
        this._matrix = new Matrix2D();
        this.events = {};
        this.id = UID.get();     
    },
    isVisible: function () {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    },
    updateContext: function (ctx) {
        var mtx = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
        //http://www.w3.org/TR/2dcontext/#transformations
        //a	c	tx
        //b	d	ty
        //0	0	1
        //transform(a, b, c, d, e, f)
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        ctx.globalAlpha *= this.alpha;
    },
    on: function (type, fn) {
        ["mouseover", "mousemove", "mouseout", "touchstart", "touchmove", "touchend"].join("_").match(type)&&(Stage.checkMove = true);
        this.events[type] || (this.events[type] = []);
        this.events[type].push(fn)
    },
    execEvent: function (type) {
        var fns = this.events[type];

            this._fireFns(fns);
    },
    hover: function (over,out) {
        this.on("mouseover", over);
        this.on("mouseout", out);
    },
    _fireFns: function (fns) {
        if (fns) {
            for (var i = 0, len = fns.length; i < len; i++) {
                fns[i].call(this);
            }
        }
    },
    clone : function() {
        var o = new DisplayObject();
        this.cloneProps(o);
        return o;
    },
    cloneProps: function (o) {
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
})