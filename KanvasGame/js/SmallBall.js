define("SmallBall:Kanvas.Shape.Circle", {
    ctor: function (x, y, r,v, color) {
        this._super(r, color);
        this.x = x;
        this.y = y;      
        var angle = Util.random(0, 360) * Math.PI / 180;
        this.vx = v * Math.sin(angle);
        this.vy =v*Math.cos(angle);
    },
    tick: function () {
        this.x += this.vx;
        this.y += this.vy;
        (this.x < this.r || this.x + this.r > Game.Stage.canvas.width) && (this.vx *= -1);
        (this.y < this.r || this.y + this.r > Game.Stage.canvas.height) && (this.vy *= -1);
      
    }
})
