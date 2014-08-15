define("Kanvas.Stage:Kanvas.Container", {
    ctor: function (canvas) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    },
    add: function (obj) {
        this.children.push(obj);
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw(this.ctx);
    }
})