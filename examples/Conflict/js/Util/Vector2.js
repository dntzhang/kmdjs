define("Util.Vector2", {
    ctor: function (x, y) {
        this.x = x;
        this.y = y;
        this.scope = "Util.Vector2"
    },
    add: function (v) {
        this.x += v.x;
        this.y += v.y;
    }
})
