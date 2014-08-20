/// <reference path="qunit.js" />
kmdjs.config({
    name: "HelloKMD",
    baseUrl: "js",
    deps: [
        {
            url: "HelloKMD.Ball.js",
            classes:[
                 { name: "HelloKMD.Ball" },
                 { name: "HelloKMD.BallXXX" }
             ]
        },
        {
            url: "http://htmlcssjs.duapp.com/Bom.js",
            classes: [
                   { name: "Util.Bom" }
            ]

        }
    ],
    classes: [
        { name: "HelloKMD.Animal" },
        { name: "HelloKMD.Pig" },
        { name: "HelloKMD.PigSub" }
    ]

});
define("Main", ["Util"],{
    ctor: function () {
        var anm = new Animal(10);
        test("Object Create", function () {
            equal(anm.age, 10);
        });
        var pig = new Pig(11);
        test("Test _super Method", function () {
            equal(pig.age, 11);
        });
        test("Test Static Property", function () {
            equal(Animal.TestStaticsProperty, 1);
        });
        test("Test Static Method", function () {
            equal(Animal.TestStaticsMethod(), 2);
        });
        test("Sub Method ", function () {
            equal(pig.climbTree(), "猪不能上树");
        });
        pig.eat();
        test("Parent Method Inherit", function () {
            equal(pig.eat(), "nice");
        });
        test("Test Static Property Inherit", function () {
            equal(Pig.TestStaticsProperty, 1);
        });
        test("Test Static Method Inherit", function () {
            equal(Pig.TestStaticsMethod(), 2);
        });

        var ps = new PigSub();
        test("Test Static Method Inherit", function () {
            equal(PigSub.TestStaticsMethod(), 2);
        });

        var a = "//"
        //aaa
        var bb=4
        var aa = 44 / 2;
        new RegExp
        var reg = /\/\//g;
     
        test("Test RegExp", function () {

            equal(reg.test("//"), true);
        })
        /*
        fdsfdsfds
        */
        var d;/* sfs::d"f*/ var e;

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, whitespace = "xx",

        rsibling = /[+~]/,
        rescape = /'|\\/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");
       

        var xxxxxx = 1
        var xx = 2
        function xx() { }

        test("Test Comment and Semicolon ", function () {

            equal(aa, 22);
            equal(bb, 4);
        })

        var ball = new Ball(10, 110, 28, 1, 2, "KMD.js");
        test("Test Dep ", function () {

            equal(ball.r, 28);

        })

        var vp = Bom.getViewport();
        setInterval(function () {
            (ball.position.x + ball.r * 2 > vp[2] || ball.position.x < 0) && (ball.vx *= -1);
            (ball.position.y + ball.r * 2 > vp[3] || ball.position.y < 0) && (ball.vy *= -1);
        }, 30);
    }
})
