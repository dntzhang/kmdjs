define("Kanvas.Bitmap:Kanvas.DisplayObject", {
    ctor: function (img) {
        this._super();
        this.img = img;
    },
    draw: function (ctx) {
        ctx.drawImage(this.img, 0, 0);
    }


})