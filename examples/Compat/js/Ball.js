define("Ball", ["jquery-1.11.1.min"], {
    init: function (x,y,r,vx,vy,text) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = 2 * r;
        this.vx = vx;
        this.vy = vy;
        this.text = text;
        this.element = document.createElement("div");
        this.element.innerHTML = text;
        this.element.style.cssText = "text-align:center;position:absolute; -moz-border-radius:" + this.d + "px; border-radius: " + this.d + "px; width: " + this.d + "px; height: " + this.d + "px;background-color:green;line-height:" + this.d + "px;color:white;";
        $("body").append($(this.element));
        var self = this;
        //时间之沙--小球
        this.loop = setInterval(function () {
            self.tick();
        }, 15)
    },
    tick: function () {
        this.x += this.vx;
        this.y += this.vy;
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }

})
