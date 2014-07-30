define("SmallBall", {
    ctor: function (x, y, r, ctx) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vx =Util.random(-4, 4);
        this.vy = Util.random(-4, 4);
        this.ctx = ctx;
        this.color = Util.randomColor();
    },
    render: function () {
        this.ctx.fillStyle =this.color;
        this.ctx.beginPath();

        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    },
    tick: function () {
        this.x += this.vx;
        this.y += this.vy;
        (this.x < this.r || this.x + this.r > this.ctx.canvas.width) && (this.vx *= -1);
        (this.y < this.r || this.y + this.r > this.ctx.canvas.height) && (this.vy *= -1);
        this.render();
    }
})
