kmdjs.define("app.Ball",function(){
    var Ball = function (x, y, r, vx, vy, text) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = 2 * r;
        this.vx = vx;
        this.vy = vy;
        this.element = document.createElement("div");
        this.element.innerHTML = text;

        this.element.style.cssText = "text-align:center;position:absolute; -moz-border-radius:" + this.d + "px; border-radius: " + this.d + "px; width: " + this.d + "px; height: " + this.d + "px;background-color:green;line-height:" + this.d + "px;color:white;";
        document.body.appendChild(this.element);

    };

    Ball.prototype.tick= function () {
        this.x += this.vx;
        this.y += this.vy;
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    };

    return Ball;
});