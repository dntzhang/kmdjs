kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball"  },
        { name: "Util.Bom", url: "Util" },
        { name: "Util.Vector2", url: "Util" }
    ]

});
define("Main", ["Util"],{
    ctor: function () {
        var ball = new Ball(0, 0, 28, 1, -2, "KMD.js");
        var vp = Bom.getViewport();
        setInterval(function () {
            (ball.position.x + ball.r * 2 > vp[2] || ball.position.x < 0) && (ball.vx *= -1);
            (ball.position.y + ball.r * 2 > vp[3] || ball.position.y < 0) && (ball.vy *= -1);
        }, 30);
    }
})
