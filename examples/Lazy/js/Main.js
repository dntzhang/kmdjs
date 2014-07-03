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
        var btn = document.getElementById("crtBtn");
        var balls = [];
        btn.onclick = function () {
            // 不给namespace则默认处于projname下
            kmdjs.get("HelloKMD.Ball").then(function (Ball) {
                var ball = new Ball(110, 110, 28, 1, -2, "KMD.js");
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
        }, 100);
    }
})
