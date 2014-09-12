define("Base.Kanvas.DisplayObject", {
    ctor: function () {
        this.alpha=this.scaleX = this.scaleY = 1;
        this.x = this.y = this.rotation = this.regX = this.regY = this.skewX = this.skewY = 0;
        this.visible = true; 
    }
})