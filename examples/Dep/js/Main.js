kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    deps:[
      { name: "HelloKMD.Ball" }
    ],
    classes: [
        { name: "Util.Bom", url: "Util" }
    ]

});
define("Main",["Util"], {
    init: function () {
        var btn = document.getElementById("crtBtn");
        var balls = [];
        btn.onclick = function () {
                var ball = new Ball(10, 110, 28, 1, -2, "KMD.js");
                balls.push(ball);
        }
        var vp = Bom.getViewport();
        setInterval(function () {
            for (var i = 0; i < balls.length; i++) {
                var item = balls[i];
                (item.position.x + item.r * 2 > vp[2] || item.position.x < 0) && (item.vx *= -1);
                (item.position.y + item.r * 2 > vp[3] || item.position.y < 0) && (item.vy *= -1);
            }

            //如果这里改成15，就是ball的定时器一样，导致的结果就是小球在ie6下不反弹...
        }, 30);
    }
})
