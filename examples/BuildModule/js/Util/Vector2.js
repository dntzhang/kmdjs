define("Util.Vector2", {
    init: function (x, y) {
        this.x = x;
        this.y = y;
    },
    add: function (v) {
        this.x += v.x;
        this.y += v.y;
    }
})
