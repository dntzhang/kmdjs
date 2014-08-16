define("Kanvas.Container:Kanvas.DisplayObject", {
    ctor: function () {
        this.children = [];
    },
    draw: function (ctx) {
        for (var i = 0, len = this.children.length; i < len; i++) {
            var child=this.children[i];
            ctx.save();
            child.updateContext(ctx);
            child.draw(ctx);
            ctx.restore();          
        }
    },
    _getHitChild: function (ctx,x,y) {
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
})