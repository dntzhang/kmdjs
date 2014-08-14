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
    }

})