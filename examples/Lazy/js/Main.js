kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball" },
            { name: "HelloKMD.Test" },
        { name: "Util.Bom", url: "Util" },
        { name: "Util.Vector2", url: "Util" }
    ]

});
define("Main",["Util"], {
    ctor: function () {
        var btn = document.getElementById("crtBtn");
        var balls = [];
        btn.onclick = function () {
            // 不给namespace则默认处于projname下
            //kmdjs.get(["Ball", "Test"]).then(function (Ball, Test) {
            //    var cc = new Test(100);
            //    var ball = new Ball(cc.x, 110, 28, 1, -2, "KMD.js");
            //    balls.push(ball);
            //})
            kmdjs.get(["Ball", "Test"], function (Ball, Test) {
                var cc = new Test(300);
                var ball = new Ball(cc.x, 110, 28, 1, -2, "KMD.js");
                balls.push(ball);

            })
        }        
        var vp = Bom.getViewport();
        setInterval(function () {
            for (var i = 0; i < balls.length; i++) {
                var item = balls[i];
                (item.position.x + item.r * 2 > vp[2] || item.position.x < 0) && (item.vx *= -1);
                (item.position.y + item.r * 2 > vp[3] || item.position.y < 0) && (item.vy *= -1);
            }

            //如果这里改成15，就是ball的定时器一样，导致的结果就是小球在ie6下不反弹...
        }, 100);
    }
})
