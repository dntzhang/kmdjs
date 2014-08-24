define("Kanvas.UI.Button:Kanvas.Container", {
    ctor: function (up, down, over,disable) {
        this._super();
        this.up = up;
        this.down = down;
        this.over = over;
        this.disable = disable;
        this.down.visible = false;
        this.over&&(this.over.visible = false);

        this.add(this.up, this.down, this.over, this.disable);
        this.on("mousedown", function () {
            this.down.visible = true;
            this.up.visible = false;
            this.over&&(this.over.visible = false);
        })
        this.on("mouseup", function () {
            this.down.visible = false;
            this.up.visible = true;
            this.over&&( this.over.visible = false);
        })
        if (this.over) {
            this.hover(
                function () {
                    this.down.visible = false;
                    this.up.visible = false;
                    this.over.visible = true;
            }, function () {
                this.down.visible = false;
                this.up.visible = true;
                this.over.visible = false;
            })
        }
    }

})


