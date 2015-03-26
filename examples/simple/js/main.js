kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball" },
	//the same as :  { name: "Util.Bom",url:"./js/Util" }  , "[./] can ignore the baseUrl "
        { name: "Util.Bom",url:"util/bom.js" }
    ]
});
define("Main",["Util"], {
    ctor: function () {
            var ball = new Ball(0, 0, 28, 1, -2, "KMD.js");
            var vp = Bom.getViewport();
            var self = this;
            setInterval(function () {
                ball.tick();
                self.checkCollision(ball, vp);
            }, 15);
    },
    checkCollision: function (ball, vp) {
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }
})
