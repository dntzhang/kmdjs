define("Ball", {
    ctor: function (x, y, r, ctx) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ctx = ctx;
    },
    render: function () {
        this.ctx.fillStyle = "Black";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    },
    tick: function () {
        this.render();
    }

})
