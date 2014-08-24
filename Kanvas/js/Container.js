define("Kanvas.Container:Kanvas.DisplayObject", {
    ctor: function () {
        this._super();
        this.children = [];
    },
    draw: function (ctx) {
        for (var i = 0, len = this.children.length; i < len; i++) {
            var child = this.children[i];
            if (!child.isVisible()) continue;
            ctx.save();
            child.updateContext(ctx);
            child.draw(ctx);
            ctx.restore();
        }
    },
    add: function (obj) {
        var len=arguments.length;
        if (len > 1) {
            for(var i=0;i<len;i++){
                var item = arguments[i];
                item && this.children.push(item);
            }
            //this.children.push.apply(this.children, Array.prototype.slice.call(arguments));
        } else {
            obj&&this.children.push(obj);
        }
    },
    _getHitChild: function (ctx,x,y) {
        var l = this.children.length;
        ctx.clearRect(0, 0, 2,2);
        for (var i = l - 1; i >= 0; i--) {
            var child = this.children[i];
            child.x -= x;
            child.y -= y;
            ctx.save();
            child.updateContext(ctx);
            child.draw(ctx);
            ctx.restore();
            child.x += x;
            child.y += y;
            if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                return child;
            }
        }
       
    },
    clone: function () {
        var o = new Container();
        this.cloneProps(o);
        var arr = o.children = [];
        for (var i = this.children.length-1; i >-1; i--) {
            var clone = this.children[i].clone();
            arr.unshift(clone);
        }
        return o;

    }
})