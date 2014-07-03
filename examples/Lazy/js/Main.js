kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball"  },
        { name: "Util.Bom", url: "Util" },
        { name: "Util.Vector2", url: "Util" }
    ]

});
define("Main",["Util"], {
    init: function () {
        var crtBtn = document.getElementById("crtBtn");
        var balls = [];
        crtBtn.onclick = function () {
            //lazy here
            //kmdjs.get("HelloKMD.Ball", function (Ball) {
            //    var ball = new Ball(100, 100, 28, 1, 2, "KMD.js");
            //    balls.push(ball);
            //});
            //support promise style next version？
            //不给namespace则默认处于projname下
            var aa = "dfsfd //ssdfsdfs";
            kmdjs.get("HelloKMD.Ball").then(function (Ball) {
                var ball = new Ball(100, 100, 28, 1, 2, "KMD.js");
                balls.push(ball);
            });
          
        }
        var vp = Bom.getViewport();
        setInterval(function () {
            for (var i = 0, len = balls.length; i < len; i++) {
                var ball = balls[i], x = ball.position.x, y = ball.position.y;
              
                (x + ball.r * 2 > vp[2] || x < 0) && (ball.vx *= -1);
                (y + ball.r * 2 > vp[3] || y < 0) && (ball.vy *= -1);
            }          
        }, 15)
    }
})
