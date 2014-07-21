define("Vector2", {
    init: function (x,y) {
        this.x = x || 0;
        this.y = y || 0;
    },
    distanceToSquared: function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    }


})