define("Ball:Kanvas.Shape.Circle", {
    ctor: function (x, y, r, color) {
        this._super(r, color);
        this.x = x;
        this.y = y;
        this.vx = Util.random(-4, 4);
        this.vy = Util.random(-4, 4);
    }
    //tick: function () {
    //    this.x += this.vx;
    //    this.y += this.vy;
    //    (this.x < this.r || this.x + this.r > Game.Stage.canvas.width) && (this.vx *= -1);
    //    (this.y < this.r || this.y + this.r > Game.Stage.canvas.height) && (this.vy *= -1);

    //}
})
