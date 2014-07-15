kmdjs.config({
    name:"HelloKMD",
    baseUrl: "js",
    classes: [
        { name: "HelloKMD.Ball" },
        { name: "HelloKMD.Test" },
        { name: "Util.Bom", url: "Util" },
        { name: "MathHelper.Vector2", url: "MathHelper" },
        { name: "Util.Vector2", url: "Util" }        
    ]

});
define("Main",["Util"], {
    init: function () {
        var btn = document.getElementById("crtBtn");
        var balls = [];
        var v = new MathHelper.Vector2(111, 110, 28, 1, -2, "KMD.js");
        var v2 = new Util.Vector2(111, 110, 28, 1, -2, "KMD.js");
        var v3 = new Vector2(111, 110, 28, 1, -2, "KMD.js");
        var xxx = "Util.Vector2   MathHelper.Vector2";
        test("Test Same Class Name Conflict", function () {
            equal(v.scope, "MathHelper.Vector2");
        });
        test("Test Same Class Name Conflict", function () {
            equal(v2.scope, "Util.Vector2");
        });
        test("Test Same Class Name Conflict", function () {
            equal(v3.scope, "Util.Vector2");
        });
        btn.onclick = function () { 
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
