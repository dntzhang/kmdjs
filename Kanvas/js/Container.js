define("Kanvas.Container:Kanvas.DisplayObject", {
    ctor: function () {
        this._super();
        this.children = [];

        this.InstanceOfName = "Container";
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
                if (item) {
                    this.children.push(item);
                    item.parent = this;
                }
            }
            //this.children.push.apply(this.children, Array.prototype.slice.call(arguments));
        } else {
            if (obj) {
                this.children.push(obj);
                obj.parent = this;
            }
        }
    },
    remove: function (obj) {
        var len = arguments.length,childLen= this.children.length;
        if (len > 1) {
            for (var j = 0; j < len; j++) {
                var currentObj = arguments[j];
                for (var k = childLen; --k >= 0;) {
                    if (this.children[k].id == currentObj.id) {
                        currentObj.parent = null;
                        this.children.splice(k, 1);
                        break;
                    }
                }
            }
        } else {
            for (var i = childLen; --i >= 0;) {
                if (this.children[i].id == obj.id) {
                    obj.parent = null;
                    this.children.splice(i, 1);
                    break;
                }
            }
        }
      

    },
    _getHitChild: function (ctx,x,y,evtType) {
        var l = this.children.length;
        ctx.clearRect(0, 0, 2,2);
        for (var i = l - 1; i >= 0; i--) {
            var child = this.children[i];
            child.x -= x;
            child.y -= y;
            ctx.save();
            child.updateContext(ctx);
            child.InstanceOfName == "Container" ? child._hitDraw(ctx,evtType) : child.draw(ctx);
            ctx.restore();
            child.x += x;
            child.y += y;
            if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                child.execEvent(evtType);
                return child;
            }
        }      
    },
    _hitDraw: function (ctx, evtType) {
        for (var i = this.children.length; --i >= 0;) {
            var child = this.children[i];
            if (!child.isVisible()) continue;
            ctx.save();
            child.updateContext(ctx);
            child.InstanceOfName == "Container" ? child._hitDraw(ctx,evtType) : child.draw(ctx);
            ctx.restore();
            if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                child.execEvent(evtType);
                break;
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

    },
    removeAll: function () {
        var kids = this.children;
        while (kids.length) { kids.pop().parent = null; }
    }
})