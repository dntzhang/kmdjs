define("Kanvas.DisplayObject", {
    ctor: function () {
        this.scaleX = this.scaleY = 1;
        this.x = this.y = this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
        this._matrix = new Matrix2D();
        this.events = {};
    },
    updateContext: function (ctx) {
        var mtx = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
        //http://www.w3.org/TR/2dcontext/#transformations
        //a	c	tx
        //b	d	ty
        //0	0	1
        //transform(a, b, c, d, e, f)
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    },
    on: function (type, fn) {
        this.events[type] || (this.events[type] = []);
        this.events[type].push(fn)
    },
    execEvent: function (evt) {
        var fns = this.events[evt.type];
        if (fns) {
            for (var i = 0, len = fns.length; i < len; i++) {
                fns[i].call(this);
            }
        }
    }
})