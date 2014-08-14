define("Kanvas.DisplayObject", {
    ctor: function () {
        this.scaleX = this.scaleY = 1;
    
        this.x=this.y= this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
        


        this._matrix = new Matrix2D();
    },
    draw: function (ctx) {
        ctx.drawImage(this.canvas, this.x, this.y);
    },
    updateContext: function (ctx) {

        var mtx = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
        //http://www.w3.org/TR/2dcontext/#transformations
        //a	c	e
        //b	d	f
        //0	0	1
        //transform(a, b, c, d, e, f)
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    }


})