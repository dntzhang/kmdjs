define("Kanvas.Shape.Circle:Kanvas.DisplayObject", {
    ctor: function (r, color, isHollow) {
        this._super();
        this.r = r||1;
        this.color = color || "black";
        this.isHollow = isHollow;
      
    },
    draw: function (ctx) {
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());


    },
    clone: function () {
        var c = new Circle(this.r, this.color, this.isHollow);
        this.cloneProps(c);
        return c;
    }


})