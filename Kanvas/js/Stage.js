define("Kanvas.Stage:Kanvas.Container", {
    ctor: function (canvas) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.ctx = this.canvas.getContext("2d");
    },
    add: function (obj) {
        this.children.push(obj);
    },
    update: function () {
        this.draw(this.ctx);
    }
})