define("Util.Vector2", {
    ctor: function (x,y) {
        this.x = x;
        this.y = y;
    },
    add: function (v) {
        this.x +=v.x;
        this.y += v.y;
    },
    sub: function (v) {
        this.x -= v.x;
        this.y -= v.y;
    }
})