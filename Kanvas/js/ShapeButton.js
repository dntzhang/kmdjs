define("Kanvas.UI.ShapeButton:Kanvas.UI.Button", ["Kanvas"],{
    ctor: function (shape, txt) {

        var up = new Container();
        up.add(shape, txt);
        var down = up.clone();
        down.x++;
        down.y++;
        var over = up.clone();
        over.x--;
        over.y--;
        this._super(up, down,over);
    }

})


