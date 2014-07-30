define("Ball", ["Util"], {
    ctor: function (x, y, r, vx, vy, text) {
        this.position = new Vector2(x, y);
        this.r = r;
        this.d = 2 * r;
        this.vx = vx;
        this.vy = vy;
        this.text = text;
        this.element = document.createElement("div");
        this.element.innerHTML = text;

        this.element.style.cssText = "text-align:center;position:absolute; -moz-border-radius:" + this.d + "px; border-radius: " + this.d + "px; width: " + this.d + "px; height: " + this.d + "px;background-color:green;line-height:" + this.d + "px;color:white;";
        document.body.appendChild(this.element);
        var self = this;
        this.loop = setInterval(function () {
            self.tick();
        }, 15)
    },
    tick: function () {
        this.position.add({ x: this.vx, y: this.vy });
        this.element.style.left = this.position.x + "px";
        this.element.style.top = this.position.y + "px";
    }

})
